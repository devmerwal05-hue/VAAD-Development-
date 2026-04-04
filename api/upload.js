import { getUploadsBucket, getEnv } from './_config.js';
import { getSupabaseAdmin } from './_supabase.js';
import { applySecurity, getErrorMessage, getRequestBody, logAdminAction, sanitize, verifyAdminSession } from './_security.js';

export const config = { api: { bodyParser: { sizeLimit: '10mb' } } };

export default async function handler(req, res) {
  if (!applySecurity(req, res, { scope: 'upload', maxBodySize: 10 * 1024 * 1024 })) return;

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const auth = await verifyAdminSession(req, res);
  if (!auth) return;

  try {
    const supabaseUrl = getEnv('SUPABASE_URL');
    const serviceKey = getEnv('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!supabaseUrl || !serviceKey) {
      console.error('Missing Supabase config:', { hasUrl: !!supabaseUrl, hasKey: !!serviceKey });
      return res.status(503).json({ error: 'Supabase is not configured. Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in Vercel environment variables.' });
    }

    const body = getRequestBody(req, res);
    if (!body) return;
    const { filename, content_type, data } = body;
    if (typeof data !== 'string' || !data) {
      return res.status(400).json({ error: 'data is required (base64 data URL)' });
    }

    const allowedTypes = ['image/png', 'image/jpeg', 'image/gif', 'image/webp', 'image/svg+xml'];
    const contentType = typeof content_type === 'string' ? content_type : 'image/png';
    if (!allowedTypes.includes(contentType)) {
      return res.status(400).json({ error: 'Unsupported image type. Allowed: PNG, JPG, GIF, WebP, SVG' });
    }

    const fileName = sanitize(filename || `upload-${Date.now()}`, 120).replace(/[^a-zA-Z0-9._-]/g, '_');
    if (!fileName) {
      return res.status(400).json({ error: 'filename is required.' });
    }

    const base64Part = data.includes(',') ? data.split(',')[1] : data;
    if (!base64Part || !/^[A-Za-z0-9+/=\s]+$/.test(base64Part)) {
      return res.status(400).json({ error: 'Invalid base64 image payload.' });
    }

    const sizeBytes = Math.round((base64Part.length * 3) / 4);
    if (sizeBytes > 5 * 1024 * 1024) {
      return res.status(400).json({ error: 'File too large. Maximum 5MB.' });
    }

    const filePath = `${Date.now()}-${fileName}`;
    let fileBuffer;
    try {
      fileBuffer = Buffer.from(base64Part, 'base64');
    } catch {
      return res.status(400).json({ error: 'Invalid base64 image payload.' });
    }

    if (!fileBuffer || fileBuffer.length === 0) {
      return res.status(400).json({ error: 'Image payload is empty.' });
    }

    const bucket = getUploadsBucket();
    const admin = getSupabaseAdmin();

    console.log('Upload attempt:', { bucket, filePath, contentType, size: fileBuffer.length });

    const { error } = await admin.storage
      .from(bucket)
      .upload(filePath, fileBuffer, {
        cacheControl: '31536000',
        contentType,
        upsert: false,
      });

    if (error) {
      console.error('Supabase storage error:', error);
      return res.status(500).json({ error: `Upload failed: ${error.message}` });
    }

    const { data: publicUrlData } = admin.storage.from(bucket).getPublicUrl(filePath);

    await logAdminAction(req, auth, 'upload.image', {
      bucket,
      path: filePath,
      content_type: contentType,
      size_bytes: sizeBytes,
    });

    return res.status(201).json({
      success: true,
      filename: fileName,
      size_bytes: sizeBytes,
      path: filePath,
      url: publicUrlData.publicUrl,
    });
  } catch (error) {
    console.error('Upload API error:', error);
    return res.status(500).json({ error: getErrorMessage(error) });
  }
}

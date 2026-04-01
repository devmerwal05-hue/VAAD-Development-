import { getUploadsBucket, hasSupabaseConfig } from './_config.js';
import { getSupabaseAdmin } from './_supabase.js';
import { applySecurity, getErrorMessage, sanitize, verifyAdminSession } from './_security.js';

export const config = { api: { bodyParser: { sizeLimit: '10mb' } } };

export default async function handler(req, res) {
  if (!applySecurity(req, res, { scope: 'upload', maxBodySize: 10 * 1024 * 1024 })) return;
  if (!verifyAdminSession(req, res)) return;

  try {
    if (!hasSupabaseConfig()) {
      return res.status(503).json({ error: 'Supabase is not configured yet.' });
    }

    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    const { filename, content_type, data } = req.body || {};
    if (typeof data !== 'string' || !data) {
      return res.status(400).json({ error: 'data is required (base64 data URL)' });
    }

    const allowedTypes = ['image/png', 'image/jpeg', 'image/gif', 'image/webp', 'image/svg+xml'];
    const contentType = typeof content_type === 'string' ? content_type : 'image/png';
    if (!allowedTypes.includes(contentType)) {
      return res.status(400).json({ error: 'Unsupported image type' });
    }

    const fileName = sanitize(filename || `upload-${Date.now()}`, 120).replace(/[^a-zA-Z0-9._-]/g, '_');
    const base64Part = data.includes(',') ? data.split(',')[1] : data;
    const sizeBytes = Math.round((base64Part.length * 3) / 4);
    if (sizeBytes > 5 * 1024 * 1024) {
      return res.status(400).json({ error: 'File too large. Maximum 5MB.' });
    }

    const filePath = `${Date.now()}-${fileName}`;
    const fileBuffer = Buffer.from(base64Part, 'base64');
    const bucket = getUploadsBucket();
    const admin = getSupabaseAdmin();

    const { error } = await admin.storage
      .from(bucket)
      .upload(filePath, fileBuffer, {
        cacheControl: '31536000',
        contentType,
        upsert: false,
      });

    if (error) throw error;

    const { data: publicUrlData } = admin.storage.from(bucket).getPublicUrl(filePath);

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

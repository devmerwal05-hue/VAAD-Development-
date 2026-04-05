import { hasSupabaseConfig } from './_config.js';
import { BUDGET_RANGE_VALUES, CONTACT_STATUS, PROJECT_TYPE_VALUES } from './_constants.js';
import { getSupabaseAdmin } from './_supabase.js';
import {
  applySecurity,
  getErrorMessage,
  getRequestBody,
  logAdminAction,
  sanitize,
  verifyAdminSession,
} from './_security.js';

function normalizeNumericId(value) {
  if (typeof value === 'number' && Number.isFinite(value)) {
    const parsed = Math.trunc(value);
    return parsed > 0 ? parsed : null;
  }

  if (typeof value === 'string' && value.trim()) {
    const parsed = Number.parseInt(value.trim(), 10);
    if (Number.isFinite(parsed) && parsed > 0) return parsed;
  }

  return null;
}

export default async function handler(req, res) {
  const scope = req.method === 'POST' ? 'submission' : 'admin';
  if (!applySecurity(req, res, { scope })) return;

  try {
    if (!hasSupabaseConfig()) {
      if (req.method === 'GET') {
        return res.status(200).json([]);
      }
      return res.status(503).json({ error: 'Supabase is not configured yet.' });
    }

    if (req.method === 'POST') {
      const body = getRequestBody(req, res);
      if (!body) return;
      const {
        name,
        email,
        phone,
        company,
        project_type,
        budget_range,
        message,
        website,
        started_at,
      } = body;

      const cleanName = sanitize(name, 200);
      const cleanEmail = sanitize(email, 320);
      const cleanPhone = sanitize(phone || '', 30);
      const cleanCompany = sanitize(company || '', 200);
      const cleanMessage = sanitize(message, 5000);
      const honeypot = sanitize(website || '', 200);
      const startedAt = Number.parseInt(String(started_at || '0'), 10);

      if (honeypot) {
        return res.status(200).json({ success: true });
      }

      if (startedAt && Date.now() - startedAt < 3000) {
        return res.status(400).json({ error: 'Please take a moment to complete the form.' });
      }

      const errors = [];
      if (!cleanName || cleanName.length < 2) errors.push('Name is required (min 2 characters)');
      if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) errors.push('Valid email is required');
      if (!PROJECT_TYPE_VALUES.includes(project_type)) errors.push('Valid project type is required');
      if (!BUDGET_RANGE_VALUES.includes(budget_range)) errors.push('Valid budget range is required');
      if (!cleanMessage || cleanMessage.length < 10) errors.push('Message is required (min 10 characters)');

      if (cleanPhone) {
        const digits = cleanPhone.replace(/[^\d]/g, '');
        if (digits.length < 7 || digits.length > 15) errors.push('Phone number must have 7-15 digits');
        if (!cleanPhone.startsWith('+')) errors.push('Phone must include country code (e.g. +91)');
      }

      if (errors.length > 0) {
        return res.status(400).json({ error: errors.join(', ') });
      }

      const { error } = await getSupabaseAdmin()
        .from('contact_submissions_v2')
        .insert({
          name: cleanName,
          email: cleanEmail.toLowerCase(),
          phone: cleanPhone || null,
          company: cleanCompany || null,
          project_type,
          budget_range,
          message: cleanMessage,
          status: 'new',
        });

      if (error) throw error;
      return res.status(201).json({ success: true });
    }

    if (req.method === 'GET') {
      const auth = await verifyAdminSession(req, res);
      if (!auth) return;

      try {
        const { data, error } = await getSupabaseAdmin()
          .from('contact_submissions_v2')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;

        await logAdminAction(req, auth, 'contact.list', {
          result_count: Array.isArray(data) ? data.length : 0,
        });

        return res.status(200).json(data || []);
      } catch (fetchError) {
        console.error('Contact fetch error:', fetchError);
        return res.status(200).json([]);
      }
    }

    if (req.method === 'PUT') {
      const auth = await verifyAdminSession(req, res);
      if (!auth) return;

      const body = getRequestBody(req, res);
      if (!body) return;
      const { id, status } = body;
      const normalizedId = normalizeNumericId(id);
      if (!normalizedId || !CONTACT_STATUS.includes(status)) {
        return res.status(400).json({ error: 'Invalid status value' });
      }

      const { data, error } = await getSupabaseAdmin()
        .from('contact_submissions_v2')
        .update({ status })
        .eq('id', normalizedId)
        .select()
        .single();

      if (error) throw error;

      await logAdminAction(req, auth, 'contact.status.update', {
        id: normalizedId,
        status,
      });

      return res.status(200).json(data);
    }

    if (req.method === 'DELETE') {
      const auth = await verifyAdminSession(req, res);
      if (!auth) return;

      const body = getRequestBody(req, res);
      if (!body) return;
      const { id } = body;
      const normalizedId = normalizeNumericId(id);
      if (!normalizedId) {
        return res.status(400).json({ error: 'Valid numeric id is required' });
      }

      const { error } = await getSupabaseAdmin()
        .from('contact_submissions_v2')
        .delete()
        .eq('id', normalizedId);

      if (error) throw error;

      await logAdminAction(req, auth, 'contact.delete', { id: normalizedId });

      return res.status(200).json({ ok: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Contact API error:', error);
    return res.status(500).json({ error: getErrorMessage(error) });
  }
}

import { hasSupabaseConfig } from '../_config.js';
import { getSupabaseAdmin } from '../_supabase.js';
import { applySecurity, getErrorMessage, getRequestBody, sanitize, verifyAdminSession } from '../_security.js';

const MAX_ITEMS = 500;
const MAX_VALUE_LEN = 10000;

function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function normalizeUpsertItems(items) {
  if (!Array.isArray(items) || items.length === 0) {
    return { error: 'items must be a non-empty array' };
  }

  if (items.length > MAX_ITEMS) {
    return { error: `Too many items (max ${MAX_ITEMS})` };
  }

  const normalized = [];

  for (let index = 0; index < items.length; index += 1) {
    const item = items[index];
    const section = item?.section;
    const key = item?.key;
    const value = item?.value;

    if (!isNonEmptyString(section) || !isNonEmptyString(key) || typeof value !== 'string') {
      return { error: `Invalid item at index ${index}. Expected { section: string, key: string, value: string }.` };
    }

    normalized.push({
      section: sanitize(section, 50),
      key: sanitize(key, 100),
      value: sanitize(value, MAX_VALUE_LEN),
    });
  }

  return { items: normalized };
}

function normalizeIds(ids) {
  if (!Array.isArray(ids) || ids.length === 0) {
    return { error: 'ids must be a non-empty array' };
  }

  if (ids.length > MAX_ITEMS) {
    return { error: `Too many ids (max ${MAX_ITEMS})` };
  }

  const normalized = [];

  for (let index = 0; index < ids.length; index += 1) {
    const value = ids[index];
    if (typeof value !== 'number' || !Number.isFinite(value) || value <= 0) {
      return { error: `Invalid id at index ${index}. Expected a positive number.` };
    }
    normalized.push(value);
  }

  return { ids: normalized };
}

export default async function handler(req, res) {
  if (!applySecurity(req, res, { scope: 'admin', maxBodySize: 250000 })) return;

  try {
    if (!hasSupabaseConfig()) {
      return res.status(503).json({ error: 'Supabase is not configured yet.' });
    }

    if (!verifyAdminSession(req, res)) return;

    if (req.method === 'POST') {
      const body = getRequestBody(req, res);
      if (!body) return;
      const { items, mode } = body;
      const normalized = normalizeUpsertItems(items);
      if (normalized.error) return res.status(400).json({ error: normalized.error });

      const shouldInsertMissingOnly = mode === 'insert_missing';

      const { data, error } = await getSupabaseAdmin()
        .from('site_content')
        .upsert(normalized.items, {
          onConflict: 'section,key',
          ignoreDuplicates: shouldInsertMissingOnly,
        })
        .select('id, section, key, value, updated_at');

      if (error) throw error;
      return res.status(200).json(data || []);
    }

    if (req.method === 'DELETE') {
      const body = getRequestBody(req, res);
      if (!body) return;
      const { ids } = body;
      const normalized = normalizeIds(ids);
      if (normalized.error) return res.status(400).json({ error: normalized.error });

      const { error } = await getSupabaseAdmin().from('site_content').delete().in('id', normalized.ids);
      if (error) throw error;

      return res.status(200).json({ ok: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Content bulk API error:', error);
    return res.status(500).json({ error: getErrorMessage(error) });
  }
}

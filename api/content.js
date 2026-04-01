import { hasSupabaseConfig } from './_config.js';
import { getSupabaseAdmin, getSupabasePublic } from './_supabase.js';
import { applySecurity, getErrorMessage, sanitize, verifyAdminSession } from './_security.js';

export default async function handler(req, res) {
  if (!applySecurity(req, res, { scope: req.method === 'GET' ? 'public' : 'admin' })) return;

  try {
    if (!hasSupabaseConfig()) {
      if (req.method === 'GET') {
        res.setHeader('Cache-Control', 'no-store');
        return res.status(200).json([]);
      }
      return res.status(503).json({ error: 'Supabase is not configured yet.' });
    }

    if (req.method === 'GET') {
      const { data, error } = await getSupabasePublic()
        .from('site_content')
        .select('id, section, key, value, updated_at')
        .order('section', { ascending: true })
        .order('key', { ascending: true });

      if (error) throw error;

      res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300');
      return res.status(200).json(data);
    }

    if (req.method === 'PUT') {
      if (!verifyAdminSession(req, res)) return;

      const { id, value } = req.body || {};
      if (typeof id !== 'number' || typeof value !== 'string') {
        return res.status(400).json({ error: 'id and value are required' });
      }

      const { data, error } = await getSupabaseAdmin()
        .from('site_content')
        .update({ value: sanitize(value, 10000), updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return res.status(200).json(data);
    }

    if (req.method === 'POST') {
      if (!verifyAdminSession(req, res)) return;

      const { section, key, value } = req.body || {};
      if (typeof section !== 'string' || typeof key !== 'string' || typeof value !== 'string') {
        return res.status(400).json({ error: 'section, key, and value are required' });
      }

      const { data, error } = await getSupabaseAdmin()
        .from('site_content')
        .insert({
          section: sanitize(section, 50),
          key: sanitize(key, 100),
          value: sanitize(value, 10000),
        })
        .select()
        .single();

      if (error) throw error;
      return res.status(201).json(data);
    }

    if (req.method === 'DELETE') {
      if (!verifyAdminSession(req, res)) return;

      const { id } = req.body || {};
      if (typeof id !== 'number') {
        return res.status(400).json({ error: 'Valid numeric id is required' });
      }

      const { error } = await getSupabaseAdmin().from('site_content').delete().eq('id', id);
      if (error) throw error;
      return res.status(200).json({ ok: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Content API error:', error);
    return res.status(500).json({ error: getErrorMessage(error) });
  }
}

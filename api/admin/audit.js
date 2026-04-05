import { applySecurity, getErrorMessage, verifyAdminSession } from '../_security.js';
import { hasSupabaseConfig } from '../_config.js';
import { getSupabaseAdmin } from '../_supabase.js';

function parseLimit(rawValue) {
  if (Array.isArray(rawValue)) {
    return parseLimit(rawValue[0]);
  }

  const parsed = Number.parseInt(String(rawValue || ''), 10);
  if (Number.isNaN(parsed)) return 50;
  return Math.min(Math.max(parsed, 1), 200);
}

export default async function handler(req, res) {
  if (!applySecurity(req, res, { scope: 'admin' })) return;

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const auth = await verifyAdminSession(req, res);
    if (!auth) return;

    if (!hasSupabaseConfig()) {
      return res.status(200).json([]);
    }

    const limit = parseLimit(req.query?.limit);

    const { data, error } = await getSupabaseAdmin()
      .from('admin_audit_logs')
      .select('id, action, actor_user_id, actor_email, actor_role, actor_aal, request_path, request_method, ip_address, user_agent, details, created_at')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;

    return res.status(200).json(data || []);
  } catch (error) {
    console.error('Admin audit API error:', error);
    return res.status(500).json({ error: getErrorMessage(error) });
  }
}

import { applySecurity, clearAdminSession, getRequestBody, hasAdminSession, startAdminSession, verifyAdminPassword } from '../_security.js';

export default async function handler(req, res) {
  if (!applySecurity(req, res, { scope: 'auth' })) return;

  if (req.method === 'GET') {
    return res.status(200).json({ authenticated: hasAdminSession(req) });
  }

  if (req.method === 'POST') {
    const body = getRequestBody(req, res);
    if (!body) return;
    const { password } = body;
    if (verifyAdminPassword(password)) {
      startAdminSession(req, res);
      return res.status(200).json({ authenticated: true });
    }
    return res.status(401).json({ error: 'Invalid password' });
  }

  if (req.method === 'DELETE') {
    clearAdminSession(req, res);
    return res.status(204).end();
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

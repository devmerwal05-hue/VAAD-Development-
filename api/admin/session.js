import {
  applySecurity,
  clearAdminSession,
  getErrorMessage,
  hasAdminSession,
  startAdminSession,
  verifyAdminPassword,
} from '../_security.js';

export default async function handler(req, res) {
  if (!applySecurity(req, res, { scope: 'auth', maxBodySize: 5000 })) return;

  try {
    if (req.method === 'GET') {
      if (!hasAdminSession(req)) {
        return res.status(401).json({ authenticated: false });
      }

      return res.status(200).json({ authenticated: true });
    }

    if (req.method === 'POST') {
      const { password } = req.body || {};
      if (typeof password !== 'string' || password.length < 1) {
        return res.status(400).json({ error: 'Password is required.' });
      }

      if (!verifyAdminPassword(password)) {
        return res.status(401).json({ error: 'Invalid password.' });
      }

      startAdminSession(req, res);
      return res.status(200).json({ authenticated: true });
    }

    if (req.method === 'DELETE') {
      clearAdminSession(req, res);
      return res.status(204).end();
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    return res.status(500).json({ error: getErrorMessage(error) });
  }
}

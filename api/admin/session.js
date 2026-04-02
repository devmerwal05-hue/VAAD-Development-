import { getAllowedOriginSet } from '../_config.js';
import { hasAdminSession, startAdminSession, clearAdminSession, verifyAdminPassword } from '../_security.js';

export default async function handler(req, res) {
  const allowedOrigins = getAllowedOriginSet(req);
  const origin = req.headers.origin;
  
  if (origin && allowedOrigins.has(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
  }
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method === 'GET') {
    const authenticated = hasAdminSession(req);
    return res.status(200).json({ authenticated });
  }

  if (req.method === 'POST') {
    const { password } = req.body || {};
    if (!password) {
      return res.status(400).json({ error: 'Password is required' });
    }
    
    if (!verifyAdminPassword(password)) {
      return res.status(401).json({ error: 'Invalid password' });
    }
    
    startAdminSession(req, res);
    return res.status(200).json({ authenticated: true });
  }

  if (req.method === 'DELETE') {
    clearAdminSession(req, res);
    return res.status(204).end();
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
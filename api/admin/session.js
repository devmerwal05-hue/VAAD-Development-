import {
  applySecurity,
  clearAdminSession,
  getErrorMessage,
  getEnv,
  hasAdminSession,
  startAdminSession,
  verifyAdminPassword,
} from '../_security.js';

export default async function handler(req, res) {
  console.log('=== Session API Request ===');
  console.log('Method:', req.method);
  console.log('URL:', req.url);
  console.log('Headers:', JSON.stringify(req.headers, null, 2).slice(0, 500));
  
  try {
    const securityResult = applySecurity(req, res, { scope: 'auth', maxBodySize: 5000 });
    console.log('Security result:', securityResult);
    if (!securityResult) {
      console.log('Security check returned false');
      return; // Response already sent
    }
  } catch (securityError) {
    console.error('!!! Security apply error:', securityError);
    return res.status(500).json({ error: 'Security error: ' + securityError.message });
  }

  try {
    if (req.method === 'GET') {
      const hasSession = hasAdminSession(req);
      console.log('GET - hasSession:', hasSession);
      return res.status(200).json({ authenticated: hasSession });
    }

    if (req.method === 'POST') {
      console.log('POST body:', req.body);
      const { password } = req.body || {};
      if (typeof password !== 'string' || password.length < 1) {
        return res.status(400).json({ error: 'Password is required.' });
      }

      const isValid = verifyAdminPassword(password);
      console.log('Password valid:', isValid);
      
      if (!isValid) {
        return res.status(401).json({ error: 'Invalid password.' });
      }

      startAdminSession(req, res);
      console.log('Session started, sending success');
      return res.status(200).json({ authenticated: true });
    }

    if (req.method === 'DELETE') {
      clearAdminSession(req, res);
      return res.status(204).end();
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('!!! Session API error:', error);
    return res.status(500).json({ error: getErrorMessage(error) });
  }
}

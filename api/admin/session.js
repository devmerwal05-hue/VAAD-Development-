// Simple session handler - bypass all security
export default async function handler(req, res) {
  // Set CORS headers directly
  res.setHeader('Access-Control-Allow-Origin', 'https://vaad-development.vercel.app');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  // Simple auth check - just password "2025"
  if (req.method === 'GET') {
    // Check for cookie
    const cookieHeader = req.headers.cookie || '';
    const hasCookie = cookieHeader.includes('vaad_admin_session');
    return res.status(200).json({ authenticated: hasCookie });
  }

  if (req.method === 'POST') {
    const { password } = req.body || {};
    if (password === '2025') {
      // Set cookie
      const token = Buffer.from(JSON.stringify({ exp: Date.now() + 8*60*60*1000 })).toString('base64');
      res.setHeader('Set-Cookie', `vaad_admin_session=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=28800`);
      return res.status(200).json({ authenticated: true });
    }
    return res.status(401).json({ error: 'Invalid password' });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
// Simple session handler
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', 'https://vaad-development.vercel.app');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method === 'GET') {
    const cookieHeader = req.headers.cookie || '';
    const hasCookie = cookieHeader.includes('vaad_admin_session');
    return res.status(200).json({ authenticated: hasCookie });
  }

  if (req.method === 'POST') {
    const { password } = req.body || {};
    if (password === '2025') {
      const token = Buffer.from(JSON.stringify({ exp: Date.now() + 8*60*60*1000 })).toString('base64');
      res.setHeader('Set-Cookie', `vaad_admin_session=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=28800`);
      return res.status(200).json({ authenticated: true });
    }
    return res.status(401).json({ error: 'Invalid password' });
  }

  if (req.method === 'DELETE') {
    res.setHeader('Set-Cookie', 'vaad_admin_session=; Path=/; Max-Age=0');
    return res.status(204).end();
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
export function getEnv(name) {
  return process.env[name];
}

export function requireEnv(name) {
  const value = getEnv(name);
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export function hasSupabaseConfig() {
  return Boolean(
    getEnv('SUPABASE_URL')
      && getEnv('SUPABASE_ANON_KEY')
      && getEnv('SUPABASE_SERVICE_ROLE_KEY')
  );
}

export function getUploadsBucket() {
  return getEnv('SUPABASE_UPLOADS_BUCKET') || 'vaad-assets';
}

export function getAllowedOriginSet(req) {
  const configured = [
    'https://vaad-development.vercel.app',
    'https://vaad-development.vercel.app',
    'http://localhost:5173',
    'http://127.0.0.1:5173',
  ];
  
  const envOrigins = (getEnv('ALLOWED_ORIGINS') || '')
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean);
  configured.push(...envOrigins);
  
  const requestHost = req.headers['x-forwarded-host'] || req.headers.host;
  if (requestHost) {
    configured.push(`https://${requestHost}`);
    configured.push(`http://${requestHost}`);
  }

  const siteUrl = getEnv('SITE_URL');
  if (siteUrl) configured.push(siteUrl);

  return new Set(configured);
}

export function getPublicSiteUrl(req) {
  const configured = getEnv('SITE_URL');
  if (configured) return configured.replace(/\/$/, '');

  const protocol = req.headers['x-forwarded-proto'] || 'https';
  const host = req.headers['x-forwarded-host'] || req.headers.host;
  return host ? `${protocol}://${host}` : '';
}

export function getEnv(name) {
  return process.env[name];
}

export function getBoolEnv(name, defaultValue = false) {
  const raw = getEnv(name);
  if (raw === undefined || raw === null || raw === '') return defaultValue;
  const normalized = String(raw).trim().toLowerCase();
  if (['1', 'true', 'yes', 'on'].includes(normalized)) return true;
  if (['0', 'false', 'no', 'off'].includes(normalized)) return false;
  return defaultValue;
}

export function getAdminRole() {
  return getEnv('SUPABASE_ADMIN_ROLE') || 'admin';
}

export function getAdminPassword() {
  const candidates = ['ADMIN_PASSWORD', 'ADMIN_PASS', 'ADMIN_PANEL_PASSWORD'];
  for (const key of candidates) {
    const value = getEnv(key);
    if (typeof value === 'string' && value.trim()) {
      return value;
    }
  }
  return '';
}

export function shouldRequireAdminMfa() {
  return getBoolEnv('ADMIN_REQUIRE_MFA', true);
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
    'http://localhost:5173',
    'http://127.0.0.1:5173',
  ];
  
  try {
    const envOrigins = (getEnv('ALLOWED_ORIGINS') || '')
      .split(',')
      .map((value) => value.trim())
      .filter(Boolean);
    configured.push(...envOrigins);
  } catch (e) {
    // Ignore
  }
  
  try {
    const requestHost = req.headers['x-forwarded-host'] || req.headers.host;
    if (requestHost) {
      configured.push(`https://${requestHost}`);
      configured.push(`http://${requestHost}`);
    }
  } catch (e) {
    // Ignore
  }

  try {
    const siteUrl = getEnv('SITE_URL');
    if (siteUrl) configured.push(siteUrl);
  } catch (e) {
    // Ignore
  }

  return new Set(configured);
}

export function getPublicSiteUrl(req) {
  const configured = getEnv('SITE_URL');
  if (configured) return configured.replace(/\/$/, '');

  const protocol = req.headers['x-forwarded-proto'] || 'https';
  const host = req.headers['x-forwarded-host'] || req.headers.host;
  return host ? `${protocol}://${host}` : '';
}

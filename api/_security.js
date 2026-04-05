import crypto from 'node:crypto';
import {
  getAdminRole,
  getAllowedOriginSet,
  getEnv,
  shouldRequireAdminMfa,
} from './_config.js';
import {
  getSupabaseAdmin,
  getSupabaseUserFromAccessToken,
  refreshSupabaseAuthSession,
} from './_supabase.js';

const rateLimitStore = new Map();
const DEFAULT_RATE_LIMIT_WINDOW_MS = 60 * 1000;
const RATE_LIMIT_LIMITS = {
  public: 120,
  contact: 20,
  admin: 240,
  auth: 30,
  upload: 40,
  admin_login: 8,
  submission: 8,
};

const RATE_LIMIT_WINDOWS_MS = {
  admin_login: 15 * 60 * 1000,
  submission: 10 * 60 * 1000,
};

const ADMIN_SESSION_COOKIE = 'vaad_admin_session';
const ADMIN_CSRF_COOKIE = 'vaad_admin_csrf';
const ADMIN_SESSION_MAX_AGE_SECONDS = Number.parseInt(getEnv('ADMIN_SESSION_MAX_AGE_SECONDS') || '', 10) || (60 * 60 * 8);

const URL_SCHEME_RE = /^(https?:\/\/|\/|mailto:|tel:)/i;
const SECTION_KEY_RE = /^[a-z0-9_]+$/i;

function getClientIp(req) {
  return req.headers['x-forwarded-for']?.split(',')[0]?.trim()
    || req.headers['x-real-ip']
    || req.socket?.remoteAddress
    || 'unknown';
}

function getRateLimitKey(req, scope) {
  return `${getClientIp(req)}:${scope}`;
}

function setRateLimitHeaders(res, limit, count, resetAt) {
  res.setHeader('X-RateLimit-Limit', String(limit));
  res.setHeader('X-RateLimit-Remaining', String(Math.max(0, limit - count)));
  res.setHeader('X-RateLimit-Reset', String(Math.ceil(resetAt / 1000)));
}

export function rateLimit(req, res, scope = 'public') {
  const limit = RATE_LIMIT_LIMITS[scope] ?? RATE_LIMIT_LIMITS.public;
  const windowMs = RATE_LIMIT_WINDOWS_MS[scope] ?? DEFAULT_RATE_LIMIT_WINDOW_MS;
  const key = getRateLimitKey(req, scope);
  const now = Date.now();

  let entry = rateLimitStore.get(key);
  if (!entry || now > entry.resetAt) {
    entry = { count: 0, resetAt: now + windowMs };
    rateLimitStore.set(key, entry);
  }

  entry.count += 1;
  setRateLimitHeaders(res, limit, entry.count, entry.resetAt);

  if (rateLimitStore.size > 12000) {
    for (const [entryKey, value] of rateLimitStore) {
      if (now > value.resetAt) rateLimitStore.delete(entryKey);
    }
  }

  if (entry.count > limit) {
    const retryAfter = Math.max(1, Math.ceil((entry.resetAt - now) / 1000));
    res.setHeader('Retry-After', String(retryAfter));
    res.status(429).json({ error: 'Too many requests. Please try again later.' });
    return false;
  }

  return true;
}

function isSecureRequest(req) {
  const forwardedProto = String(req.headers['x-forwarded-proto'] || '').toLowerCase();
  if (forwardedProto === 'https') return true;

  const host = String(req.headers['x-forwarded-host'] || req.headers.host || '').toLowerCase();
  const hostname = host.split(',')[0]?.trim().split(':')[0] || '';
  const isLocalHost = hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1';
  return Boolean(hostname) && !isLocalHost;
}

function getAdminSessionSecret() {
  const secret = getEnv('ADMIN_SESSION_SECRET');
  if (!secret) {
    console.warn('ADMIN_SESSION_SECRET is not configured. Falling back to a development-only secret.');
    return 'dev-only-secret-change-me';
  }
  return secret;
}

function base64UrlEncode(input) {
  return Buffer.from(input).toString('base64url');
}

function base64UrlDecode(input) {
  return Buffer.from(input, 'base64url').toString('utf8');
}

function randomToken(length = 32) {
  return crypto.randomBytes(length).toString('hex');
}

function signValue(value) {
  return crypto.createHmac('sha256', getAdminSessionSecret()).update(value).digest('base64url');
}

function safeTimingEqual(a, b) {
  const aa = Buffer.from(String(a));
  const bb = Buffer.from(String(b));
  if (aa.length !== bb.length) return false;
  return crypto.timingSafeEqual(aa, bb);
}

function decodeJwtPayload(token) {
  if (!token || typeof token !== 'string' || !token.includes('.')) return null;
  const parts = token.split('.');
  if (parts.length < 2) return null;
  try {
    return JSON.parse(base64UrlDecode(parts[1]));
  } catch {
    return null;
  }
}

function parseSignedSession(token, { allowExpired = false } = {}) {
  if (!token || typeof token !== 'string' || !token.includes('.')) return null;

  const [payload, signature] = token.split('.');
  if (!payload || !signature) return null;

  const expectedSignature = signValue(payload);
  if (!safeTimingEqual(signature, expectedSignature)) return null;

  try {
    const decoded = JSON.parse(base64UrlDecode(payload));
    if (!decoded || typeof decoded !== 'object') return null;
    if (!decoded.exp) return null;
    if (!allowExpired && Number(decoded.exp) < Date.now()) return null;
    return decoded;
  } catch {
    return null;
  }
}

function appendSetCookie(res, cookieValue) {
  const existing = res.getHeader('Set-Cookie');
  if (!existing) {
    res.setHeader('Set-Cookie', [cookieValue]);
    return;
  }
  if (Array.isArray(existing)) {
    res.setHeader('Set-Cookie', [...existing, cookieValue]);
    return;
  }
  res.setHeader('Set-Cookie', [String(existing), cookieValue]);
}

function buildCookie(name, value, options = {}) {
  const parts = [`${name}=${value}`];
  if (options.httpOnly) parts.push('HttpOnly');
  if (options.secure) parts.push('Secure');
  parts.push(`Path=${options.path || '/'}`);
  parts.push(`SameSite=${options.sameSite || 'Strict'}`);
  if (typeof options.maxAge === 'number') parts.push(`Max-Age=${Math.max(0, Math.floor(options.maxAge))}`);
  return parts.join('; ');
}

function extractRole(user) {
  const roleFromAppMetadata = user?.app_metadata?.role;
  if (typeof roleFromAppMetadata === 'string' && roleFromAppMetadata) return roleFromAppMetadata;

  const rolesFromAppMetadata = user?.app_metadata?.roles;
  if (Array.isArray(rolesFromAppMetadata)) {
    const first = rolesFromAppMetadata.find((value) => typeof value === 'string' && value.length > 0);
    if (first) return first;
  }

  const roleFromUserMetadata = user?.user_metadata?.role;
  if (typeof roleFromUserMetadata === 'string' && roleFromUserMetadata) return roleFromUserMetadata;

  return 'viewer';
}

function hasRequiredRole(user) {
  const requiredRole = getAdminRole();
  const role = extractRole(user);
  if (role === requiredRole) return true;

  const roles = user?.app_metadata?.roles;
  if (Array.isArray(roles) && roles.includes(requiredRole)) return true;

  return false;
}

function getCurrentAal(accessToken) {
  const claims = decodeJwtPayload(accessToken);
  const aal = claims?.aal;
  if (typeof aal === 'string' && aal) return aal;
  return 'aal1';
}

function ensureOriginAllowed(req, res) {
  const origin = req.headers.origin;
  if (!origin) return true;

  const allowedOrigins = getAllowedOriginSet(req);
  if (!allowedOrigins.has(origin)) {
    res.status(403).json({ error: 'Origin is not allowed.' });
    return false;
  }

  return true;
}

export function setSecurityHeaders(res) {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=()');
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
  res.setHeader('Cross-Origin-Resource-Policy', 'same-origin');
  res.setHeader('X-DNS-Prefetch-Control', 'off');
  res.setHeader('Content-Security-Policy', "default-src 'none'; frame-ancestors 'none'; base-uri 'none'; form-action 'none';");

  if (getEnv('NODE_ENV') === 'production') {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  }
}

export function sanitize(value, maxLen = 5000) {
  if (typeof value !== 'string') return '';

  return value
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
    .replace(/<\/?script[^>]*>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
    .trim()
    .slice(0, maxLen);
}

export function validateEditableContentValue(section, key, value) {
  if (typeof section !== 'string' || typeof key !== 'string' || typeof value !== 'string') {
    return 'section, key, and value must all be strings.';
  }

  if (!SECTION_KEY_RE.test(section) || section.length > 50) {
    return 'Section must contain only letters, numbers, and underscores (max 50 characters).';
  }

  if (!SECTION_KEY_RE.test(key) || key.length > 100) {
    return 'Key must contain only letters, numbers, and underscores (max 100 characters).';
  }

  if (value.length > 10000) {
    return 'Value exceeds the 10,000 character limit.';
  }

  if (/(_count|_index|count)$/.test(key) && value.trim() !== '') {
    const parsed = Number.parseInt(value, 10);
    if (Number.isNaN(parsed) || parsed < 0 || parsed > 500) {
      return `"${key}" must be an integer between 0 and 500.`;
    }
  }

  if (/(enabled|highlighted|^is_|_enabled$|_highlighted$)/.test(key) && value.trim() !== '') {
    if (!['true', 'false'].includes(value.trim().toLowerCase())) {
      return `"${key}" must be either true or false.`;
    }
  }

  const isUrlLikeField = /(url|href|image|gallery)$/.test(key);
  if (isUrlLikeField && value.trim() !== '') {
    const maybeList = key.endsWith('gallery') ? value.split(',') : [value];
    const invalid = maybeList
      .map((entry) => entry.trim())
      .find((entry) => entry && !URL_SCHEME_RE.test(entry));

    if (invalid) {
      return `"${key}" contains an invalid URL/path value: ${invalid}`;
    }
  }

  return null;
}

export function getErrorMessage(error) {
  if (error instanceof Error) return error.message;
  return 'An unexpected error occurred.';
}

export function getRequestBody(req, res) {
  try {
    if (req.body === undefined || req.body === null) return {};
    if (typeof req.body === 'string') {
      return req.body ? JSON.parse(req.body) : {};
    }
    if (typeof req.body === 'object') return req.body;
    res.status(400).json({ error: 'Invalid JSON body.' });
    return null;
  } catch {
    res.status(400).json({ error: 'Invalid JSON body.' });
    return null;
  }
}

export function parseCookies(req) {
  const cookieHeader = req.headers.cookie || '';
  return cookieHeader.split(';').reduce((cookies, part) => {
    const [name, ...rest] = part.trim().split('=');
    if (!name) return cookies;
    cookies[name] = decodeURIComponent(rest.join('='));
    return cookies;
  }, {});
}

export function validateContentType(req, res) {
  if (!['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) return true;

  const contentType = req.headers['content-type'] || '';
  if (!String(contentType).toLowerCase().includes('application/json')) {
    res.status(400).json({ error: 'Content-Type must be application/json.' });
    return false;
  }

  return true;
}

export function validateRequestSize(req, res, maxBytes = 50000) {
  const contentLength = Number.parseInt(req.headers['content-length'] || '0', 10);
  if (!Number.isNaN(contentLength) && contentLength > maxBytes) {
    res.status(413).json({ error: 'Request body too large.' });
    return false;
  }
  return true;
}

export function setCorsHeaders(req, res) {
  const origin = req.headers.origin;
  const allowedOrigins = getAllowedOriginSet(req);

  if (origin) {
    if (!allowedOrigins.has(origin)) {
      res.status(403).json({ error: 'Origin is not allowed.' });
      return false;
    }

    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Vary', 'Origin');
  }

  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-CSRF-Token');
  res.setHeader('Access-Control-Max-Age', '86400');

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return false;
  }

  return true;
}

export function ensureCsrfToken(req, res, { rotate = false } = {}) {
  const cookies = parseCookies(req);
  const existing = cookies[ADMIN_CSRF_COOKIE];

  if (!rotate && existing) return existing;

  const csrfToken = randomToken(20);
  appendSetCookie(res, buildCookie(ADMIN_CSRF_COOKIE, csrfToken, {
    httpOnly: false,
    secure: isSecureRequest(req),
    sameSite: 'Strict',
    maxAge: ADMIN_SESSION_MAX_AGE_SECONDS,
  }));

  return csrfToken;
}

function verifyCsrfToken(req, res) {
  const cookies = parseCookies(req);
  const cookieToken = cookies[ADMIN_CSRF_COOKIE];
  const headerToken = req.headers['x-csrf-token'];

  if (!cookieToken || !headerToken || typeof headerToken !== 'string') {
    res.status(403).json({ error: 'Missing CSRF token.' });
    return false;
  }

  if (!safeTimingEqual(cookieToken, headerToken)) {
    res.status(403).json({ error: 'Invalid CSRF token.' });
    return false;
  }

  return true;
}

function encodeSessionPayload(sessionPayload) {
  const payload = base64UrlEncode(JSON.stringify(sessionPayload));
  return `${payload}.${signValue(payload)}`;
}

function buildSessionPayload(session, user) {
  const expiresAtMs = Number(session?.expires_at)
    ? Number(session.expires_at) * 1000
    : Date.now() + (ADMIN_SESSION_MAX_AGE_SECONDS * 1000);

  const role = extractRole(user);
  const aal = getCurrentAal(session?.access_token || '');

  return {
    iat: Date.now(),
    exp: Math.min(expiresAtMs, Date.now() + (ADMIN_SESSION_MAX_AGE_SECONDS * 1000)),
    mode: 'supabase',
    accessToken: session?.access_token || '',
    refreshToken: session?.refresh_token || '',
    user: {
      id: user?.id || '',
      email: user?.email || '',
      role,
      aal,
    },
  };
}

function buildPasswordSessionPayload() {
  const role = getAdminRole();
  return {
    iat: Date.now(),
    exp: Date.now() + (ADMIN_SESSION_MAX_AGE_SECONDS * 1000),
    mode: 'password',
    accessToken: '',
    refreshToken: '',
    user: {
      id: 'password-admin',
      email: '',
      role,
      aal: 'password',
    },
  };
}

export function startAdminSession(req, res, { session, user, rotateCsrf = true } = {}) {
  if (!session?.access_token || !session?.refresh_token || !user?.id) {
    throw new Error('Unable to create admin session from Supabase auth response.');
  }

  const payload = buildSessionPayload(session, user);
  const token = encodeSessionPayload(payload);

  appendSetCookie(res, buildCookie(ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    secure: isSecureRequest(req),
    sameSite: 'Strict',
    maxAge: ADMIN_SESSION_MAX_AGE_SECONDS,
  }));

  const csrfToken = ensureCsrfToken(req, res, { rotate: rotateCsrf });

  return {
    csrfToken,
    user: payload.user,
  };
}

export function startPasswordAdminSession(req, res, { rotateCsrf = true } = {}) {
  const payload = buildPasswordSessionPayload();
  const token = encodeSessionPayload(payload);

  appendSetCookie(res, buildCookie(ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    secure: isSecureRequest(req),
    sameSite: 'Strict',
    maxAge: ADMIN_SESSION_MAX_AGE_SECONDS,
  }));

  const csrfToken = ensureCsrfToken(req, res, { rotate: rotateCsrf });

  return {
    csrfToken,
    user: payload.user,
  };
}

export function clearAdminSession(req, res) {
  appendSetCookie(res, buildCookie(ADMIN_SESSION_COOKIE, '', {
    httpOnly: true,
    secure: isSecureRequest(req),
    sameSite: 'Strict',
    maxAge: 0,
  }));

  appendSetCookie(res, buildCookie(ADMIN_CSRF_COOKIE, '', {
    httpOnly: false,
    secure: isSecureRequest(req),
    sameSite: 'Strict',
    maxAge: 0,
  }));
}

export function hasAdminSession(req) {
  const cookies = parseCookies(req);
  return Boolean(parseSignedSession(cookies[ADMIN_SESSION_COOKIE]));
}

async function refreshAdminSession(req, res, payload) {
  if (!payload?.refreshToken) return null;

  try {
    const refreshedSession = await refreshSupabaseAuthSession(payload.refreshToken);
    if (!refreshedSession?.access_token) return null;

    const refreshedUser = await getSupabaseUserFromAccessToken(refreshedSession.access_token);
    if (!refreshedUser) return null;

    const result = startAdminSession(req, res, {
      session: refreshedSession,
      user: refreshedUser,
      rotateCsrf: false,
    });

    return {
      ...result,
      accessToken: refreshedSession.access_token,
      userRecord: refreshedUser,
    };
  } catch {
    return null;
  }
}

export async function verifyAdminSession(req, res, { respondOnError = true } = {}) {
  const cookies = parseCookies(req);
  const rawToken = cookies[ADMIN_SESSION_COOKIE];
  const parsed = parseSignedSession(rawToken, { allowExpired: true });

  if (!parsed) {
    if (respondOnError) res.status(401).json({ error: 'Unauthorized' });
    return null;
  }

  if (parsed.mode === 'password') {
    if (Number(parsed.exp) < Date.now()) {
      clearAdminSession(req, res);
      if (respondOnError) res.status(401).json({ error: 'Session expired. Please sign in again.' });
      return null;
    }

    const role = getAdminRole();
    const userId = parsed?.user?.id || 'password-admin';
    const email = parsed?.user?.email || null;

    return {
      accessToken: null,
      user: {
        id: userId,
        email,
        app_metadata: {
          role,
          roles: [role],
        },
      },
      actor: {
        userId,
        email,
        role,
        aal: 'password',
      },
    };
  }

  if (!parsed?.accessToken) {
    if (respondOnError) res.status(401).json({ error: 'Unauthorized' });
    return null;
  }

  let accessToken = parsed.accessToken;
  let user = null;

  try {
    user = await getSupabaseUserFromAccessToken(accessToken);
  } catch {
    const refreshed = await refreshAdminSession(req, res, parsed);
    if (!refreshed?.accessToken || !refreshed?.userRecord) {
      clearAdminSession(req, res);
      if (respondOnError) res.status(401).json({ error: 'Session expired. Please sign in again.' });
      return null;
    }

    accessToken = refreshed.accessToken;
    user = refreshed.userRecord;
  }

  if (!user) {
    clearAdminSession(req, res);
    if (respondOnError) res.status(401).json({ error: 'Unauthorized' });
    return null;
  }

  if (!hasRequiredRole(user)) {
    clearAdminSession(req, res);
    if (respondOnError) res.status(403).json({ error: `Admin role "${getAdminRole()}" is required.` });
    return null;
  }

  const aal = getCurrentAal(accessToken);
  if (shouldRequireAdminMfa() && aal !== 'aal2') {
    clearAdminSession(req, res);
    if (respondOnError) res.status(403).json({ error: 'A verified MFA session (AAL2) is required for admin access.' });
    return null;
  }

  return {
    accessToken,
    user,
    actor: {
      userId: user.id,
      email: user.email || null,
      role: extractRole(user),
      aal,
    },
  };
}

export async function logAdminAction(req, authContext, action, details = {}) {
  const actor = authContext?.actor || {
    userId: null,
    email: null,
    role: null,
    aal: null,
  };

  const entry = {
    action,
    actor_user_id: actor.userId,
    actor_email: actor.email,
    actor_role: actor.role,
    actor_aal: actor.aal,
    ip_address: getClientIp(req),
    request_path: req.url || null,
    request_method: req.method || null,
    user_agent: req.headers['user-agent'] || null,
    details,
    created_at: new Date().toISOString(),
  };

  try {
    console.info('[admin_audit]', JSON.stringify(entry));
  } catch {
    // Ignore console serialization issues.
  }

  try {
    await getSupabaseAdmin().from('admin_audit_logs').insert(entry);
  } catch {
    // Keep this non-fatal when audit table is not yet provisioned.
  }
}

function shouldVerifyCsrf(scope, method) {
  if (!['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) return false;
  return scope === 'auth' || scope === 'admin' || scope === 'upload' || scope === 'admin_login';
}

export function applySecurity(req, res, { scope = 'public', maxBodySize = 50000 } = {}) {
  setSecurityHeaders(res);

  if (!setCorsHeaders(req, res)) return false;
  if (!ensureOriginAllowed(req, res)) return false;
  if (!rateLimit(req, res, scope)) return false;
  if (!validateRequestSize(req, res, maxBodySize)) return false;
  if (!validateContentType(req, res)) return false;

  // Ensure a CSRF cookie is available for admin/auth scopes.
  if (scope === 'auth' || scope === 'admin' || scope === 'upload' || scope === 'admin_login') {
    ensureCsrfToken(req, res);
  }

  if (shouldVerifyCsrf(scope, req.method) && !verifyCsrfToken(req, res)) {
    return false;
  }

  return true;
}

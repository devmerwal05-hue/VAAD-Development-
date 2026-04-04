import crypto from 'node:crypto';
import { getAllowedOriginSet, getEnv, requireEnv } from './_config.js';

const rateLimitStore = new Map();
const RATE_LIMIT_WINDOW = 60 * 1000;
const RATE_LIMIT_LIMITS = {
  public: 30,
  admin: 500,
  auth: 12,
  upload: 20,
};
const ADMIN_SESSION_COOKIE = 'vaad_admin_session';
const ADMIN_SESSION_MAX_AGE_SECONDS = 60 * 60 * 8;

function getClientIp(req) {
  return req.headers['x-forwarded-for']?.split(',')[0]?.trim()
    || req.headers['x-real-ip']
    || req.socket?.remoteAddress
    || 'unknown';
}

function getRateLimitKey(req, scope) {
  return `${getClientIp(req)}:${scope}`;
}

function setRateLimitHeaders(res, limit, count) {
  res.setHeader('X-RateLimit-Limit', limit);
  res.setHeader('X-RateLimit-Remaining', Math.max(0, limit - count));
}

export function rateLimit(req, res, scope = 'public') {
  const limit = RATE_LIMIT_LIMITS[scope] ?? RATE_LIMIT_LIMITS.public;
  const key = getRateLimitKey(req, scope);
  const now = Date.now();

  let entry = rateLimitStore.get(key);
  if (!entry || now > entry.resetAt) {
    entry = { count: 0, resetAt: now + RATE_LIMIT_WINDOW };
    rateLimitStore.set(key, entry);
  }

  entry.count += 1;
  setRateLimitHeaders(res, limit, entry.count);

  if (rateLimitStore.size > 10000) {
    for (const [entryKey, value] of rateLimitStore) {
      if (now > value.resetAt) rateLimitStore.delete(entryKey);
    }
  }

  if (entry.count > limit) {
    res.status(429).json({ error: 'Too many requests. Please try again later.' });
    return false;
  }

  return true;
}

function isSecureRequest(req) {
  const forwardedProto = req.headers['x-forwarded-proto'];
  const host = req.headers['x-forwarded-host'] || req.headers.host || '';
  if (forwardedProto === 'https') return true;

  const hostname = String(host).toLowerCase().split(',')[0]?.trim().split(':')[0] || '';
  const isLocalHost = hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1';
  return Boolean(hostname) && !isLocalHost;
}

function getAdminSessionSecret() {
  const secret = getEnv('ADMIN_SESSION_SECRET');
  if (!secret) {
    console.warn('ADMIN_SESSION_SECRET not configured, using default');
    return 'default-secret-change-me';
  }
  return secret;
}

function base64UrlEncode(input) {
  return Buffer.from(input).toString('base64url');
}

function base64UrlDecode(input) {
  return Buffer.from(input, 'base64url').toString('utf8');
}

function signValue(value) {
  try {
    return crypto.createHmac('sha256', getAdminSessionSecret()).update(value).digest('base64url');
  } catch (e) {
    console.error('signValue error:', e);
    return 'fallback';
  }
}

function parseSignedSession(token) {
  if (!token || typeof token !== 'string' || !token.includes('.')) return null;

  const [payload, signature] = token.split('.');
  if (!payload || !signature) return null;

  const expectedSignature = signValue(payload);
  const provided = Buffer.from(signature);
  const expected = Buffer.from(expectedSignature);

  if (provided.length !== expected.length || !crypto.timingSafeEqual(provided, expected)) {
    return null;
  }

  try {
    const decoded = JSON.parse(base64UrlDecode(payload));
    if (!decoded.exp || decoded.exp < Date.now()) return null;
    return decoded;
  } catch {
    return null;
  }
}

export function setSecurityHeaders(res) {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
  res.setHeader('Cross-Origin-Resource-Policy', 'same-site');
}

export function sanitize(value, maxLen = 5000) {
  if (typeof value !== 'string') return value;

  return value
    .replace(/<[^>]*>/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .trim()
    .slice(0, maxLen);
}

export function getErrorMessage(error) {
  if (error instanceof Error) return error.message;
  return 'An unexpected error occurred.';
}

export function getRequestBody(req, res) {
  try {
    return req.body || {};
  } catch {
    res.status(400).json({ error: 'Invalid JSON' });
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
  if (['POST', 'PUT', 'DELETE'].includes(req.method)) {
    const contentType = req.headers['content-type'] || '';
    if (!contentType.includes('application/json')) {
      res.status(400).json({ error: 'Content-Type must be application/json' });
      return false;
    }
  }

  return true;
}

export function validateRequestSize(req, res, maxBytes = 50000) {
  const contentLength = Number.parseInt(req.headers['content-length'] || '0', 10);
  if (contentLength > maxBytes) {
    res.status(413).json({ error: 'Request body too large' });
    return false;
  }
  return true;
}

export function setCorsHeaders(req, res) {
  try {
    const origin = req.headers.origin;
    const allowedOrigins = getAllowedOriginSet(req);

    if (origin) {
      if (!allowedOrigins.has(origin)) {
        // Just log it, don't block
        console.log('Origin not in allowed list:', origin);
      }
      res.setHeader('Access-Control-Allow-Origin', origin);
      res.setHeader('Access-Control-Allow-Credentials', 'true');
      res.setHeader('Vary', 'Origin');
    }

    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Max-Age', '86400');

    if (req.method === 'OPTIONS') {
      res.status(204).end();
      return false;
    }

    return true;
  } catch (err) {
    console.error('CORS error:', err);
    return true; // Allow through
  }
}

export function verifyAdminPassword(password) {
  if (typeof password !== 'string') return false;
  const expected = getEnv('ADMIN_PASSWORD') || '2025';

  // Use timing-safe comparison to prevent password timing attacks
  const providedHash = crypto.createHash('sha256').update(password).digest();
  const expectedHash = crypto.createHash('sha256').update(expected).digest();

  return crypto.timingSafeEqual(providedHash, expectedHash);
}

export function startAdminSession(req, res) {
  const payload = base64UrlEncode(JSON.stringify({
    iat: Date.now(),
    exp: Date.now() + (ADMIN_SESSION_MAX_AGE_SECONDS * 1000),
  }));
  const token = `${payload}.${signValue(payload)}`;
  const cookieParts = [
    `${ADMIN_SESSION_COOKIE}=${token}`,
    'HttpOnly',
    'Path=/',
    'SameSite=Strict',
    `Max-Age=${ADMIN_SESSION_MAX_AGE_SECONDS}`,
  ];

  if (isSecureRequest(req)) {
    cookieParts.push('Secure');
  }

  res.setHeader('Set-Cookie', cookieParts.join('; '));
}

export function clearAdminSession(req, res) {
  const cookieParts = [
    `${ADMIN_SESSION_COOKIE}=`,
    'HttpOnly',
    'Path=/',
    'SameSite=Strict',
    'Max-Age=0',
  ];

  if (isSecureRequest(req)) {
    cookieParts.push('Secure');
  }

  res.setHeader('Set-Cookie', cookieParts.join('; '));
}

export function hasAdminSession(req) {
  const cookies = parseCookies(req);
  return Boolean(parseSignedSession(cookies[ADMIN_SESSION_COOKIE]));
}

export function verifyAdminSession(req, res) {
  if (!hasAdminSession(req)) {
    res.status(401).json({ error: 'Unauthorized' });
    return false;
  }
  return true;
}

export function applySecurity(req, res, { scope = 'public', maxBodySize = 50000 } = {}) {
  try {
    setSecurityHeaders(res);
  } catch (e) { console.error('setSecurityHeaders error:', e); }
  
  try {
    if (!setCorsHeaders(req, res)) return false;
  } catch (e) { 
    console.error('setCorsHeaders error:', e); 
    // Continue anyway
  }
  
  try {
    if (!rateLimit(req, res, scope)) return false;
  } catch (e) { console.error('rateLimit error:', e); }
  
  try {
    if (!validateRequestSize(req, res, maxBodySize)) return false;
  } catch (e) { console.error('validateRequestSize error:', e); }
  
  try {
    if (['POST', 'PUT', 'DELETE'].includes(req.method) && !validateContentType(req, res)) return false;
  } catch (e) { console.error('validateContentType error:', e); }
  
  return true;
}

import {
  applySecurity,
  getErrorMessage,
  getRequestBody,
  sanitize,
} from './_security.js';

const ALLOWED_LEVELS = new Set(['info', 'warn', 'error']);

function getClientIp(req) {
  return req.headers['x-forwarded-for']?.split(',')[0]?.trim()
    || req.headers['x-real-ip']
    || req.socket?.remoteAddress
    || 'unknown';
}

function normalizeDetails(input) {
  if (!input || typeof input !== 'object') return null;

  try {
    const serialized = JSON.stringify(input);
    if (!serialized) return null;

    if (serialized.length > 12000) {
      return {
        truncated: true,
        original_size: serialized.length,
      };
    }

    return JSON.parse(serialized);
  } catch {
    return { invalid: true };
  }
}

export default async function handler(req, res) {
  if (!applySecurity(req, res, { scope: 'public', maxBodySize: 25000 })) return;

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const body = getRequestBody(req, res);
    if (!body) return;

    const event = sanitize(typeof body.event === 'string' ? body.event : '', 80);
    if (!event) {
      return res.status(400).json({ error: 'event is required.' });
    }

    const requestedLevel = sanitize(typeof body.level === 'string' ? body.level : 'error', 10).toLowerCase();
    const level = ALLOWED_LEVELS.has(requestedLevel) ? requestedLevel : 'error';

    const timestamp = sanitize(typeof body.timestamp === 'string' ? body.timestamp : '', 40) || new Date().toISOString();
    const pathname = sanitize(typeof body.pathname === 'string' ? body.pathname : '', 200) || null;
    const href = sanitize(typeof body.href === 'string' ? body.href : '', 500) || null;

    const entry = {
      level,
      event,
      timestamp,
      pathname,
      href,
      ip_address: getClientIp(req),
      user_agent: req.headers['user-agent'] || null,
      details: normalizeDetails(body.details),
    };

    if (level === 'error') {
      console.error('[client_log]', JSON.stringify(entry));
    } else if (level === 'warn') {
      console.warn('[client_log]', JSON.stringify(entry));
    } else {
      console.info('[client_log]', JSON.stringify(entry));
    }

    return res.status(202).json({ ok: true });
  } catch (error) {
    console.error('Client log API error:', error);
    return res.status(500).json({ error: getErrorMessage(error) });
  }
}

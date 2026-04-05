type ClientLogLevel = 'info' | 'warn' | 'error';

const CLIENT_LOG_ENDPOINT = '/api/client-log';
const FORWARD_DEDUP_MS = 10000;
const forwardCache = new Map<string, number>();

declare global {
  interface Window {
    __VAAD_DEBUG_TIPS_PRINTED__?: boolean;
    __VAAD_CLIENT_LOG__?: Array<{
      timestamp: string;
      level: ClientLogLevel;
      event: string;
      details: Record<string, unknown>;
    }>;
  }
}

function getLogStore() {
  if (typeof window === 'undefined') return null;
  if (!Array.isArray(window.__VAAD_CLIENT_LOG__)) {
    window.__VAAD_CLIENT_LOG__ = [];
  }
  return window.__VAAD_CLIENT_LOG__;
}

function shouldForward(level: ClientLogLevel, event: string, details: Record<string, unknown>) {
  if (typeof window === 'undefined') return false;
  if (level === 'info') return false;

  const detailMessage = typeof details.message === 'string' ? details.message : '';
  const fingerprint = `${level}:${event}:${detailMessage.slice(0, 180)}`;
  const now = Date.now();
  const previous = forwardCache.get(fingerprint);
  if (previous && now - previous < FORWARD_DEDUP_MS) {
    return false;
  }

  forwardCache.set(fingerprint, now);

  if (forwardCache.size > 150) {
    for (const [key, ts] of forwardCache.entries()) {
      if (now - ts > FORWARD_DEDUP_MS * 12) {
        forwardCache.delete(key);
      }
    }
  }

  return true;
}

function forwardClientLog(level: ClientLogLevel, event: string, details: Record<string, unknown>, timestamp: string) {
  if (!shouldForward(level, event, details)) return;
  if (typeof window === 'undefined') return;

  const payload = {
    level,
    event,
    timestamp,
    pathname: window.location.pathname,
    href: window.location.href,
    details,
  };

  let serialized = '';
  try {
    serialized = JSON.stringify(payload);
  } catch {
    return;
  }

  try {
    if (navigator.sendBeacon) {
      const blob = new Blob([serialized], { type: 'application/json' });
      const sent = navigator.sendBeacon(CLIENT_LOG_ENDPOINT, blob);
      if (sent) return;
    }
  } catch {
    // Fallback to fetch below.
  }

  void fetch(CLIENT_LOG_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'same-origin',
    keepalive: true,
    body: serialized,
  }).catch(() => {
    // Intentionally ignore telemetry transport failures.
  });
}

export function logClientEvent(level: ClientLogLevel, event: string, details: Record<string, unknown> = {}) {
  const timestamp = new Date().toISOString();
  const payload = { timestamp, level, event, details };

  const store = getLogStore();
  if (store) {
    store.push(payload);
    if (store.length > 200) {
      store.splice(0, store.length - 200);
    }
  }

  const prefix = `[VAAD:${event}]`;
  if (level === 'error') {
    console.error(prefix, payload);
    forwardClientLog(level, event, details, timestamp);
    return;
  }
  if (level === 'warn') {
    console.warn(prefix, payload);
    forwardClientLog(level, event, details, timestamp);
    return;
  }
  console.info(prefix, payload);
}

export function logFrontendFetchError(scope: string, error: unknown, details: Record<string, unknown> = {}) {
  const message = error instanceof Error ? error.message : String(error ?? 'Unknown error');
  logClientEvent('error', 'frontend.fetch.error', {
    scope,
    message,
    ...details,
  });
}

export function printDebugTipsOnce() {
  if (typeof window === 'undefined') return;
  if (window.__VAAD_DEBUG_TIPS_PRINTED__) return;

  window.__VAAD_DEBUG_TIPS_PRINTED__ = true;
  console.info('[VAAD:debug.tips] Helpful checks for content/admin issues:');
  console.info('1) Verify /api/content and /api/admin/session return JSON (not HTML).');
  console.info('2) Confirm SITE_URL and ALLOWED_ORIGINS include your current domain.');
  console.info('3) Ensure ADMIN_PASSWORD and ADMIN_SESSION_SECRET are configured on Vercel.');
  console.info('4) In Supabase SQL editor, verify public.admin_audit_logs exists before expecting persisted audit entries.');
}

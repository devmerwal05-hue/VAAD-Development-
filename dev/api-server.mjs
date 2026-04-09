import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

function loadDotEnv() {
  const envPath = path.join(process.cwd(), '.env');
  if (!fs.existsSync(envPath)) return;

  const raw = fs.readFileSync(envPath, 'utf8');
  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    const eq = trimmed.indexOf('=');
    if (eq <= 0) continue;

    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();

    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }

    if (!(key in process.env)) {
      process.env[key] = value;
    }
  }
}

loadDotEnv();

const MAX_BODY_BYTES = 12 * 1024 * 1024; // 12MB (upload endpoint allows up to 10MB)

function collectRequestBody(req) {
  return new Promise((resolve, reject) => {
    let total = 0;
    const chunks = [];

    req.on('data', (chunk) => {
      total += chunk.length;
      if (total > MAX_BODY_BYTES) {
        reject(new Error('Request body too large'));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });

    req.on('end', () => {
      resolve(Buffer.concat(chunks).toString('utf8'));
    });

    req.on('error', reject);
  });
}

function parseQuery(searchParams) {
  const query = {};
  for (const [key, value] of searchParams.entries()) {
    if (Object.prototype.hasOwnProperty.call(query, key)) {
      const existing = query[key];
      if (Array.isArray(existing)) existing.push(value);
      else query[key] = [existing, value];
    } else {
      query[key] = value;
    }
  }
  return query;
}

function enhanceRes(res) {
  res.status = (code) => {
    res.statusCode = code;
    return res;
  };

  res.json = (data) => {
    if (!res.getHeader('Content-Type')) {
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
    }
    res.end(JSON.stringify(data));
    return res;
  };

  return res;
}

function resolveHandler(pathname) {
  const table = new Map([
    ['/api/content', new URL('../api/content.js', import.meta.url)],
    ['/api/content/bulk', new URL('../api/content/bulk.js', import.meta.url)],
    ['/api/contact', new URL('../api/contact.js', import.meta.url)],
    ['/api/upload', new URL('../api/upload.js', import.meta.url)],
    ['/api/client-log', new URL('../api/client-log.js', import.meta.url)],
    ['/api/admin/session', new URL('../api/admin/session.js', import.meta.url)],
    ['/api/admin/audit', new URL('../api/admin/audit.js', import.meta.url)],
  ]);

  return table.get(pathname) || null;
}

const server = http.createServer(async (req, res) => {
  const enhancedRes = enhanceRes(res);

  try {
    const base = `http://${req.headers.host || 'localhost'}`;
    const url = new URL(req.url || '/', base);

    const handlerUrl = resolveHandler(url.pathname);
    if (!handlerUrl) {
      enhancedRes.status(404).json({ error: 'Not found' });
      return;
    }

    req.query = parseQuery(url.searchParams);

    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method || '')) {
      const rawBody = await collectRequestBody(req);
      const contentType = String(req.headers['content-type'] || '').toLowerCase();
      if (contentType.includes('application/json')) {
        try {
          req.body = rawBody ? JSON.parse(rawBody) : {};
        } catch {
          req.body = rawBody;
        }
      } else {
        req.body = rawBody;
      }
    }

    const mod = await import(handlerUrl.href);
    const handler = mod.default;
    if (typeof handler !== 'function') {
      enhancedRes.status(500).json({ error: 'Invalid handler module' });
      return;
    }

    await handler(req, enhancedRes);
  } catch (err) {
    console.error('[dev-api] Unhandled error:', err);
    if (!res.headersSent) {
      enhanceRes(res).status(500).json({ error: err instanceof Error ? err.message : 'Internal error' });
    } else {
      res.end();
    }
  }
});

const port = Number.parseInt(process.env.API_PORT || process.env.PORT || '3000', 10) || 3000;
server.listen(port, () => {
  console.log(`[dev-api] Running on http://localhost:${port}`);
  console.log('[dev-api] Routes: /api/content, /api/contact, /api/admin/session, /api/admin/audit, /api/upload, /api/client-log');
});

process.on('SIGINT', () => {
  server.close(() => process.exit(0));
});

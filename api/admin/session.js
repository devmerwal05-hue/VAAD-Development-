import crypto from 'node:crypto';
import { getAdminPassword } from '../_config.js';
import {
  applySecurity,
  clearAdminSession,
  ensureCsrfToken,
  getRequestBody,
  logAdminAction,
  startPasswordAdminSession,
  verifyAdminSession,
} from '../_security.js';

function safePasswordCompare(input, expected) {
  const inputHash = crypto.createHash('sha256').update(String(input)).digest();
  const expectedHash = crypto.createHash('sha256').update(String(expected)).digest();
  return crypto.timingSafeEqual(inputHash, expectedHash);
}

export default async function handler(req, res) {
  if (!applySecurity(req, res, { scope: 'auth' })) return;

  if (req.method === 'GET') {
    const auth = await verifyAdminSession(req, res, { respondOnError: false });
    const csrfToken = ensureCsrfToken(req, res);

    if (!auth) {
      return res.status(200).json({ authenticated: false, csrfToken });
    }

    return res.status(200).json({
      authenticated: true,
      csrfToken,
      user: {
        email: auth.actor.email,
        role: auth.actor.role,
        aal: auth.actor.aal,
      },
    });
  }

  if (req.method === 'POST') {
    const body = getRequestBody(req, res);
    if (!body) return;

    const configuredPassword = getAdminPassword();
    if (!configuredPassword) {
      return res.status(503).json({
        error: 'Admin password is not configured. Set ADMIN_PASSWORD (or ADMIN_PASS / ADMIN_PANEL_PASSWORD / VITE_ADMIN_PASSWORD).',
      });
    }

    const password = typeof body.password === 'string' ? body.password.trim() : '';

    if (!password) {
      return res.status(400).json({ error: 'Password is required.' });
    }

    if (!safePasswordCompare(password, configuredPassword)) {
      return res.status(401).json({ error: 'Invalid password.' });
    }

    const sessionResult = startPasswordAdminSession(req, res, { rotateCsrf: true });
    const actor = {
      actor: {
        userId: sessionResult.user.id,
        email: null,
        role: sessionResult.user.role,
        aal: sessionResult.user.aal,
      },
    };

    await logAdminAction(req, actor, 'admin.login.success', {
      auth_mode: 'password',
      aal: sessionResult.user.aal,
    });

    return res.status(200).json({
      authenticated: true,
      csrfToken: sessionResult.csrfToken,
      user: {
        email: null,
        role: sessionResult.user.role,
        aal: sessionResult.user.aal,
      },
    });
  }

  if (req.method === 'DELETE') {
    const auth = await verifyAdminSession(req, res, { respondOnError: false });
    if (auth) {
      await logAdminAction(req, auth, 'admin.logout', {});
    }

    clearAdminSession(req, res);
    const csrfToken = ensureCsrfToken(req, res, { rotate: true });
    return res.status(200).json({ authenticated: false, csrfToken });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

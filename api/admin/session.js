import { getAdminRole, getEnv, shouldRequireAdminMfa } from '../_config.js';
import { signInWithSupabasePassword } from '../_supabase.js';
import {
  applySecurity,
  clearAdminSession,
  ensureCsrfToken,
  getErrorMessage,
  getRequestBody,
  logAdminAction,
  startAdminSession,
  verifyAdminSession,
} from '../_security.js';

function hasSupabaseAuthConfig() {
  return Boolean(getEnv('SUPABASE_URL') && getEnv('SUPABASE_ANON_KEY'));
}

function decodeJwtPayload(token) {
  if (!token || typeof token !== 'string' || !token.includes('.')) return null;
  const parts = token.split('.');
  if (parts.length < 2) return null;
  try {
    return JSON.parse(Buffer.from(parts[1], 'base64url').toString('utf8'));
  } catch {
    return null;
  }
}

function getSessionAal(session) {
  const claims = decodeJwtPayload(session?.access_token || '');
  const aal = claims?.aal;
  if (typeof aal === 'string' && aal) return aal;
  return 'aal1';
}

function extractRole(user) {
  const role = user?.app_metadata?.role;
  if (typeof role === 'string' && role) return role;
  const roles = user?.app_metadata?.roles;
  if (Array.isArray(roles)) {
    const first = roles.find((value) => typeof value === 'string' && value.length > 0);
    if (first) return first;
  }
  const userRole = user?.user_metadata?.role;
  if (typeof userRole === 'string' && userRole) return userRole;
  return 'viewer';
}

function hasRequiredAdminRole(user) {
  const requiredRole = getAdminRole();
  const role = extractRole(user);
  if (role === requiredRole) return true;

  const roles = user?.app_metadata?.roles;
  if (Array.isArray(roles) && roles.includes(requiredRole)) return true;

  return false;
}

function mapLoginError(error) {
  const message = getErrorMessage(error);
  if (/invalid login credentials/i.test(message)) {
    return { code: 401, error: 'Invalid email or password.' };
  }
  return { code: 500, error: 'Unable to sign in right now. Please try again.' };
}

export default async function handler(req, res) {
  if (!applySecurity(req, res, { scope: 'auth' })) return;

  if (!hasSupabaseAuthConfig()) {
    return res.status(503).json({
      error: 'Supabase auth is not configured. Set SUPABASE_URL and SUPABASE_ANON_KEY.',
    });
  }

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

    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
    const password = typeof body.password === 'string' ? body.password : '';
    const mfaCode = typeof body.mfa_code === 'string' ? body.mfa_code.trim() : '';

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    try {
      const { client, session, user } = await signInWithSupabasePassword(email, password);
      if (!session || !user) {
        return res.status(401).json({ error: 'Invalid email or password.' });
      }

      if (!hasRequiredAdminRole(user)) {
        return res.status(403).json({ error: `Admin role "${getAdminRole()}" is required.` });
      }

      let finalSession = session;
      let aal = getSessionAal(finalSession);

      if (shouldRequireAdminMfa() && aal !== 'aal2') {
        if (!mfaCode) {
          return res.status(412).json({
            error: 'MFA code required. Enter your authenticator app code.',
            mfa_required: true,
          });
        }

        const factorsResult = await client.auth.mfa.listFactors();
        if (factorsResult.error) throw factorsResult.error;

        const factor = factorsResult.data?.totp?.find((item) => item.status === 'verified');
        if (!factor) {
          return res.status(403).json({ error: 'No verified TOTP factor found for this admin account.' });
        }

        const challengeResult = await client.auth.mfa.challenge({ factorId: factor.id });
        if (challengeResult.error) throw challengeResult.error;

        const verifyResult = await client.auth.mfa.verify({
          factorId: factor.id,
          challengeId: challengeResult.data.id,
          code: mfaCode,
        });
        if (verifyResult.error) {
          return res.status(401).json({ error: 'Invalid MFA code.' });
        }

        if (!verifyResult.data?.session) {
          return res.status(500).json({ error: 'Unable to complete MFA verification.' });
        }

        finalSession = verifyResult.data.session;
        aal = getSessionAal(finalSession);

        if (aal !== 'aal2') {
          return res.status(403).json({ error: 'MFA verification did not reach AAL2.' });
        }
      }

      const sessionResult = startAdminSession(req, res, { session: finalSession, user, rotateCsrf: true });
      const actor = {
        actor: {
          userId: user.id,
          email: user.email || null,
          role: extractRole(user),
          aal,
        },
      };

      await logAdminAction(req, actor, 'admin.login.success', {
        mfa_required: shouldRequireAdminMfa(),
        aal,
      });

      return res.status(200).json({
        authenticated: true,
        csrfToken: sessionResult.csrfToken,
        user: {
          email: user.email || null,
          role: extractRole(user),
          aal,
        },
      });
    } catch (error) {
      const mapped = mapLoginError(error);
      return res.status(mapped.code).json({ error: mapped.error });
    }
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

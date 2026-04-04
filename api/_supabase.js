import { createClient } from '@supabase/supabase-js';
import { requireEnv } from './_config.js';

let adminClient;
let publicClient;

function createSupabaseClient(key) {
  return createClient(requireEnv('SUPABASE_URL'), requireEnv(key), {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

function createSupabaseAnonClientWithToken(accessToken) {
  return createClient(requireEnv('SUPABASE_URL'), requireEnv('SUPABASE_ANON_KEY'), {
    global: {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

function createSupabaseTransientAnonClient() {
  return createClient(requireEnv('SUPABASE_URL'), requireEnv('SUPABASE_ANON_KEY'), {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

export function getSupabaseAdmin() {
  if (!adminClient) {
    adminClient = createSupabaseClient('SUPABASE_SERVICE_ROLE_KEY');
  }
  return adminClient;
}

export function getSupabasePublic() {
  if (!publicClient) {
    publicClient = createSupabaseClient('SUPABASE_ANON_KEY');
  }
  return publicClient;
}

export function createSupabaseSessionClient(accessToken) {
  if (!accessToken || typeof accessToken !== 'string') {
    throw new Error('A valid Supabase access token is required.');
  }
  return createSupabaseAnonClientWithToken(accessToken);
}

export async function getSupabaseUserFromAccessToken(accessToken) {
  const client = createSupabaseSessionClient(accessToken);
  const { data, error } = await client.auth.getUser(accessToken);
  if (error) throw error;
  return data.user || null;
}

export async function refreshSupabaseAuthSession(refreshToken) {
  if (!refreshToken || typeof refreshToken !== 'string') {
    throw new Error('A valid Supabase refresh token is required.');
  }

  const client = createSupabaseTransientAnonClient();
  const { data, error } = await client.auth.refreshSession({ refresh_token: refreshToken });
  if (error) throw error;
  return data.session || null;
}

export async function signInWithSupabasePassword(email, password) {
  const client = createSupabaseTransientAnonClient();
  const { data, error } = await client.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return { client, session: data.session || null, user: data.user || null };
}

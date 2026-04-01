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

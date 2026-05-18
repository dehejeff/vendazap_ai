const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ?? "";
const supabasePublishableKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim() ?? "";
const supabaseServiceRoleKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() ?? "";

export function getSupabasePublicConfig() {
  return {
    publishableKey: supabasePublishableKey,
    url: supabaseUrl,
  };
}

export function getSupabaseServiceRoleKey() {
  return supabaseServiceRoleKey;
}

export function isSupabasePublicConfigured() {
  return Boolean(supabaseUrl && supabasePublishableKey);
}

export function isSupabaseServerConfigured() {
  return Boolean(supabaseUrl && supabaseServiceRoleKey);
}

export function getPersistenceMode() {
  return isSupabaseServerConfigured() ? "supabase" : "local";
}

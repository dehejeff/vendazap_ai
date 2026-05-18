import { createClient } from "@supabase/supabase-js";
import {
  getSupabasePublicConfig,
  isSupabasePublicConfigured,
} from "@/lib/supabase/config";

export function getSupabaseBrowserClient() {
  const { publishableKey, url } = getSupabasePublicConfig();

  if (!isSupabasePublicConfigured()) {
    throw new Error(
      "Supabase público não configurado. Defina NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.",
    );
  }

  return createClient(url, publishableKey);
}

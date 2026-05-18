import { createClient } from "@supabase/supabase-js";
import WebSocket from "ws";
import {
  getSupabaseServiceRoleKey,
  getSupabasePublicConfig,
  isSupabaseServerConfigured,
} from "@/lib/supabase/config";

export function getSupabaseServerClient() {
  const { url } = getSupabasePublicConfig();
  const serviceRoleKey = getSupabaseServiceRoleKey();

  if (!isSupabaseServerConfigured()) {
    throw new Error(
      "Supabase server não configurado. Defina NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY.",
    );
  }

  return createClient(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
    realtime: {
      transport: WebSocket as unknown as never,
    },
  });
}

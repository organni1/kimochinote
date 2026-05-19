"use client";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { getSupabaseBrowserConfig } from "@/lib/supabase/config";

let browserClient: SupabaseClient | null = null;

export function isSupabaseBrowserConfigured() {
  return Boolean(getSupabaseBrowserConfig());
}

export function getSupabaseBrowserClient() {
  const config = getSupabaseBrowserConfig();
  if (!config) return null;

  browserClient ??= createClient(config.url, config.anonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });

  return browserClient;
}

export async function getSupabaseAccessToken() {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) return null;

  const { data } = await supabase.auth.getSession();
  return data.session?.access_token ?? null;
}

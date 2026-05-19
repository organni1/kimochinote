import { createClient } from "@supabase/supabase-js";
import { getSupabaseServerConfig } from "@/lib/supabase/config";

export function isSupabaseServerConfigured() {
  return Boolean(getSupabaseServerConfig());
}

export function createSupabaseAdminClient() {
  const config = getSupabaseServerConfig();
  if (!config) return null;

  return createClient(config.url, config.serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

export function createSupabaseUserClient(accessToken: string) {
  const config = getSupabaseServerConfig();
  if (!config) return null;

  return createClient(config.url, config.anonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
    global: {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  });
}

export function getBearerToken(request: Request) {
  const authorization = request.headers.get("authorization");
  if (!authorization?.startsWith("Bearer ")) return null;
  return authorization.slice("Bearer ".length);
}

export async function getAuthenticatedUser(request: Request) {
  const accessToken = getBearerToken(request);
  if (!accessToken) return { user: null, error: "メール認証が必要です。" };

  const supabase = createSupabaseUserClient(accessToken);
  if (!supabase) return { user: null, error: "Supabaseの設定が完了していません。" };

  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) return { user: null, error: "ログイン状態を確認できませんでした。" };

  return { user: data.user, error: null };
}

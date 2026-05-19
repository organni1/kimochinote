import type { User } from "@supabase/supabase-js";
import type { DiagnosisResult } from "@/types/diagnosis";
import type { ActionLog, ActionLogsByDay } from "@/types/plan";
import { createSupabaseAdminClient } from "@/lib/supabase/server";

type SyncPayload = {
  diagnosisResult?: DiagnosisResult | null;
  actionLogs?: ActionLogsByDay;
};

export async function ensureProfile(user: User) {
  const supabase = createSupabaseAdminClient();
  if (!supabase) throw new Error("Supabaseの設定が完了していません。");

  const { error } = await supabase.from("profiles").upsert({
    id: user.id,
    email: user.email,
    updated_at: new Date().toISOString(),
  });
  if (error) throw error;
}

export async function syncUserData(user: User, payload: SyncPayload) {
  const supabase = createSupabaseAdminClient();
  if (!supabase) throw new Error("Supabaseの設定が完了していません。");

  await ensureProfile(user);

  if (payload.diagnosisResult) {
    const { error } = await supabase.from("diagnosis_results").upsert({
      user_id: user.id,
      result: payload.diagnosisResult,
      updated_at: new Date().toISOString(),
    });
    if (error) throw error;
  }

  const logs = payload.actionLogs ?? {};
  const rows = Object.values(logs).map((log) => ({
    user_id: user.id,
    day: log.day,
    log,
    updated_at: log.updatedAt,
  }));

  if (rows.length > 0) {
    const { error } = await supabase.from("action_logs").upsert(rows, {
      onConflict: "user_id,day",
    });
    if (error) throw error;
  }
}

export async function readUserState(user: User) {
  const supabase = createSupabaseAdminClient();
  if (!supabase) throw new Error("Supabaseの設定が完了していません。");

  await ensureProfile(user);

  const [{ data: diagnosis }, { data: logs }, { data: purchase }] = await Promise.all([
    supabase.from("diagnosis_results").select("result").eq("user_id", user.id).maybeSingle(),
    supabase.from("action_logs").select("log").eq("user_id", user.id),
    supabase
      .from("purchases")
      .select("id,status")
      .eq("user_id", user.id)
      .eq("product", "kimochi_note_7day_plan")
      .eq("status", "paid")
      .maybeSingle(),
  ]);

  const actionLogs = (logs ?? []).reduce<ActionLogsByDay>((acc, row) => {
    const log = row.log as ActionLog;
    acc[String(log.day)] = log;
    return acc;
  }, {});

  return {
    purchased: Boolean(purchase),
    diagnosisResult: (diagnosis?.result as DiagnosisResult | undefined) ?? null,
    actionLogs,
  };
}

export async function savePurchaseFromCheckoutSession({
  userId,
  email,
  sessionId,
  customerId,
  amountTotal,
  currency,
  status,
}: {
  userId: string;
  email?: string | null;
  sessionId: string;
  customerId?: string | null;
  amountTotal?: number | null;
  currency?: string | null;
  status: "paid" | "unpaid";
}) {
  const supabase = createSupabaseAdminClient();
  if (!supabase) throw new Error("Supabaseの設定が完了していません。");

  const { error } = await supabase.from("purchases").upsert(
    {
      user_id: userId,
      email,
      stripe_checkout_session_id: sessionId,
      stripe_customer_id: customerId,
      product: "kimochi_note_7day_plan",
      amount_total: amountTotal,
      currency,
      status,
      purchased_at: status === "paid" ? new Date().toISOString() : null,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "stripe_checkout_session_id" }
  );
  if (error) throw error;
}

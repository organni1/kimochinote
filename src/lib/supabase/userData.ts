import type { User } from "@supabase/supabase-js";
import type Stripe from "stripe";
import type { DiagnosisResult } from "@/types/diagnosis";
import type { ActionLog, ActionLogsByDay } from "@/types/plan";
import { createSupabaseAdminClient } from "@/lib/supabase/server";

export type PlusSource = "direct_plus" | "transition_from_7day";

export type PlusSubscriptionState = {
  hasPlus: boolean;
  subscription: {
    status: string;
    source: PlusSource;
    plusStartDay: number;
    currentPeriodEnd: string | null;
    cancelAtPeriodEnd: boolean;
    createdAt: string | null;
  } | null;
};

export type PlusActionLog = {
  day: number;
  title: string;
  action: string;
  insight: string;
  completed: boolean;
  updatedAt: string;
};

export type PlusDashboardData = {
  latestCheckin: {
    anxietyLevel: number | null;
    topics: string[];
    memo: string;
    createdAt: string;
  } | null;
  latestCalmWork: {
    factText: string;
    imaginationText: string;
    messageText: string;
    decision: string;
    createdAt: string;
  } | null;
  latestLineRewrite: {
    originalText: string;
    rewriteSoft: string;
    rewriteHonest: string;
    rewriteHold: string;
    createdAt: string;
  } | null;
  latestWeeklyReflection: {
    weekNumber: number;
    didText: string;
    changedText: string;
    nextText: string;
    createdAt: string;
  } | null;
};

type SyncPayload = {
  diagnosisResult?: DiagnosisResult | null;
  actionLogs?: ActionLogsByDay;
};

export async function ensureProfile(user: User) {
  const supabase = createSupabaseAdminClient();
  if (!supabase) throw new Error("保存設定が完了していません。");

  const metadata = user.user_metadata ?? {};

  const { error } = await supabase.from("profiles").upsert({
    id: user.id,
    email: user.email,
    display_name: typeof metadata.full_name === "string" ? metadata.full_name : typeof metadata.name === "string" ? metadata.name : null,
    avatar_url: typeof metadata.avatar_url === "string" ? metadata.avatar_url : null,
    auth_provider: user.app_metadata?.provider ?? "email",
    updated_at: new Date().toISOString(),
  });
  if (error) throw error;
}

export async function syncUserData(user: User, payload: SyncPayload) {
  const supabase = createSupabaseAdminClient();
  if (!supabase) throw new Error("保存設定が完了していません。");

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
  if (!supabase) throw new Error("保存設定が完了していません。");

  await ensureProfile(user);
  const email = user.email?.toLowerCase() ?? "";

  const [{ data: diagnosis }, { data: logs }, { data: userPurchase }, { data: emailPurchase }] = await Promise.all([
    supabase.from("diagnosis_results").select("result").eq("user_id", user.id).maybeSingle(),
    supabase.from("action_logs").select("log").eq("user_id", user.id),
    supabase
      .from("purchases")
      .select("id,status,stripe_checkout_session_id")
      .eq("user_id", user.id)
      .eq("product", "kimochi_note_7day_plan")
      .eq("status", "paid")
      .maybeSingle(),
    email
      ? supabase
          .from("purchases")
          .select("id,status,stripe_checkout_session_id")
          .ilike("email", email)
          .eq("product", "kimochi_note_7day_plan")
          .eq("status", "paid")
          .maybeSingle()
      : Promise.resolve({ data: null }),
  ]);

  const purchase = userPurchase ?? emailPurchase;
  if (!userPurchase && purchase?.stripe_checkout_session_id) {
    await supabase
      .from("purchases")
      .update({ user_id: user.id, updated_at: new Date().toISOString() })
      .eq("stripe_checkout_session_id", purchase.stripe_checkout_session_id);
  }

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

export async function readSevenDayContext(user: User) {
  const supabase = createSupabaseAdminClient();
  if (!supabase) throw new Error("保存設定が完了していません。");

  await ensureProfile(user);
  const email = user.email?.toLowerCase() ?? "";

  const [{ data: userPurchase }, { data: emailPurchase }, { data: logs }] = await Promise.all([
    supabase
      .from("purchases")
      .select("id,status")
      .eq("user_id", user.id)
      .eq("product", "kimochi_note_7day_plan")
      .eq("status", "paid")
      .maybeSingle(),
    email
      ? supabase
          .from("purchases")
          .select("id,status")
          .ilike("email", email)
          .eq("product", "kimochi_note_7day_plan")
          .eq("status", "paid")
          .maybeSingle()
      : Promise.resolve({ data: null }),
    supabase.from("action_logs").select("day").eq("user_id", user.id),
  ]);

  const purchase = userPurchase ?? emailPurchase;
  const completedDays = (logs ?? [])
    .map((row) => Number(row.day))
    .filter((day) => Number.isFinite(day) && day >= 1 && day <= 7);
  const latestCompletedDay = completedDays.length > 0 ? Math.max(...completedDays) : 0;
  const source: PlusSource = purchase ? "transition_from_7day" : "direct_plus";
  const plusStartDay = purchase && latestCompletedDay > 0 ? Math.min(8, latestCompletedDay + 1) : 1;

  return {
    hasSevenDayPurchase: Boolean(purchase),
    purchaseId: purchase?.id ?? null,
    sevenDayLogCount: completedDays.length,
    latestCompletedDay,
    source,
    plusStartDay,
  };
}

export async function readPlusState(user: User): Promise<PlusSubscriptionState> {
  const supabase = createSupabaseAdminClient();
  if (!supabase) throw new Error("保存設定が完了していません。");

  await ensureProfile(user);
  const email = user.email?.toLowerCase() ?? "";

  const [{ data: byUser }, { data: byEmail }] = await Promise.all([
    supabase
      .from("subscriptions")
      .select("*")
      .eq("user_id", user.id)
      .eq("plan_type", "plus_monthly")
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
    email
      ? supabase
          .from("subscriptions")
          .select("*")
          .ilike("user_email", email)
          .eq("plan_type", "plus_monthly")
          .order("updated_at", { ascending: false })
          .limit(1)
          .maybeSingle()
      : Promise.resolve({ data: null }),
  ]);

  const row = byUser ?? byEmail;
  if (!row) return { hasPlus: false, subscription: null };

  if (!byUser && row.stripe_subscription_id) {
    await supabase
      .from("subscriptions")
      .update({ user_id: user.id, updated_at: new Date().toISOString() })
      .eq("stripe_subscription_id", row.stripe_subscription_id);
  }

  const currentPeriodEnd = row.current_period_end as string | null;
  const isPeriodActive = currentPeriodEnd ? new Date(currentPeriodEnd).getTime() > Date.now() : false;
  const status = String(row.status);
  const hasPlus = status === "active" || status === "trialing" || (Boolean(row.cancel_at_period_end) && isPeriodActive);

  return {
    hasPlus,
    subscription: {
      status,
      source: row.source === "transition_from_7day" ? "transition_from_7day" : "direct_plus",
      plusStartDay: Number(row.plus_start_day) || 1,
      currentPeriodEnd,
      cancelAtPeriodEnd: Boolean(row.cancel_at_period_end),
      createdAt: (row.created_at as string | null) ?? null,
    },
  };
}

export async function readPlusActionLogs(user: User) {
  const supabase = createSupabaseAdminClient();
  if (!supabase) throw new Error("保存設定が完了していません。");

  const { data, error } = await supabase
    .from("plus_action_logs")
    .select("day_number,note,completed,updated_at")
    .eq("user_id", user.id)
    .order("day_number", { ascending: true });

  if (error) throw error;

  return (data ?? []).reduce<Record<string, PlusActionLog>>((acc, row) => {
    const day = Number(row.day_number);
    acc[String(day)] = {
      day,
      title: "",
      action: "",
      insight: String(row.note ?? ""),
      completed: Boolean(row.completed),
      updatedAt: String(row.updated_at ?? ""),
    };
    return acc;
  }, {});
}

export async function savePlusActionLog({
  user,
  day,
  insight,
}: {
  user: User;
  day: number;
  insight: string;
}) {
  const supabase = createSupabaseAdminClient();
  if (!supabase) throw new Error("保存設定が完了していません。");

  const plusState = await readPlusState(user);
  if (!plusState.hasPlus) throw new Error("Plusへの加入が必要です。");
  if (!user.email) throw new Error("メールアドレスを確認できませんでした。");

  const now = new Date().toISOString();
  const { data: existing, error: readError } = await supabase
    .from("plus_action_logs")
    .select("id")
    .eq("user_id", user.id)
    .eq("day_number", day)
    .maybeSingle();

  if (readError) throw readError;

  if (existing?.id) {
    const { error } = await supabase
      .from("plus_action_logs")
      .update({
        note: insight,
        completed: true,
        completed_at: now,
        updated_at: now,
      })
      .eq("id", existing.id);
    if (error) throw error;
    return;
  }

  const { error } = await supabase.from("plus_action_logs").insert({
    user_id: user.id,
    user_email: user.email,
    day_number: day,
    note: insight,
    completed: true,
    completed_at: now,
    updated_at: now,
  });
  if (error) throw error;
}

export async function readPlusDashboardData(user: User): Promise<PlusDashboardData> {
  const supabase = createSupabaseAdminClient();
  if (!supabase) throw new Error("保存設定が完了していません。");

  const [checkinResult, calmWorkResult, lineRewriteResult, weeklyResult] = await Promise.all([
    supabase
      .from("plus_checkins")
      .select("anxiety_level,topics,memo,created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase
      .from("plus_calm_works")
      .select("fact_text,imagination_text,message_text,decision,created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase
      .from("plus_line_rewrites")
      .select("original_text,rewrite_soft,rewrite_honest,rewrite_hold,created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase
      .from("plus_weekly_reflections")
      .select("week_number,did_text,changed_text,next_text,created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
  ]);

  if (checkinResult.error) throw checkinResult.error;
  if (calmWorkResult.error) throw calmWorkResult.error;
  if (lineRewriteResult.error) throw lineRewriteResult.error;
  if (weeklyResult.error) throw weeklyResult.error;

  return {
    latestCheckin: checkinResult.data
      ? {
          anxietyLevel: checkinResult.data.anxiety_level as number | null,
          topics: (checkinResult.data.topics as string[] | null) ?? [],
          memo: String(checkinResult.data.memo ?? ""),
          createdAt: String(checkinResult.data.created_at ?? ""),
        }
      : null,
    latestCalmWork: calmWorkResult.data
      ? {
          factText: String(calmWorkResult.data.fact_text ?? ""),
          imaginationText: String(calmWorkResult.data.imagination_text ?? ""),
          messageText: String(calmWorkResult.data.message_text ?? ""),
          decision: String(calmWorkResult.data.decision ?? ""),
          createdAt: String(calmWorkResult.data.created_at ?? ""),
        }
      : null,
    latestLineRewrite: lineRewriteResult.data
      ? {
          originalText: String(lineRewriteResult.data.original_text ?? ""),
          rewriteSoft: String(lineRewriteResult.data.rewrite_soft ?? ""),
          rewriteHonest: String(lineRewriteResult.data.rewrite_honest ?? ""),
          rewriteHold: String(lineRewriteResult.data.rewrite_hold ?? ""),
          createdAt: String(lineRewriteResult.data.created_at ?? ""),
        }
      : null,
    latestWeeklyReflection: weeklyResult.data
      ? {
          weekNumber: Number(weeklyResult.data.week_number) || 1,
          didText: String(weeklyResult.data.did_text ?? ""),
          changedText: String(weeklyResult.data.changed_text ?? ""),
          nextText: String(weeklyResult.data.next_text ?? ""),
          createdAt: String(weeklyResult.data.created_at ?? ""),
        }
      : null,
  };
}

async function ensurePlusAccess(user: User) {
  const plusState = await readPlusState(user);
  if (!plusState.hasPlus) throw new Error("Plusへの加入が必要です。");
  if (!user.email) throw new Error("メールアドレスを確認できませんでした。");
  return user.email;
}

export async function savePlusCheckin({
  user,
  anxietyLevel,
  topics,
  memo,
}: {
  user: User;
  anxietyLevel: number;
  topics: string[];
  memo: string;
}) {
  const supabase = createSupabaseAdminClient();
  if (!supabase) throw new Error("保存設定が完了していません。");
  const email = await ensurePlusAccess(user);

  const { error } = await supabase.from("plus_checkins").insert({
    user_id: user.id,
    user_email: email,
    anxiety_level: anxietyLevel,
    topics,
    memo,
  });
  if (error) throw error;
}

export async function savePlusCalmWork({
  user,
  factText,
  imaginationText,
  messageText,
  decision,
}: {
  user: User;
  factText: string;
  imaginationText: string;
  messageText: string;
  decision: string;
}) {
  const supabase = createSupabaseAdminClient();
  if (!supabase) throw new Error("保存設定が完了していません。");
  const email = await ensurePlusAccess(user);

  const { error } = await supabase.from("plus_calm_works").insert({
    user_id: user.id,
    user_email: email,
    fact_text: factText,
    imagination_text: imaginationText,
    message_text: messageText,
    decision,
  });
  if (error) throw error;
}

export async function savePlusLineRewrite({
  user,
  originalText,
  rewriteSoft,
  rewriteHonest,
  rewriteHold,
}: {
  user: User;
  originalText: string;
  rewriteSoft: string;
  rewriteHonest: string;
  rewriteHold: string;
}) {
  const supabase = createSupabaseAdminClient();
  if (!supabase) throw new Error("保存設定が完了していません。");
  const email = await ensurePlusAccess(user);

  const { error } = await supabase.from("plus_line_rewrites").insert({
    user_id: user.id,
    user_email: email,
    original_text: originalText,
    rewrite_soft: rewriteSoft,
    rewrite_honest: rewriteHonest,
    rewrite_hold: rewriteHold,
  });
  if (error) throw error;
}

export async function savePlusWeeklyReflection({
  user,
  weekNumber,
  didText,
  changedText,
  nextText,
}: {
  user: User;
  weekNumber: number;
  didText: string;
  changedText: string;
  nextText: string;
}) {
  const supabase = createSupabaseAdminClient();
  if (!supabase) throw new Error("保存設定が完了していません。");
  const email = await ensurePlusAccess(user);

  const { error } = await supabase.from("plus_weekly_reflections").insert({
    user_id: user.id,
    user_email: email,
    week_number: weekNumber,
    did_text: didText,
    changed_text: changedText,
    next_text: nextText,
  });
  if (error) throw error;
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
  if (!supabase) throw new Error("保存設定が完了していません。");

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

export async function savePlusSubscriptionFromCheckoutSession(session: Stripe.Checkout.Session) {
  const supabase = createSupabaseAdminClient();
  if (!supabase) throw new Error("保存設定が完了していません。");

  const subscriptionId = typeof session.subscription === "string" ? session.subscription : session.subscription?.id;
  if (!subscriptionId) return;

  const metadata = session.metadata ?? {};
  const userId = metadata.user_id || null;
  const email = session.customer_details?.email ?? session.customer_email ?? metadata.user_email;
  if (!email) throw new Error("Plus Subscriptionにメールアドレスがありません。");

  const { error } = await supabase.from("subscriptions").upsert(
    {
      user_id: userId,
      user_email: email,
      stripe_customer_id: typeof session.customer === "string" ? session.customer : null,
      stripe_subscription_id: subscriptionId,
      plan_type: "plus_monthly",
      status: "active",
      source: metadata.source === "transition_from_7day" ? "transition_from_7day" : "direct_plus",
      plus_start_day: Number(metadata.plus_start_day) || 1,
      linked_7day_purchase_id: metadata.linked_7day_purchase_id || null,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "stripe_subscription_id" }
  );
  if (error) throw error;
}

export async function savePlusSubscriptionFromStripeSubscription(subscription: Stripe.Subscription) {
  const supabase = createSupabaseAdminClient();
  if (!supabase) throw new Error("保存設定が完了していません。");

  const subscriptionData = subscription as Stripe.Subscription & {
    current_period_start?: number;
    current_period_end?: number;
  };
  const metadata = subscription.metadata ?? {};
  const email = metadata.user_email;
  if (!email) return;

  const { error } = await supabase.from("subscriptions").upsert(
    {
      user_id: metadata.user_id || null,
      user_email: email,
      stripe_customer_id: typeof subscription.customer === "string" ? subscription.customer : null,
      stripe_subscription_id: subscription.id,
      plan_type: "plus_monthly",
      status: subscription.status,
      source: metadata.source === "transition_from_7day" ? "transition_from_7day" : "direct_plus",
      plus_start_day: Number(metadata.plus_start_day) || 1,
      linked_7day_purchase_id: metadata.linked_7day_purchase_id || null,
      current_period_start: subscriptionData.current_period_start
        ? new Date(subscriptionData.current_period_start * 1000).toISOString()
        : null,
      current_period_end: subscriptionData.current_period_end
        ? new Date(subscriptionData.current_period_end * 1000).toISOString()
        : null,
      cancel_at_period_end: Boolean(subscription.cancel_at_period_end),
      canceled_at: subscription.canceled_at ? new Date(subscription.canceled_at * 1000).toISOString() : null,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "stripe_subscription_id" }
  );
  if (error) throw error;
}

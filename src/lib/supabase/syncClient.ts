"use client";

import type { ActionLogsByDay } from "@/types/plan";
import type { DiagnosisResult } from "@/types/diagnosis";
import { getSupabaseAccessToken } from "@/lib/supabase/client";
import {
  readActionLogs,
  readDiagnosisResult,
  saveActionLogs,
  saveDiagnosisResult,
  savePurchased7DayPlan,
} from "@/lib/storage/diagnosisStorage";

export async function syncLocalDataToSupabase() {
  const accessToken = await getSupabaseAccessToken();
  if (!accessToken) return { ok: false, error: "メール認証が必要です。" };

  const response = await fetch("/api/user/sync", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      diagnosisResult: readDiagnosisResult(),
      actionLogs: readActionLogs(),
    }),
  });

  if (!response.ok) {
    const data = (await response.json().catch(() => null)) as { error?: string } | null;
    return { ok: false, error: data?.error ?? "Supabaseへの保存に失敗しました。" };
  }

  return { ok: true, error: null };
}

export async function loadSupabaseStateToLocalStorage() {
  const accessToken = await getSupabaseAccessToken();
  if (!accessToken) return { ok: false, error: "メール認証が必要です。" };

  const response = await fetch("/api/user/state", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const data = (await response.json().catch(() => null)) as { error?: string } | null;
    return { ok: false, error: data?.error ?? "保存済みデータを確認できませんでした。" };
  }

  const data = (await response.json()) as {
    purchased: boolean;
    diagnosisResult: DiagnosisResult | null;
    actionLogs: ActionLogsByDay;
  };

  if (data.purchased) savePurchased7DayPlan();
  if (data.diagnosisResult) saveDiagnosisResult(data.diagnosisResult);
  if (data.actionLogs) saveActionLogs(data.actionLogs);

  return { ok: true, error: null, data };
}

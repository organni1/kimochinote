"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { AuthPanel } from "@/components/auth/AuthPanel";
import { AppHeader } from "@/components/layout/AppHeader";
import { MobileShell } from "@/components/layout/MobileShell";
import { Card } from "@/components/ui/Card";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { SecondaryButton } from "@/components/ui/SecondaryButton";
import { buildSevenDayPlan } from "@/lib/diagnosis/actionPlanTemplates";
import { issueCategoryLabels } from "@/lib/diagnosis/issueCategory";
import { anxietyTypeLabels, partnerExpressionTypeLabels } from "@/lib/diagnosis/resultTemplates";
import {
  hasPurchased7DayPlan,
  readActionLogs,
  readDiagnosisResult,
} from "@/lib/storage/diagnosisStorage";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { loadSupabaseStateToLocalStorage } from "@/lib/supabase/syncClient";
import type { DiagnosisResult } from "@/types/diagnosis";
import type { ActionLogsByDay } from "@/types/plan";

export default function MyPage() {
  const [user, setUser] = useState<User | null>(null);
  const [result, setResult] = useState<DiagnosisResult | null>(null);
  const [logs, setLogs] = useState<ActionLogsByDay>({});
  const [purchased, setPurchased] = useState(false);
  const [message, setMessage] = useState("");
  const [isWorking, setIsWorking] = useState(false);

  const refreshLocalState = useCallback(() => {
    setResult(readDiagnosisResult());
    setLogs(readActionLogs());
    setPurchased(hasPurchased7DayPlan());
  }, []);

  const restoreSavedData = useCallback(async (successMessage = "保存済みデータを確認しました。") => {
    setIsWorking(true);
    setMessage("");
    const remote = await loadSupabaseStateToLocalStorage();
    refreshLocalState();
    setIsWorking(false);

    if (!remote.ok) {
      setMessage(remote.error ?? "メール認証後に復元できます。");
      return remote;
    }

    setMessage(successMessage);
    return remote;
  }, [refreshLocalState]);

  useEffect(() => {
    const refreshTimer = window.setTimeout(refreshLocalState, 0);

    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      return () => window.clearTimeout(refreshTimer);
    }

    let mounted = true;
    supabase.auth.getUser().then(async ({ data }) => {
      if (!mounted) return;
      setUser(data.user);
      if (data.user) await restoreSavedData("ログイン中のデータを確認しました。");
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) restoreSavedData("ログイン中のデータを確認しました。");
    });

    return () => {
      mounted = false;
      window.clearTimeout(refreshTimer);
      subscription.unsubscribe();
    };
  }, [refreshLocalState, restoreSavedData]);

  const issueCategory = result?.issueCategory ?? "general";
  const plans = useMemo(() => buildSevenDayPlan(issueCategory), [issueCategory]);
  const completedLogCount = plans.filter((plan) => logs[String(plan.day)]).length;
  const completedDays = plans.filter((plan) => logs[String(plan.day)]).map((plan) => plan.day);

  async function signOut() {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      setMessage("メール認証の設定がまだ完了していません。");
      return;
    }

    setIsWorking(true);
    setMessage("");
    const { error } = await supabase.auth.signOut();
    setIsWorking(false);

    if (error) {
      setMessage("ログアウトできませんでした。もう一度お試しください。");
      return;
    }

    setUser(null);
    refreshLocalState();
    setMessage("ログアウトしました。端末内の診断結果と行動ログは残っています。");
  }

  return (
    <MobileShell>
      <AppHeader showBack backHref="/" title="マイページ" />

      <section className="space-y-5">
        <Card>
          <p className="text-sm font-bold text-kimochi-primary">アカウント</p>
          {user ? (
            <div className="mt-3">
              <p className="text-xl font-bold">ログイン中です</p>
              <p className="mt-2 break-words text-sm leading-relaxed text-kimochi-muted">{user.email}</p>
              <p className="mt-3 text-sm leading-relaxed text-kimochi-muted">
                購入状態や記録は、ログイン中のメールアドレスに保存されます。
              </p>
              <SecondaryButton onClick={signOut} disabled={isWorking} className="mt-5">
                ログアウト
              </SecondaryButton>
            </div>
          ) : (
            <div className="mt-3">
              <p className="text-xl font-bold">未ログインです</p>
              <p className="mt-2 text-sm leading-relaxed text-kimochi-muted">
                購入情報や行動ログを別の端末でも復元するには、購入時と同じメールアドレスでログインしてください。
              </p>
            </div>
          )}
        </Card>

        {!user ? <AuthPanel onAuthChange={setUser} /> : null}

        <Card className={purchased ? "border border-emerald-100 bg-emerald-50" : ""}>
          <p className="text-sm font-bold text-kimochi-primary">購入状態</p>
          <h1 className="mt-2 text-2xl font-bold">{purchased ? "7日間プラン購入済み" : "未購入"}</h1>
          <p className="mt-2 text-sm leading-relaxed text-kimochi-muted">
            {purchased
              ? "購入済みコンテンツをこの端末で確認できます。"
              : result
                ? "購入すると、あなたの悩みに合わせた7日間アクションプランを確認できます。"
                : "7日間プランは診断結果に合わせて作成されます。まず診断を完了してください。"}
          </p>
          <div className="mt-5 space-y-3">
            {purchased ? (
              <PrimaryButton href="/plan/7days">7日間プランを見る</PrimaryButton>
            ) : result ? (
              <>
                <PrimaryButton href="/plan/offer">購入ページへ進む</PrimaryButton>
                <SecondaryButton href="/checkout/confirm">購入済みの方はこちら</SecondaryButton>
              </>
            ) : (
              <>
                <PrimaryButton href="/diagnosis/start">診断をはじめる</PrimaryButton>
                <SecondaryButton href="/checkout/confirm">購入済みの方はこちら</SecondaryButton>
              </>
            )}
          </div>
        </Card>

        <Card>
          <p className="text-sm font-bold text-kimochi-primary">診断結果</p>
          {result ? (
            <div className="mt-4 grid gap-3">
              <ResultRow label="あなた" value={anxietyTypeLabels[result.anxietyType]} />
              <ResultRow label="彼" value={partnerExpressionTypeLabels[result.partnerExpressionType]} />
              <ResultRow label="悩み" value={issueCategoryLabels[result.issueCategory]} />
              <SecondaryButton href="/diagnosis/result" className="mt-2">診断結果を見る</SecondaryButton>
            </div>
          ) : (
            <div className="mt-3">
              <p className="text-sm leading-relaxed text-kimochi-muted">まだ診断結果がありません。</p>
              <PrimaryButton href="/diagnosis/start" className="mt-5">診断をはじめる</PrimaryButton>
            </div>
          )}
        </Card>

        <Card>
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-bold text-kimochi-primary">7日ログ進捗</p>
              <h2 className="mt-1 text-2xl font-bold">{completedLogCount} / 7日 記録済み</h2>
            </div>
            <span className={`rounded-full px-3 py-1 text-xs font-bold ${completedLogCount === 7 ? "bg-emerald-50 text-emerald-600" : "bg-kimochi-primary-soft text-kimochi-primary-dark"}`}>
              {completedLogCount === 7 ? "完了" : "進行中"}
            </span>
          </div>
          <div className="mt-4">
            <ProgressBar value={completedLogCount} max={7} />
          </div>
          <p className="mt-3 text-sm leading-relaxed text-kimochi-muted">
            {completedDays.length > 0 ? `記録済み: Day ${completedDays.join(", Day ")}` : "まだ記録はありません。"}
          </p>
          <div className="mt-5">
            {purchased ? (
              <PrimaryButton href="/plan/7days">ログを記録する</PrimaryButton>
            ) : result ? (
              <SecondaryButton href="/plan/offer">7日間プランを確認する</SecondaryButton>
            ) : (
              <SecondaryButton href="/diagnosis/start">診断をはじめる</SecondaryButton>
            )}
          </div>
        </Card>
        {message ? (
          <Card className="bg-kimochi-bg">
            <p className="text-sm font-bold leading-relaxed text-kimochi-muted">{message}</p>
          </Card>
        ) : null}
      </section>
    </MobileShell>
  );
}

function ResultRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl bg-kimochi-bg p-3">
      <span className="text-sm font-bold text-kimochi-muted">{label}</span>
      <span className="text-right font-bold">{value}</span>
    </div>
  );
}

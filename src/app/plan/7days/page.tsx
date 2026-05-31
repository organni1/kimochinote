"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { AppHeader } from "@/components/layout/AppHeader";
import { MobileShell } from "@/components/layout/MobileShell";
import { DayPlanCard } from "@/components/plan/DayPlanCard";
import { ActionLogShareSection } from "@/components/share/ActionLogShareSection";
import { Card } from "@/components/ui/Card";
import { CleanIconImage } from "@/components/ui/CleanIconImage";
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
import { loadSupabaseStateToLocalStorage } from "@/lib/supabase/syncClient";
import type { DiagnosisResult } from "@/types/diagnosis";
import type { ActionLogsByDay } from "@/types/plan";

export default function SevenDaysPlanPage() {
  const [purchased, setPurchased] = useState(false);
  const [checkingPurchase, setCheckingPurchase] = useState(true);
  const [restoreMessage, setRestoreMessage] = useState("");
  const [result, setResult] = useState<DiagnosisResult | null>(null);
  const [logs, setLogs] = useState<ActionLogsByDay>({});

  useEffect(() => {
    let mounted = true;

    async function load() {
      const localPurchased = hasPurchased7DayPlan();
      setPurchased(localPurchased);
      setResult(readDiagnosisResult());
      setLogs(readActionLogs());

      const remote = await loadSupabaseStateToLocalStorage();
      if (!mounted) return;

      if (remote.ok && remote.data) {
        setPurchased(localPurchased || remote.data.purchased);
        setResult(readDiagnosisResult());
        setLogs(readActionLogs());
        if (remote.data.purchased && !localPurchased) {
          setRestoreMessage("購入済み状態をメールアカウントから復元しました。");
        }
      }

      setCheckingPurchase(false);
    }

    load();
    return () => {
      mounted = false;
    };
  }, []);

  const issueCategory = result?.issueCategory ?? "general";
  const plans = useMemo(() => buildSevenDayPlan(issueCategory), [issueCategory]);
  const completedLogCount = plans.filter((plan) => logs[String(plan.day)]).length;
  const shareTargetDay =
    plans
      .filter((plan) => logs[String(plan.day)])
      .map((plan) => plan.day)
      .sort((a, b) => b - a)[0] ?? 1;

  if (checkingPurchase) {
    return (
      <MobileShell>
        <AppHeader showBack backHref="/plan/offer" title="7日間プラン" showMenu />
        <Card className="text-center">
          <h1 className="text-2xl font-bold">購入情報を確認しています</h1>
          <p className="mt-3 leading-loose text-kimochi-muted">
            端末内の情報と、ログイン中のメールアカウントに紐づく購入情報を確認しています。
          </p>
        </Card>
      </MobileShell>
    );
  }

  if (!purchased) {
    return (
      <MobileShell>
        <AppHeader showBack backHref="/plan/offer" title="7日間プラン" showMenu />
        <Card className="text-center">
          <Image
            src="/assets/icons/icon-heart-lock.png"
            alt=""
            width={130}
            height={130}
            className="mx-auto h-28 w-28 object-contain"
          />
          <h1 className="mt-3 text-2xl font-bold">このプランの表示には購入が必要です</h1>
          <p className="mt-3 leading-loose text-kimochi-muted">
            購入後すぐに、あなたの悩みに合わせた7日間プランを確認できます。
          </p>
          <div className="mt-5 space-y-3">
            <PrimaryButton href="/plan/offer">購入ページへ進む</PrimaryButton>
            <SecondaryButton href="/checkout/confirm">購入済みの方はこちら</SecondaryButton>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-kimochi-muted">
            購入時と同じメールアドレスでログインすると、購入済み状態を復元できます。
            Supabaseの設定が未完了の場合、復元機能は利用できません。
          </p>
        </Card>
      </MobileShell>
    );
  }

  const anxiety = result ? anxietyTypeLabels[result.anxietyType] : "言葉で安心したいタイプ";
  const partner = result ? partnerExpressionTypeLabels[result.partnerExpressionType] : "行動で示すタイプ";
  const issue = issueCategoryLabels[issueCategory];

  return (
    <MobileShell>
      <AppHeader showBack backHref="/diagnosis/result" title="あなた専用 7日間アクションプラン" showMenu />

      {restoreMessage ? (
        <Card className="mb-5 border border-emerald-100 bg-emerald-50">
          <p className="text-sm font-bold text-emerald-700">{restoreMessage}</p>
        </Card>
      ) : null}

      <div className="grid grid-cols-3 gap-3">
        {[
          ["あなた", anxiety, "/assets/icons/icon-result-you.png"],
          ["彼", partner, "/assets/icons/icon-result-partner.png"],
          ["悩み", issue, "/assets/icons/icon-result-concern.png"],
        ].map(([label, text, icon]) => (
          <Card key={label} className="p-3 text-center">
            <CleanIconImage src={icon} sizeClassName="mx-auto h-11 w-11 rounded-full" />
            <p className="mt-2 text-[11px] font-bold leading-snug text-kimochi-muted">{label}：</p>
            <p className="break-words text-xs font-bold leading-snug">{text}</p>
          </Card>
        ))}
      </div>

      <Card className="mt-5 flex gap-4">
        <Image
          src="/assets/icons/icon-note-heart.png"
          alt=""
          width={58}
          height={58}
          className="h-14 w-14 object-contain"
        />
        <div>
          <h2 className="font-bold text-kimochi-primary">あなたが書いてくれた悩み</h2>
          <p className="mt-2 leading-relaxed">
            {result?.freeTextConcern ? `「${result.freeTextConcern}」` : "自由入力はスキップされています。"}
          </p>
        </div>
      </Card>

      <p className="my-6 text-lg font-bold leading-loose">
        この1週間は、彼の気持ちを急に確認するのではなく、彼の行動を受け取りながら、
        あなたの安心ポイントを少しずつ伝えることを目指します。
      </p>

      <div className="mb-5">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-2xl font-bold">
            <span className="text-kimochi-primary">{completedLogCount}</span> / 7日 記録済み
          </p>
          <span className={`rounded-full px-3 py-1 text-xs font-bold ${completedLogCount > 0 ? "bg-emerald-50 text-emerald-600" : "bg-kimochi-primary-soft text-kimochi-primary-dark"}`}>
            {completedLogCount > 0 ? `${completedLogCount}日分完了` : "まだ記録はありません"}
          </span>
        </div>
        <ProgressBar value={completedLogCount} max={7} />
      </div>

      <div className="space-y-4">
        {plans.map((plan) => {
          const log = logs[String(plan.day)] ?? null;

          return (
            <DayPlanCard
              key={plan.day}
              plan={plan}
              log={log}
              footer={
                plan.day === shareTargetDay ? (
                  <ActionLogShareSection
                    day={plan.day}
                    title={plan.title}
                    action={plan.action}
                    insight={log?.insight}
                    isLogged={Boolean(log)}
                  />
                ) : null
              }
            />
          );
        })}
      </div>

      <Card className="mt-6 flex items-center gap-4 bg-[#fffafa]">
        <Image
          src="/assets/icons/icon-heart-sprout.png"
          alt=""
          width={82}
          height={82}
          className="h-20 w-20 object-contain"
        />
        <p className="font-bold leading-loose">
          今日の行動が終わったら、記録してみましょう。小さな変化を残すことで、
          不安を整理しやすくなります。
        </p>
      </Card>
    </MobileShell>
  );
}

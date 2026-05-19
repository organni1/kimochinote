"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { AppHeader } from "@/components/layout/AppHeader";
import { MobileShell } from "@/components/layout/MobileShell";
import { DayPlanCard } from "@/components/plan/DayPlanCard";
import { Card } from "@/components/ui/Card";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { buildSevenDayPlan } from "@/lib/diagnosis/actionPlanTemplates";
import { issueCategoryLabels } from "@/lib/diagnosis/issueCategory";
import { anxietyTypeLabels, partnerExpressionTypeLabels } from "@/lib/diagnosis/resultTemplates";
import {
  hasPurchased7DayPlan,
  readActionLogs,
  readDiagnosisResult,
} from "@/lib/storage/diagnosisStorage";
import type { DiagnosisResult } from "@/types/diagnosis";
import type { ActionLogsByDay } from "@/types/plan";

export default function SevenDaysPlanPage() {
  const [purchased, setPurchased] = useState(false);
  const [result, setResult] = useState<DiagnosisResult | null>(null);
  const [logs, setLogs] = useState<ActionLogsByDay>({});

  useEffect(() => {
    const id = window.setTimeout(() => {
      setPurchased(hasPurchased7DayPlan());
      setResult(readDiagnosisResult());
      setLogs(readActionLogs());
    }, 0);
    return () => window.clearTimeout(id);
  }, []);

  const issueCategory = result?.issueCategory ?? "general";
  const plans = useMemo(() => buildSevenDayPlan(issueCategory), [issueCategory]);
  const dayOneLog = logs["1"] ?? null;

  if (!purchased) {
    return (
      <MobileShell>
        <AppHeader showBack backHref="/plan/offer" title="7日間プラン" />
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
          <PrimaryButton href="/plan/offer" className="mt-5">
            購入ページへ進む
          </PrimaryButton>
        </Card>
      </MobileShell>
    );
  }

  const anxiety = result ? anxietyTypeLabels[result.anxietyType] : "言葉で安心したいタイプ";
  const partner = result ? partnerExpressionTypeLabels[result.partnerExpressionType] : "行動で示すタイプ";
  const issue = issueCategoryLabels[issueCategory];

  return (
    <MobileShell>
      <AppHeader showBack backHref="/diagnosis/result" title="あなた専用 7日間アクションプラン" />

      <div className="grid grid-cols-3 gap-3">
        {[
          ["あなた：", anxiety, "♥", "bg-rose-100 text-kimochi-primary"],
          ["彼：", partner, "●", "bg-sky-100 text-sky-600"],
          ["悩み：", issue, "…", "bg-amber-100 text-amber-600"],
        ].map(([label, text, mark, className]) => (
          <Card key={label} className="p-3 text-center">
            <span className={`mx-auto flex h-9 w-9 items-center justify-center rounded-full text-lg font-bold ${className}`}>
              {mark}
            </span>
            <p className="mt-1 text-xs font-bold">{label}</p>
            <p className="text-xs font-bold leading-relaxed">{text}</p>
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
            <span className="text-kimochi-primary">1</span> / 7日目
          </p>
          <span className={`rounded-full px-3 py-1 text-xs font-bold ${dayOneLog ? "bg-emerald-50 text-emerald-600" : "bg-kimochi-primary-soft text-kimochi-primary-dark"}`}>
            {dayOneLog ? "Day 1：記録済み" : "未記録"}
          </span>
        </div>
        <ProgressBar value={1} max={7} />
      </div>

      <div className="space-y-4">
        <DayPlanCard plan={plans[0]} expanded log={dayOneLog} />
        {plans.slice(1, 4).map((plan) => (
          <DayPlanCard key={plan.day} plan={plan} />
        ))}
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

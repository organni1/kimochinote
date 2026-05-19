"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { AppHeader } from "@/components/layout/AppHeader";
import { MobileShell } from "@/components/layout/MobileShell";
import { Card } from "@/components/ui/Card";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { SecondaryButton } from "@/components/ui/SecondaryButton";
import { buildSevenDayPlan } from "@/lib/diagnosis/actionPlanTemplates";
import {
  hasPurchased7DayPlan,
  readActionLog,
  readDiagnosisResult,
  saveActionLog,
} from "@/lib/storage/diagnosisStorage";
import type { DiagnosisResult } from "@/types/diagnosis";
import type { ActionLogStatus } from "@/types/plan";

const statusOptions: { label: string; value: ActionLogStatus }[] = [
  { label: "できた", value: "done" },
  { label: "少しできた", value: "partial" },
  { label: "今日はできなかった", value: "not_done" },
];

export default function ActionLogDayPage() {
  const params = useParams<{ day: string }>();
  const router = useRouter();
  const day = Number(params.day);
  const [checkedPurchase, setCheckedPurchase] = useState(false);
  const [purchased, setPurchased] = useState(false);
  const [result, setResult] = useState<DiagnosisResult | null>(null);
  const [status, setStatus] = useState<ActionLogStatus>("done");
  const [partnerReaction, setPartnerReaction] = useState("");
  const [selfFeeling, setSelfFeeling] = useState("");
  const [insight, setInsight] = useState("");

  useEffect(() => {
    const id = window.setTimeout(() => {
      const purchasedValue = hasPurchased7DayPlan();
      setPurchased(purchasedValue);
      setCheckedPurchase(true);
      setResult(readDiagnosisResult());

      const existingLog = readActionLog(day);
      if (existingLog) {
        setStatus(existingLog.status);
        setPartnerReaction(existingLog.partnerReaction);
        setSelfFeeling(existingLog.selfFeeling);
        setInsight(existingLog.insight);
      }

      if (!purchasedValue) {
        router.replace("/plan/offer");
      }
    }, 0);
    return () => window.clearTimeout(id);
  }, [day, router]);

  const issueCategory = result?.issueCategory ?? "general";
  const plan = useMemo(() => buildSevenDayPlan(issueCategory).find((item) => item.day === day), [day, issueCategory]);
  const isSupportedDay = day === 1 && Boolean(plan);

  function save() {
    if (!plan || !isSupportedDay) return;
    saveActionLog({
      day,
      status,
      partnerReaction: partnerReaction.trim(),
      selfFeeling: selfFeeling.trim(),
      insight: insight.trim(),
    });
    router.push("/plan/7days");
  }

  if (!checkedPurchase) {
    return (
      <MobileShell>
        <AppHeader showBack backHref="/plan/7days" title="行動の記録" />
        <Card className="text-center">
          <p className="font-bold leading-loose">記録画面を準備しています。</p>
        </Card>
      </MobileShell>
    );
  }

  if (!purchased) {
    return (
      <MobileShell>
        <AppHeader showBack backHref="/plan/offer" title="行動の記録" />
        <Card className="text-center">
          <Image
            src="/assets/icons/icon-heart-lock.png"
            alt=""
            width={120}
            height={120}
            className="mx-auto h-24 w-24 object-contain"
          />
          <h1 className="mt-3 text-xl font-bold">購入ページへ移動しています</h1>
          <p className="mt-2 text-sm leading-relaxed text-kimochi-muted">
            行動ログは7日間プラン購入後に利用できます。
          </p>
        </Card>
      </MobileShell>
    );
  }

  if (!isSupportedDay || !plan) {
    return (
      <MobileShell>
        <AppHeader showBack backHref="/plan/7days" title="行動の記録" />
        <Card className="text-center">
          <Image
            src="/assets/icons/icon-calendar-checks.png"
            alt=""
            width={120}
            height={120}
            className="mx-auto h-24 w-24 object-contain"
          />
          <h1 className="mt-3 text-xl font-bold">Day 2以降の記録は後続Phaseで実装します</h1>
          <p className="mt-2 text-sm leading-relaxed text-kimochi-muted">
            まずはDay 1の行動を記録して、1日の変化を残してみましょう。
          </p>
          <PrimaryButton href="/plan/7days" className="mt-5">
            7日間プランへ戻る
          </PrimaryButton>
        </Card>
      </MobileShell>
    );
  }

  return (
    <MobileShell>
      <AppHeader showBack backHref="/plan/7days" title="行動の記録" />

      <section className="text-center">
        <Image
          src="/assets/illustrations/illustration-writing-concern.png"
          alt=""
          width={190}
          height={180}
          className="mx-auto h-32 w-auto object-contain opacity-90"
        />
        <p className="mt-3 font-brand text-xl font-bold text-kimochi-primary">Day {day}</p>
        <h1 className="mt-2 text-3xl font-bold leading-relaxed">今日の行動を記録する</h1>
        <p className="mt-3 leading-loose text-kimochi-muted">
          できたかどうかだけで判断せず、感じたことをやさしく残しておきましょう。
        </p>
      </section>

      <Card className="mt-6">
        <p className="text-sm font-bold text-kimochi-primary">今日の行動</p>
        <h2 className="mt-2 text-xl font-bold leading-relaxed">{plan.action}</h2>
        <p className="mt-3 rounded-2xl bg-kimochi-bg p-3 text-sm leading-relaxed text-kimochi-muted">
          振り返り質問：{plan.reflection}
        </p>
      </Card>

      <section className="mt-6 space-y-5">
        <div>
          <label className="mb-3 block font-bold">今日の行動をできましたか？</label>
          <div className="grid gap-3">
            {statusOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setStatus(option.value)}
                className={`min-h-14 rounded-2xl border px-4 text-left font-bold transition ${
                  status === option.value
                    ? "border-kimochi-primary bg-kimochi-primary-soft text-kimochi-primary-dark"
                    : "border-kimochi-border bg-white text-kimochi-text"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <LogTextarea
          label="彼の反応"
          value={partnerReaction}
          onChange={setPartnerReaction}
          placeholder="例：ありがとうと言ってくれた / まだ反応はない / いつも通りだった"
        />
        <LogTextarea
          label="自分の気持ち"
          value={selfFeeling}
          onChange={setSelfFeeling}
          placeholder="例：少し落ち着いた / まだ不安だけど責めずに伝えられた"
        />
        <LogTextarea
          label="今日気づいたこと"
          value={insight}
          onChange={setInsight}
          placeholder="例：返信の速さだけで判断しない方が、自分も少し楽だった"
        />
      </section>

      <div className="mt-7 grid grid-cols-2 gap-4 pb-4">
        <SecondaryButton href="/plan/7days">戻る</SecondaryButton>
        <PrimaryButton onClick={save}>保存する</PrimaryButton>
      </div>
    </MobileShell>
  );
}

function LogTextarea({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <label className="block">
      <span className="mb-3 block font-bold">{label}</span>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        maxLength={240}
        placeholder={placeholder}
        className="min-h-32 w-full resize-none rounded-[22px] border border-kimochi-border bg-white p-4 leading-relaxed outline-none soft-shadow placeholder:text-kimochi-muted/60 focus:border-kimochi-primary"
      />
      <span className="mt-1 block text-right text-xs text-kimochi-muted">{value.length} / 240</span>
    </label>
  );
}

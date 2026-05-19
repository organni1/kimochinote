"use client";

import type { ActionLog, DayPlan } from "@/types/plan";
import { Card } from "@/components/ui/Card";
import { PrimaryButton } from "@/components/ui/PrimaryButton";

export function DayPlanCard({
  plan,
  expanded = false,
  log,
}: {
  plan: DayPlan;
  expanded?: boolean;
  log?: ActionLog | null;
}) {
  if (!expanded) {
    return (
      <Card className="flex items-center justify-between p-4">
        <span className="font-brand text-xl font-bold text-kimochi-primary">Day {plan.day}</span>
        <span className="text-kimochi-primary">⌄</span>
      </Card>
    );
  }

  return (
    <Card className="space-y-5">
      <div className="flex items-center gap-4">
        <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-kimochi-primary-soft font-brand text-lg font-bold text-kimochi-primary">
          Day {plan.day}
        </span>
        <div>
          {log ? (
            <span className="mb-2 inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-600">
              記録済み
            </span>
          ) : null}
          <h3 className="text-xl font-bold leading-relaxed">{plan.action}</h3>
        </div>
      </div>

      <div className="rounded-2xl border border-kimochi-border bg-kimochi-bg p-4">
        <p className="font-bold text-kimochi-primary">例文：</p>
        <p className="mt-1 leading-relaxed">「{plan.example}」</p>
      </div>

      <div>
        <h4 className="font-bold text-kimochi-primary">♡ なぜこれをするのか</h4>
        <p className="mt-2 leading-relaxed text-kimochi-muted">{plan.reason}</p>
      </div>

      <div className="border-t border-dashed border-kimochi-border pt-4">
        <h4 className="font-bold text-amber-600">△ 今日避けたいこと</h4>
        <p className="mt-2 leading-relaxed text-kimochi-muted">{plan.avoid}</p>
      </div>

      {log ? (
        <div className="rounded-2xl bg-emerald-50 p-4 text-sm leading-relaxed text-emerald-700">
          <p className="font-bold">今日の記録</p>
          <p className="mt-1">{log.insight || "小さな変化を記録しました。"}</p>
        </div>
      ) : null}

      <PrimaryButton href={`/plan/log/day/${plan.day}`}>
        {log ? "記録を見直す" : "今日の行動を記録する"}
      </PrimaryButton>
    </Card>
  );
}

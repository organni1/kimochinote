"use client";

import type { ReactNode } from "react";
import type { ActionLog, DayPlan } from "@/types/plan";
import { Card } from "@/components/ui/Card";
import { PrimaryButton } from "@/components/ui/PrimaryButton";

export function DayPlanCard({
  plan,
  expanded = true,
  log,
  footer,
}: {
  plan: DayPlan;
  expanded?: boolean;
  log?: ActionLog | null;
  footer?: ReactNode;
}) {
  const statusLabel = log ? "記録済み" : "未記録";

  if (!expanded) {
    return (
      <Card className="flex items-center justify-between p-4">
        <div>
          <span className="font-brand text-xl font-bold text-kimochi-primary">Day {plan.day}</span>
          <p className="mt-1 text-sm font-bold">{plan.title}</p>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-bold ${log ? "bg-emerald-50 text-emerald-600" : "bg-kimochi-primary-soft text-kimochi-primary-dark"}`}>
          {statusLabel}
        </span>
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
          ) : (
            <span className="mb-2 inline-flex rounded-full bg-kimochi-primary-soft px-3 py-1 text-xs font-bold text-kimochi-primary-dark">
              未記録
            </span>
          )}
          <p className="mb-1 text-sm font-bold text-kimochi-primary">Day {plan.day}：{plan.title}</p>
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

      {footer ? <div>{footer}</div> : null}
    </Card>
  );
}

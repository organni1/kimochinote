"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { savePurchased7DayPlan } from "@/lib/storage/diagnosisStorage";
import { syncLocalDataToSupabase } from "@/lib/supabase/syncClient";

export function CheckoutSuccessClient({ isPaid }: { isPaid: boolean }) {
  const router = useRouter();

  useEffect(() => {
    if (!isPaid) return;

    let timeoutId: number | undefined;
    savePurchased7DayPlan();
    syncLocalDataToSupabase().finally(() => {
      timeoutId = window.setTimeout(() => {
        router.replace("/plan/7days");
      }, 900);
    });

    return () => {
      if (timeoutId) window.clearTimeout(timeoutId);
    };
  }, [isPaid, router]);

  if (!isPaid) {
    return (
      <Card className="text-center">
        <p className="text-sm font-bold text-kimochi-primary">決済確認</p>
        <h1 className="mt-3 text-2xl font-bold">購入を確認できませんでした</h1>
        <p className="mt-3 leading-loose text-kimochi-muted">
          決済が完了していない、またはセッションの確認に失敗しました。
          もう一度購入画面からお試しください。
        </p>
        <PrimaryButton href="/checkout/confirm" className="mt-6">
          購入確認へ戻る
        </PrimaryButton>
      </Card>
    );
  }

  return (
    <Card className="text-center">
      <p className="text-sm font-bold text-kimochi-primary">決済完了</p>
      <h1 className="mt-3 text-2xl font-bold">購入が完了しました</h1>
      <p className="mt-3 leading-loose text-kimochi-muted">
        7日間アクションプランを表示する準備をしています。
        少しだけお待ちください。
      </p>
    </Card>
  );
}

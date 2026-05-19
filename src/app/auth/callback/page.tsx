"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AppHeader } from "@/components/layout/AppHeader";
import { MobileShell } from "@/components/layout/MobileShell";
import { Card } from "@/components/ui/Card";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

export default function AuthCallbackPage() {
  const router = useRouter();
  const [message, setMessage] = useState("ログイン状態を確認しています。");
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      window.setTimeout(() => {
        setFailed(true);
        setMessage("Supabaseの設定が完了していません。");
      }, 0);
      return;
    }

    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        setFailed(true);
        setMessage("ログインを確認できませんでした。もう一度メール認証をお試しください。");
        return;
      }

      setMessage("ログインできました。購入確認画面へ戻ります。");
      window.setTimeout(() => router.replace("/checkout/confirm"), 900);
    });
  }, [router]);

  return (
    <MobileShell>
      <AppHeader showBack backHref="/checkout/confirm" title="ログイン確認" />
      <Card className="text-center">
        <h1 className="text-2xl font-bold">{failed ? "ログインできませんでした" : "ログイン確認"}</h1>
        <p className="mt-3 leading-loose text-kimochi-muted">{message}</p>
        {failed ? (
          <PrimaryButton href="/checkout/confirm" className="mt-6">
            購入確認へ戻る
          </PrimaryButton>
        ) : null}
      </Card>
    </MobileShell>
  );
}

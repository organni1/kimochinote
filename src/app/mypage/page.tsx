"use client";

import { useCallback, useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { AuthPanel } from "@/components/auth/AuthPanel";
import { AppHeader } from "@/components/layout/AppHeader";
import { MobileShell } from "@/components/layout/MobileShell";
import { Card } from "@/components/ui/Card";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { SecondaryButton } from "@/components/ui/SecondaryButton";
import { hasPurchased7DayPlan } from "@/lib/storage/diagnosisStorage";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { loadSupabaseStateToLocalStorage } from "@/lib/supabase/syncClient";

export default function MyPage() {
  const [user, setUser] = useState<User | null>(null);
  const [purchased, setPurchased] = useState(false);
  const [message, setMessage] = useState("");
  const [isWorking, setIsWorking] = useState(false);

  const refreshLocalState = useCallback(() => {
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
    setMessage("ログアウトしました。この端末内の記録は残っています。");
  }

  return (
    <MobileShell>
      <AppHeader title="マイページ" />

      <section className="space-y-5">
        {!user ? (
          <>
            <Card>
              <p className="text-sm font-bold text-kimochi-primary">購入済みの方のログイン</p>
              <h1 className="mt-2 text-2xl font-bold">購入時のメールアドレスでログイン</h1>
              <p className="mt-3 text-sm leading-relaxed text-kimochi-muted">
                購入時と同じメールアドレスでログインすると、購入済み状態や記録を確認できます。
              </p>
              <SecondaryButton href="/" className="mt-5">
                トップページ
              </SecondaryButton>
            </Card>
            <AuthPanel onAuthChange={setUser} />
          </>
        ) : (
          <Card className={purchased ? "border border-emerald-100 bg-emerald-50" : ""}>
            <p className="text-sm font-bold text-kimochi-primary">アカウント</p>
            <h1 className="mt-2 text-2xl font-bold">{purchased ? "7日間プラン購入済み" : "購入情報は見つかりませんでした"}</h1>
            <p className="mt-2 break-words text-sm leading-relaxed text-kimochi-muted">{user.email}</p>
            <p className="mt-3 text-sm leading-relaxed text-kimochi-muted">
              {purchased
                ? "購入済みコンテンツをこの端末で確認できます。"
                : "購入時と同じメールアドレスでログインしているか確認してください。"}
            </p>
            <div className="mt-5 space-y-3">
              {purchased ? <PrimaryButton href="/plan/7days">7日間プランを見る</PrimaryButton> : null}
              <SecondaryButton onClick={signOut} disabled={isWorking}>
                ログアウト
              </SecondaryButton>
              <SecondaryButton href="/">トップページ</SecondaryButton>
            </div>
          </Card>
        )}
        {message ? (
          <Card className="bg-kimochi-bg">
            <p className="text-sm font-bold leading-relaxed text-kimochi-muted">{message}</p>
          </Card>
        ) : null}
      </section>
    </MobileShell>
  );
}

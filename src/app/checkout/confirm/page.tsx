"use client";

import Link from "next/link";
import { useCallback, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { AuthPanel, type AuthPanelHandle } from "@/components/auth/AuthPanel";
import { AppFooter } from "@/components/layout/AppFooter";
import { AppHeader } from "@/components/layout/AppHeader";
import { MobileShell } from "@/components/layout/MobileShell";
import { PurchaseSummaryCard } from "@/components/checkout/PurchaseSummaryCard";
import { Card } from "@/components/ui/Card";
import { CleanIconImage } from "@/components/ui/CleanIconImage";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { getSupabaseAccessToken, isSupabaseBrowserConfigured } from "@/lib/supabase/client";
import { loadSupabaseStateToLocalStorage, syncLocalDataToSupabase } from "@/lib/supabase/syncClient";

export default function CheckoutConfirmPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isDevLoading, setIsDevLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [restoreMessage, setRestoreMessage] = useState("");
  const [isCheckingRestore, setIsCheckingRestore] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [authEmail, setAuthEmail] = useState("");
  const [authNotice, setAuthNotice] = useState("");
  const authSectionRef = useRef<HTMLElement>(null);
  const authPanelRef = useRef<AuthPanelHandle>(null);
  const supabaseConfigured = isSupabaseBrowserConfigured();
  const devCheckoutEnabled =
    process.env.NODE_ENV === "development" && process.env.NEXT_PUBLIC_ENABLE_DEV_CHECKOUT === "true";
  const paymentMethods = [
    ["クレジットカード", "/assets/icons/icon-payment-card.png"],
    ["Apple Pay", "/assets/icons/icon-payment-apple-pay.png"],
    ["Google Pay", "/assets/icons/icon-payment-google-pay.png"],
  ];

  const handleAuthChange = useCallback(async (nextUser: User | null) => {
    setUser(nextUser);
    setRestoreMessage("");
    if (nextUser) setAuthNotice("");
    if (!nextUser) return;

    setIsCheckingRestore(true);
    await syncLocalDataToSupabase();
    const remote = await loadSupabaseStateToLocalStorage();
    setIsCheckingRestore(false);

    if (remote.ok && remote.data?.purchased) {
      setRestoreMessage("購入済み状態を復元しました。7日間プランへ移動します。");
      window.setTimeout(() => router.replace("/plan/7days"), 900);
      return;
    }

    if (!remote.ok) {
      setRestoreMessage("復元を確認できませんでした。購入済みの場合は、購入時と同じメールアドレスでログインしてください。");
    }
  }, [router]);

  async function purchase() {
    setErrorMessage("");

    if (!user) {
      setAuthNotice("購入前にメール認証をお願いします。メールアドレスを入力すると、購入情報を保存・復元できます。");
      authSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      window.setTimeout(() => authPanelRef.current?.focusEmail(), 350);
      return;
    }

    setIsLoading(true);

    try {
      const accessToken = await getSupabaseAccessToken();
      if (!accessToken) {
        throw new Error("購入前にメール認証を完了してください。");
      }

      await syncLocalDataToSupabase();

      const response = await fetch("/api/checkout/session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = (await response.json()) as { url?: string; error?: string };

      if (!response.ok || !data.url) {
        throw new Error(data.error ?? "購入手続きを開始できませんでした。");
      }

      window.location.href = data.url;
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "購入手続きを開始できませんでした。");
      setIsLoading(false);
    }
  }

  async function devPurchase() {
    setIsDevLoading(true);
    setErrorMessage("");

    try {
      const response = await fetch("/api/checkout/session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          devCheckout: true,
          email: authEmail.trim() || undefined,
        }),
      });
      const data = (await response.json()) as { url?: string; error?: string };

      if (!response.ok || !data.url) {
        throw new Error(data.error ?? "テスト購入を開始できませんでした。");
      }

      window.location.href = data.url;
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "テスト購入を開始できませんでした。");
      setIsDevLoading(false);
    }
  }

  return (
    <MobileShell>
      <AppHeader showBack backHref="/plan/offer" title="購入内容の確認" />
      <PurchaseSummaryCard />

      <section ref={authSectionRef} className="mt-6 scroll-mt-6">
        <AuthPanel
          ref={authPanelRef}
          onAuthChange={handleAuthChange}
          onEmailChange={setAuthEmail}
          notice={authNotice}
          highlight={Boolean(authNotice)}
        />
      </section>

      <section className="mt-7">
        <h2 className="mb-4 text-2xl font-bold">お支払い方法</h2>
        <Card className="grid grid-cols-3 gap-3 p-4">
          {paymentMethods.map(([method, icon]) => (
            <div key={method} className="rounded-2xl border border-kimochi-border p-3 text-center">
              <CleanIconImage src={icon} sizeClassName="mx-auto mb-2 h-12 w-12 rounded-xl" imageClassName="scale-100" />
              <p className="text-sm font-bold leading-snug">{method}</p>
            </div>
          ))}
        </Card>
      </section>

      <p className="my-7 text-center text-lg font-bold leading-loose">
        購入後すぐにプランを確認できます。
        <br />
        買い切りのため、月額課金ではありません。
      </p>

      <Card className="flex items-center gap-4 bg-[#fffafa]">
        <CleanIconImage src="/assets/icons/icon-secure-payment.png" sizeClassName="h-16 w-16" />
        <p className="font-bold leading-relaxed">
          決済は<span className="text-kimochi-primary">Stripe</span>を通じて安全に処理されます。
          購入済み状態はログイン中のメールアドレスに紐づいて保存されます。
        </p>
      </Card>

      {errorMessage ? (
        <Card className="mt-5 border border-amber-200 bg-kimochi-warning-bg">
          <p className="font-bold text-amber-700">購入手続きを開始できませんでした</p>
          <p className="mt-2 text-sm leading-relaxed text-kimochi-muted">{errorMessage}</p>
        </Card>
      ) : null}

      {isCheckingRestore ? (
        <Card className="mt-5 border border-kimochi-primary/20 bg-kimochi-primary-soft">
          <p className="font-bold text-kimochi-primary-dark">購入済み状態を確認しています</p>
          <p className="mt-2 text-sm leading-relaxed text-kimochi-muted">
            ログイン中のメールアドレスに紐づく購入情報を確認しています。
          </p>
        </Card>
      ) : null}

      {restoreMessage ? (
        <Card className="mt-5 border border-emerald-100 bg-emerald-50">
          <p className="text-sm font-bold text-emerald-700">{restoreMessage}</p>
        </Card>
      ) : null}

      <div className="mt-8">
        <PrimaryButton onClick={purchase} disabled={isLoading || isDevLoading || isCheckingRestore || !supabaseConfigured}>
          {isLoading ? "Stripeへ移動しています..." : "480円で購入する"}
        </PrimaryButton>
      </div>

      {devCheckoutEnabled ? (
        <Card className="mt-5 border border-amber-200 bg-kimochi-warning-bg">
          <p className="font-bold text-amber-700">開発用のテスト購入</p>
          <p className="mt-2 text-sm leading-relaxed text-kimochi-muted">
            ローカル確認用に、メール認証をスキップしてStripe Checkoutへ進みます。本番環境では表示されません。
          </p>
          <PrimaryButton onClick={devPurchase} disabled={isLoading || isDevLoading} className="mt-4">
            {isDevLoading ? "Stripeへ移動しています..." : "テスト購入へ進む"}
          </PrimaryButton>
        </Card>
      ) : null}

      <p className="mt-6 text-center text-xs leading-loose text-kimochi-muted">
        購入をもって、
        <Link href="/legal/terms" className="text-kimochi-primary underline underline-offset-4">
          利用規約
        </Link>
        、
        <Link href="/legal/privacy" className="text-kimochi-primary underline underline-offset-4">
          プライバシーポリシー
        </Link>
        および
        <Link href="/legal/commercial-transactions" className="text-kimochi-primary underline underline-offset-4">
          特定商取引法に基づく表記
        </Link>
        に同意したものとみなします。
      </p>

      <AppFooter />
    </MobileShell>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { AuthPanel } from "@/components/auth/AuthPanel";
import { AppFooter } from "@/components/layout/AppFooter";
import { AppHeader } from "@/components/layout/AppHeader";
import { MobileShell } from "@/components/layout/MobileShell";
import { PurchaseSummaryCard } from "@/components/checkout/PurchaseSummaryCard";
import { Card } from "@/components/ui/Card";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { getSupabaseAccessToken, isSupabaseBrowserConfigured } from "@/lib/supabase/client";
import { syncLocalDataToSupabase } from "@/lib/supabase/syncClient";

export default function CheckoutConfirmPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isDevLoading, setIsDevLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [authEmail, setAuthEmail] = useState("");
  const supabaseConfigured = isSupabaseBrowserConfigured();
  const devCheckoutEnabled =
    process.env.NODE_ENV === "development" && process.env.NEXT_PUBLIC_ENABLE_DEV_CHECKOUT === "true";

  const handleAuthChange = useCallback((nextUser: User | null) => {
    setUser(nextUser);
    if (nextUser) syncLocalDataToSupabase();
  }, []);

  async function purchase() {
    setIsLoading(true);
    setErrorMessage("");

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

      <section className="mt-6">
        <AuthPanel onAuthChange={handleAuthChange} onEmailChange={setAuthEmail} />
      </section>

      <section className="mt-7">
        <h2 className="mb-4 text-2xl font-bold">お支払い方法</h2>
        <Card className="grid grid-cols-3 gap-3 p-4">
          {["クレジットカード", "Apple Pay", "Google Pay"].map((method) => (
            <div key={method} className="rounded-2xl border border-kimochi-border p-3 text-center">
              <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-kimochi-bg text-xl">
                □
              </div>
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
        <Image
          src="/assets/icons/icon-secure-payment.png"
          alt=""
          width={70}
          height={70}
          className="h-16 w-16 object-contain"
        />
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

      <div className="mt-8">
        <PrimaryButton onClick={purchase} disabled={isLoading || isDevLoading || !supabaseConfigured || !user}>
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

"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { AppFooter } from "@/components/layout/AppFooter";
import { AppHeader } from "@/components/layout/AppHeader";
import { MobileShell } from "@/components/layout/MobileShell";
import { PurchaseSummaryCard } from "@/components/checkout/PurchaseSummaryCard";
import { Card } from "@/components/ui/Card";
import { PrimaryButton } from "@/components/ui/PrimaryButton";

export default function CheckoutConfirmPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function purchase() {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await fetch("/api/checkout/session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
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

  return (
    <MobileShell>
      <AppHeader showBack backHref="/plan/offer" title="購入内容の確認" />
      <PurchaseSummaryCard />

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
        </p>
      </Card>

      {errorMessage ? (
        <Card className="mt-5 border border-amber-200 bg-kimochi-warning-bg">
          <p className="font-bold text-amber-700">購入手続きを開始できませんでした</p>
          <p className="mt-2 text-sm leading-relaxed text-kimochi-muted">{errorMessage}</p>
        </Card>
      ) : null}

      <div className="mt-8">
        <PrimaryButton onClick={purchase} disabled={isLoading}>
          {isLoading ? "Stripeへ移動しています..." : "480円で購入する"}
        </PrimaryButton>
      </div>

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

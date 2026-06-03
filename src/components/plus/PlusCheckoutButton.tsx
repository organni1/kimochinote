"use client";

import { useState } from "react";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { getSupabaseAccessToken } from "@/lib/supabase/client";
import { syncLocalDataToSupabase } from "@/lib/supabase/syncClient";

type Props = {
  children?: string;
  className?: string;
};

export function PlusCheckoutButton({ children = "Kimochi Note Plusをはじめる", className = "" }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function startCheckout() {
    setIsLoading(true);
    setMessage("");

    const accessToken = await getSupabaseAccessToken();
    if (!accessToken) {
      setIsLoading(false);
      setMessage("Plusをはじめるには、購入時に使うメールアドレスでログインしてください。");
      return;
    }

    await syncLocalDataToSupabase();

    const response = await fetch("/api/plus/checkout/session", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const data = (await response.json().catch(() => null)) as { url?: string; error?: string } | null;

    if (!response.ok || !data?.url) {
      setIsLoading(false);
      setMessage(data?.error ?? "Plusの購入手続きを開始できませんでした。時間をおいてもう一度お試しください。");
      return;
    }

    window.location.href = data.url;
  }

  return (
    <div className={className}>
      <PrimaryButton onClick={startCheckout} disabled={isLoading}>
        {isLoading ? "購入手続きを準備しています..." : children}
      </PrimaryButton>
      {message ? <p className="mt-3 text-sm font-bold leading-relaxed text-kimochi-primary-dark">{message}</p> : null}
    </div>
  );
}

"use client";

import { useRef, useState } from "react";
import type { ReactNode } from "react";
import { toPng } from "html-to-image";
import { ShareCard } from "@/components/share/ShareCard";

export type ShareSectionProps = {
  anxietyTypeLabel: string;
  partnerExpressionTypeLabel: string;
  todayActionShort: string;
  siteUrl?: string;
  title?: string;
  description?: string;
};

const fallbackSiteUrl = "https://kimochinote.com";

export function ShareSection({
  anxietyTypeLabel,
  partnerExpressionTypeLabel,
  todayActionShort,
  siteUrl = process.env.NEXT_PUBLIC_SITE_URL || fallbackSiteUrl,
  title = "診断結果をシェア",
  description = "あなたの診断結果を、LINEやXで共有できます。Instagram用には画像として保存できます。",
}: ShareSectionProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [message, setMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const shareText = buildShareText({
    anxietyTypeLabel,
    partnerExpressionTypeLabel,
    todayActionShort,
    siteUrl,
  });

  function openShareUrl(url: string) {
    const opened = window.open(url, "_blank", "noopener,noreferrer");
    if (!opened) {
      setMessage("共有画面を開けませんでした。ブラウザのポップアップ設定をご確認ください。");
    }
  }

  function shareToLine() {
    const lineShareUrl = `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(siteUrl)}&text=${encodeURIComponent(shareText)}`;
    openShareUrl(lineShareUrl);
  }

  function shareToX() {
    const xShareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(siteUrl)}`;
    openShareUrl(xShareUrl);
  }

  async function saveImage() {
    if (!cardRef.current) return;

    setIsSaving(true);
    setMessage("");
    try {
      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        pixelRatio: 1,
        backgroundColor: "#FFF8F5",
      });
      const link = document.createElement("a");
      link.download = "kimochi-note-result.png";
      link.href = dataUrl;
      link.click();
      setMessage("画像を保存しました。Instagram投稿に使えます。");
    } catch {
      setMessage("画像の作成に失敗しました。時間をおいてもう一度お試しください。");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <section className="border-t border-kimochi-border/80 pt-4 text-center">
      <p className="text-xs font-bold tracking-[0.18em] text-kimochi-primary">SHARE</p>
      <h2 className="mt-1.5 text-base font-bold leading-snug">{title}</h2>
      {description ? <p className="sr-only">{description}</p> : null}

      <div className="mx-auto mt-3 grid max-w-[260px] grid-cols-3 justify-items-center gap-3">
        <ShareButton label="LINE" ariaLabel="LINEで診断結果を送る" onClick={shareToLine}>
          <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#31b900] text-[10px] font-black text-[#31b900]">
            LINE
          </span>
        </ShareButton>
        <ShareButton label="X" ariaLabel="Xで診断結果をシェアする" onClick={shareToX}>
          <span className="text-3xl font-light leading-none text-kimochi-text">X</span>
        </ShareButton>
        <ShareButton label={isSaving ? "作成中" : "画像"} ariaLabel="Instagram用の診断結果画像を保存する" onClick={saveImage} disabled={isSaving}>
          <span className="relative h-8 w-8 rounded-lg border-2 border-kimochi-primary">
            <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-kimochi-primary" />
            <span className="absolute bottom-1.5 left-1.5 h-2.5 w-[18px] rounded-sm border-l-2 border-t-2 border-kimochi-primary rotate-[-45deg]" />
          </span>
        </ShareButton>
      </div>

      <p className="mt-3 text-xs leading-relaxed text-kimochi-muted">※ 自由入力の悩みは共有されません。</p>
      {message ? (
        <p className="mt-3 rounded-2xl bg-kimochi-bg p-3 text-xs font-bold leading-relaxed text-kimochi-muted">
          {message}
        </p>
      ) : null}

      <div className="pointer-events-none fixed -left-[9999px] top-0" aria-hidden="true">
        <div ref={cardRef}>
          <ShareCard
            anxietyTypeLabel={anxietyTypeLabel}
            partnerExpressionTypeLabel={partnerExpressionTypeLabel}
            todayActionShort={todayActionShort}
            siteUrl={siteUrl}
          />
        </div>
      </div>
    </section>
  );
}

function ShareButton({
  children,
  label,
  ariaLabel,
  onClick,
  disabled = false,
}: {
  children: ReactNode;
  label: string;
  ariaLabel: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className="flex h-[72px] w-[72px] flex-col items-center justify-center gap-1.5 rounded-2xl border border-kimochi-border bg-white text-sm font-bold text-kimochi-text shadow-[0_8px_18px_rgba(95,54,41,0.08)] transition active:scale-[0.98] disabled:cursor-wait disabled:opacity-60"
    >
      {children}
      <span className="text-[10px] leading-none">{label}</span>
    </button>
  );
}

function buildShareText({
  anxietyTypeLabel,
  partnerExpressionTypeLabel,
  todayActionShort,
  siteUrl,
}: {
  anxietyTypeLabel: string;
  partnerExpressionTypeLabel: string;
  todayActionShort: string;
  siteUrl: string;
}) {
  return [
    "Kimochi Noteで診断してみました。",
    "",
    "私の恋愛不安タイプ：",
    anxietyTypeLabel,
    "",
    "相手の愛情表現タイプ：",
    partnerExpressionTypeLabel,
    "",
    "今日の小さな行動：",
    todayActionShort,
    "",
    "彼の気持ちを決めつけずに、自分の不安を整理する診断です。",
    "",
    siteUrl,
  ].join("\n");
}

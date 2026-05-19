"use client";

import Image from "next/image";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AppHeader } from "@/components/layout/AppHeader";
import { MobileShell } from "@/components/layout/MobileShell";
import { Card } from "@/components/ui/Card";
import { detectIssueCategory } from "@/lib/diagnosis/issueCategory";
import { partnerQuestions, selfQuestions } from "@/lib/diagnosis/questions";
import { anxietyTieBreakOrder, calculateTopTypes, partnerTieBreakOrder } from "@/lib/diagnosis/scoring";
import { readAnswers, readFreeTextConcern, saveDiagnosisResult, saveIssueCategory, STORAGE_KEYS } from "@/lib/storage/diagnosisStorage";

const statuses = [
  ["あなたの回答を整理しています", "/assets/icons/icon-checklist-coral.png"],
  ["書いてくれた悩みを読み取っています", "/assets/icons/icon-notebook.png"],
  ["ふたりのすれ違いポイントを見つけています", "/assets/icons/icon-heart-diagnosis.png"],
  ["今日できる小さな行動を準備しています", "/assets/icons/icon-heart-sprout.png"],
];

export default function DiagnosisLoadingPage() {
  const router = useRouter();
  useEffect(() => {
    const selfAnswers = readAnswers(STORAGE_KEYS.selfAnswers);
    const partnerAnswers = readAnswers(STORAGE_KEYS.partnerAnswers);
    const freeTextConcern = readFreeTextConcern();
    const issueCategory = detectIssueCategory(freeTextConcern);
    const anxiety = calculateTopTypes(selfQuestions, selfAnswers, anxietyTieBreakOrder);
    const partner = calculateTopTypes(partnerQuestions, partnerAnswers, partnerTieBreakOrder);
    saveIssueCategory(issueCategory);
    saveDiagnosisResult({
      anxietyType: anxiety.primary,
      subAnxietyType: anxiety.secondary,
      partnerExpressionType: partner.primary,
      subPartnerExpressionType: partner.secondary,
      issueCategory,
      freeTextConcern,
      answers: [...selfAnswers, ...partnerAnswers],
    });
    const timer = window.setTimeout(() => router.push("/diagnosis/result"), 1500);
    return () => window.clearTimeout(timer);
  }, [router]);

  return (
    <MobileShell>
      <AppHeader />
      <section className="text-center">
        <h1 className="mt-8 text-3xl font-bold leading-relaxed">診断結果を作成しています</h1>
        <div className="mx-auto my-4 h-px w-32 bg-kimochi-primary" />
        <p className="leading-loose">あなたの不安タイプと彼の愛情表現タイプ、そして今の悩みを整理しています。少しだけお待ちください。</p>
        <Image src="/assets/illustrations/illustration-holding-phone-heart.png" alt="" width={220} height={220} className="mx-auto my-5 h-44 w-auto object-contain opacity-90" />
      </section>
      <div className="space-y-4">
        {statuses.map(([status, icon]) => (
          <Card key={status} className="flex items-center justify-between p-4">
            <div className="flex items-center gap-4">
              <Image src={icon} alt="" width={50} height={50} className="h-12 w-12 object-contain" />
              <p className="font-bold leading-relaxed">{status}</p>
            </div>
            <span className="h-7 w-7 animate-spin rounded-full border-4 border-kimochi-primary-soft border-t-kimochi-primary" />
          </Card>
        ))}
      </div>
      <p className="mt-8 text-center text-xl font-bold leading-loose">もうすぐ結果をお届けします。<br />楽しみにお待ちくださいね。</p>
    </MobileShell>
  );
}

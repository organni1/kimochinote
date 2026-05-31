"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { AppHeader } from "@/components/layout/AppHeader";
import { MobileShell } from "@/components/layout/MobileShell";
import { AdviceCard } from "@/components/diagnosis/AdviceCard";
import { ConcernSummaryCard } from "@/components/diagnosis/ConcernSummaryCard";
import { PaidPlanCTA } from "@/components/diagnosis/PaidPlanCTA";
import { ResultTypeCard } from "@/components/diagnosis/ResultTypeCard";
import { ShareSection } from "@/components/share/ShareSection";
import { Card } from "@/components/ui/Card";
import { avoidActionByIssueCategory, todayActionByIssueCategory, todayActionShortByIssueCategory } from "@/lib/diagnosis/actionAdviceTemplates";
import { issueCategoryLabels } from "@/lib/diagnosis/issueCategory";
import { anxietyDescriptions, anxietyTypeLabels, partnerExpressionDescriptions, partnerExpressionTypeLabels } from "@/lib/diagnosis/resultTemplates";
import { readDiagnosisResult } from "@/lib/storage/diagnosisStorage";

import type { DiagnosisResult } from "@/types/diagnosis";

export default function DiagnosisResultPage() {
  const [result, setResult] = useState<DiagnosisResult | null>(null);
  useEffect(() => {
    const id = window.setTimeout(() => setResult(readDiagnosisResult()), 0);
    return () => window.clearTimeout(id);
  }, []);

  if (!result) {
    return (
      <MobileShell>
        <AppHeader showBack backHref="/diagnosis/start" title="診断結果" />
        <Card>
          <p className="text-center leading-loose">診断結果がまだありません。<br />もう一度診断をはじめてください。</p>
        </Card>
      </MobileShell>
    );
  }

  const anxietyLabel = anxietyTypeLabels[result.anxietyType];
  const partnerLabel = partnerExpressionTypeLabels[result.partnerExpressionType];
  const issueLabel = issueCategoryLabels[result.issueCategory];
  const todayActionShort = todayActionShortByIssueCategory[result.issueCategory];

  return (
    <MobileShell>
      <AppHeader showBack backHref="/" title="診断結果" />
      <section className="mb-6 text-center">
        <h1 className="text-xl font-bold leading-loose">
          あなたは「<span className="text-kimochi-primary">{anxietyLabel}</span>」です<br />
          彼は「<span className="text-kimochi-primary">{partnerLabel}</span>」の可能性があります
        </h1>
        <Image src="/assets/illustrations/illustration-couple-talking.png" alt="" width={260} height={220} className="mx-auto mt-3 h-44 w-auto object-contain opacity-85" />
      </section>
      <div className="space-y-5">
        <ResultTypeCard label="あなたの恋愛不安タイプ" title={anxietyLabel} description={anxietyDescriptions[result.anxietyType]} icon="/assets/icons/icon-result-you.png" />
        <ResultTypeCard label="彼の愛情表現タイプ" title={partnerLabel} description={partnerExpressionDescriptions[result.partnerExpressionType]} icon="/assets/icons/icon-result-partner.png" tone="blue" />
        <ConcernSummaryCard concern={result.freeTextConcern} categoryLabel={issueLabel} />
        <AdviceCard title="ふたりのすれ違いポイント" body={`あなたは「${anxietyLabel}」を求めやすく、彼は「${partnerLabel}」として気持ちを示している可能性があります。違いを悪いものと決めつけず、受け取り方と言葉にする量を少しずつ整えていきましょう。`} icon="/assets/icons/icon-broken-heart.png" />
        <AdviceCard title="今日のおすすめ行動" body={todayActionByIssueCategory[result.issueCategory]} icon="/assets/icons/icon-heart-sprout.png" tone="green" />
        <AdviceCard title="今日避けたいこと" body={avoidActionByIssueCategory[result.issueCategory]} icon="/assets/icons/icon-warning-heart.png" tone="purple" />
        <ShareSection
          anxietyTypeLabel={anxietyLabel}
          partnerExpressionTypeLabel={partnerLabel}
          todayActionShort={todayActionShort}
        />
        <PaidPlanCTA />
      </div>
    </MobileShell>
  );
}

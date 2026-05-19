import Image from "next/image";
import { Card } from "@/components/ui/Card";

export function ConcernSummaryCard({ concern, categoryLabel }: { concern?: string; categoryLabel: string }) {
  return (
    <Card className="flex gap-4">
      <Image src="/assets/icons/icon-note-heart.png" alt="" width={58} height={58} className="h-14 w-14 shrink-0 object-contain" />
      <div>
        <h3 className="font-bold text-kimochi-primary">あなたが書いてくれた悩み</h3>
        {concern ? (
          <>
            <p className="mt-2 rounded-2xl bg-kimochi-bg p-3 leading-relaxed">「{concern}」</p>
            <p className="mt-3 text-sm leading-relaxed text-kimochi-muted">この内容も踏まえると、今は <span className="font-bold text-kimochi-text">{categoryLabel}</span> が不安のきっかけになっている可能性があります。</p>
          </>
        ) : (
          <p className="mt-2 text-sm leading-relaxed text-kimochi-muted">今の悩みの自由入力はスキップされました。診断結果をもとに、今日できる小さな行動を提案します。</p>
        )}
      </div>
    </Card>
  );
}

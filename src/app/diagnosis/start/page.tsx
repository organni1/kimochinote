import Image from "next/image";
import { AppHeader } from "@/components/layout/AppHeader";
import { MobileShell } from "@/components/layout/MobileShell";
import { Card } from "@/components/ui/Card";
import { CleanIconImage } from "@/components/ui/CleanIconImage";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { SectionTitle } from "@/components/ui/SectionTitle";

const steps = [
  ["1", "前半：", "あなたの恋愛不安タイプを診断します", "/assets/icons/icon-checklist-coral.png"],
  ["2", "後半：", "彼の愛情表現タイプを診断します", "/assets/icons/icon-heart-chat.png"],
  ["3", "最後：", "今の悩みを自由に書けます", "/assets/icons/icon-pen-heart.png"],
];

export default function DiagnosisStartPage() {
  return (
    <MobileShell>
      <AppHeader showBack />
      <SectionTitle>無料診断をはじめます</SectionTitle>
      <p className="text-center text-lg leading-loose">
        質問は全部で20問です。<br />
        最後に、今いちばん気になっていることを自由に書くこともできます。<br />
        深く考えすぎず、今の気持ちに近いものを選んでください。
      </p>
      <Image src="/assets/illustrations/illustration-journaling-calendar.png" alt="" width={250} height={260} className="mx-auto my-3 h-48 w-auto object-contain opacity-90" />
      <div className="space-y-4">
        {steps.map(([number, title, body, icon]) => (
          <Card key={number} className="flex items-center gap-4">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-kimochi-primary font-brand text-2xl font-bold text-white">{number}</span>
            <CleanIconImage src={icon} sizeClassName="h-14 w-14" />
            <div>
              <p className="text-xl font-bold">{title}</p>
              <p className="font-bold leading-relaxed">{body}</p>
            </div>
          </Card>
        ))}
      </div>
      <p className="my-5 text-center text-lg">◷ 所要時間：約3分</p>
      <Card>
        <h2 className="mb-3 text-center text-xl font-bold">この診断で分かること</h2>
        {["あなたの恋愛不安タイプ", "彼の愛情表現タイプ", "今のすれ違いポイント", "あなたの悩みに合わせた今日の行動"].map((item) => (
          <p key={item} className="mb-2 font-bold last:mb-0">✓ {item}</p>
        ))}
      </Card>
      <Card className="mt-5 bg-[#fffafa]">
        <p className="text-sm font-bold leading-loose">この診断は、彼の気持ちを断定するものではありません。あなたの感じている不安を整理し、より落ち着いて行動するためのヒントを提案します。</p>
      </Card>
      <div className="mt-6 pb-4">
        <PrimaryButton href="/diagnosis/self">診断をはじめる</PrimaryButton>
      </div>
    </MobileShell>
  );
}

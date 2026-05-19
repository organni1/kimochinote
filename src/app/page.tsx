import Image from "next/image";
import { AppFooter } from "@/components/layout/AppFooter";
import { AppHeader } from "@/components/layout/AppHeader";
import { MobileShell } from "@/components/layout/MobileShell";
import { Card } from "@/components/ui/Card";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { SectionTitle } from "@/components/ui/SectionTitle";

const worries = [
  "彼氏が好きと言ってくれない",
  "LINEの返信が遅いと不安になる",
  "自分ばかり好きな気がする",
  "彼の愛情表現が分かりにくい",
  "重いと思われずに気持ちを伝えたい",
];

const findings = [
  ["あなたの不安タイプ", "/assets/icons/icon-heart-diagnosis.png"],
  ["彼の愛情表現タイプ", "/assets/icons/icon-hand-heart.png"],
  ["すれ違いポイント", "/assets/icons/icon-broken-heart.png"],
  ["今日の行動", "/assets/icons/icon-checklist-heart.png"],
  ["悩みに合わせた提案", "/assets/icons/icon-heart-message.png"],
];

export default function Home() {
  return (
    <MobileShell>
      <AppHeader showMenu />
      <section className="watercolor-bg -mx-5 -mt-5 px-5 pb-8 pt-3">
        <div className="relative min-h-[430px]">
          <div className="pt-12">
            <h1 className="text-4xl font-bold leading-relaxed tracking-normal">
              彼氏の気持ちが<br />分からなくて<br />不安なあなたへ
            </h1>
            <div className="my-5 h-px w-52 bg-kimochi-primary" />
            <p className="max-w-[250px] text-base font-bold leading-loose">
              恋愛不安タイプと彼の愛情表現タイプを診断して、今日取るべき小さな行動を提案します。
            </p>
          </div>
          <Image src="/assets/illustrations/illustration-anxious-profile.png" alt="" width={260} height={330} priority className="absolute bottom-0 right-[-42px] w-[235px] opacity-85" />
        </div>
        <PrimaryButton href="/diagnosis/start">無料で診断をはじめる</PrimaryButton>
        <p className="mt-4 text-center text-sm font-bold">所要時間：約<span className="text-xl text-kimochi-primary">3</span>分 / 登録なし</p>
      </section>

      <Card className="mt-7">
        <SectionTitle>こんなことで悩んでいませんか？</SectionTitle>
        <div className="space-y-3">
          {worries.map((worry) => (
            <div key={worry} className="flex items-center gap-3 border-b border-dashed border-kimochi-border pb-3 last:border-b-0 last:pb-0">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-kimochi-primary text-white">✓</span>
              <span className="font-bold">{worry}</span>
            </div>
          ))}
        </div>
      </Card>

      <section className="mt-8">
        <SectionTitle>この診断で分かること</SectionTitle>
        <div className="grid grid-cols-5 gap-2">
          {findings.map(([label, icon]) => (
            <div key={label} className="rounded-2xl bg-white p-2 text-center soft-shadow">
              <Image src={icon} alt="" width={46} height={46} className="mx-auto h-11 w-11 object-contain" />
              <p className="mt-2 text-[11px] font-bold leading-snug">{label}</p>
            </div>
          ))}
        </div>
      </section>

      <Card className="mt-8 flex items-center gap-4 border-kimochi-primary/40 bg-[#fffafa]">
        <Image src="/assets/icons/icon-heart-sprout.png" alt="" width={92} height={92} className="h-20 w-20 shrink-0 object-contain" />
        <p className="text-sm font-bold leading-loose">
          この診断は、彼の気持ちを決めつけるものではありません。あなたの不安を整理し、ふたりの関係をより良くするための小さな行動を提案します。
        </p>
      </Card>

      <div className="mt-8">
        <PrimaryButton href="/diagnosis/start">無料で診断をはじめる</PrimaryButton>
      </div>
      <AppFooter />
    </MobileShell>
  );
}

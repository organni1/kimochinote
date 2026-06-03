import Image from "next/image";
import { AppFooter } from "@/components/layout/AppFooter";
import { AppHeader } from "@/components/layout/AppHeader";
import { MobileShell } from "@/components/layout/MobileShell";
import { Card } from "@/components/ui/Card";
import { CleanIconImage } from "@/components/ui/CleanIconImage";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { SectionTitle } from "@/components/ui/SectionTitle";

const worries = [
  "彼氏が好きと言ってくれない",
  "自分ばかり好きな気がする",
  "LINEの返信が遅いと不安になる",
  "彼の愛情表現が分かりにくい",
  "重いと思われずに気持ちを伝えたい",
];

const findings = [
  ["不安タイプ", "/assets/icons/icon-heart-diagnosis.png"],
  ["彼の愛情表現", "/assets/icons/icon-hand-heart.png"],
  ["すれ違い", "/assets/icons/icon-broken-heart.png"],
  ["今日の行動", "/assets/icons/icon-checklist-heart.png"],
  ["悩み別提案", "/assets/icons/icon-heart-message.png"],
];

export default function Home() {
  return (
    <MobileShell>
      <AppHeader showMenu />
      <section className="watercolor-bg -mx-5 -mt-5 px-5 pb-8 pt-3">
        <div className="relative min-h-[430px]">
          <div className="relative z-10 pt-12">
            <h1 className="text-4xl font-bold leading-relaxed tracking-normal">
              彼の気持ちが<br />分からなくて不安な夜に
            </h1>
            <p className="max-w-[250px] text-base font-bold leading-loose">
              不安な気持ちを整理して、<br />
              彼との関係を少し前に進めるための<br />
              小さな行動を提案します。
            </p>
          </div>
          <Image src="/assets/illustrations/illustration-anxious-profile.png" alt="" width={260} height={330} priority className="absolute bottom-3 right-[-4px] w-[210px] opacity-45" />
        </div>
        <PrimaryButton href="/diagnosis/start">無料で診断をはじめる</PrimaryButton>
        <p className="mt-4 text-center text-sm font-bold">約3分で完了・登録なし</p>
      </section>

      <Card className="mt-7">
        <div className="mb-4 text-center">
          <h2 className="whitespace-nowrap text-[22px] font-bold leading-snug text-kimochi-text sm:text-2xl">
            こんなことで悩んでいませんか？
          </h2>
          <div className="mx-auto mt-2 h-px w-28 bg-gradient-to-r from-transparent via-kimochi-primary to-transparent" />
        </div>
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
              <CleanIconImage src={icon} sizeClassName="mx-auto h-11 w-11" />
              <p className="mt-2 text-[11px] font-bold leading-snug">{label}</p>
            </div>
          ))}
        </div>
      </section>

      <Card className="mt-8 flex items-center gap-4 border-kimochi-primary/40 bg-[#fffafa]">
        <Image src="/assets/icons/icon-heart-sprout.png" alt="" width={92} height={92} className="h-20 w-20 shrink-0 object-contain" />
        <div>
          <h2 className="font-bold text-kimochi-primary">安心して使える診断です</h2>
          <p className="mt-2 text-sm font-bold leading-loose">
            この診断は、彼の気持ちを決めつけるものではありません。あなたの不安を整理し、ふたりの関係をより良くするための小さな行動を提案します。
          </p>
        </div>
      </Card>

      <section className="mt-8 rounded-[22px] border border-kimochi-border/70 bg-white/70 p-5">
        <p className="text-xs font-bold tracking-[0.18em] text-kimochi-primary">AFTER DIAGNOSIS</p>
        <h2 className="mt-2 text-lg font-bold leading-snug">診断後に、続け方を選べます</h2>
        <p className="mt-3 text-sm font-bold leading-relaxed text-kimochi-muted">
          まずは無料診断だけで大丈夫です。結果を見たあと、7日間の買い切りプランか、月額Plusの30日伴走を選べます。
        </p>
      </section>

      <div className="mt-8">
        <PrimaryButton href="/diagnosis/start">無料で診断をはじめる</PrimaryButton>
      </div>
      <AppFooter />
    </MobileShell>
  );
}

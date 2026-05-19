import Image from "next/image";
import { AppHeader } from "@/components/layout/AppHeader";
import { MobileShell } from "@/components/layout/MobileShell";
import { Card } from "@/components/ui/Card";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { PlanInclusionList } from "@/components/plan/PlanInclusionList";
import { PlanPreviewCard } from "@/components/plan/PlanPreviewCard";

export default function PlanOfferPage() {
  return (
    <MobileShell>
      <AppHeader showBack backHref="/diagnosis/result" />
      <section className="text-center">
        <p className="text-lg font-bold">あなたの悩みに合わせた</p>
        <h1 className="mt-2 text-4xl font-bold leading-relaxed text-kimochi-primary">7日間アクションプラン</h1>
        <Image src="/assets/illustrations/illustration-walking-forward.png" alt="" width={220} height={220} className="mx-auto my-2 h-44 w-auto object-contain opacity-90" />
        <p className="leading-loose">診断結果と、あなたが書いてくれた悩みに基づいて、不安をぶつけずに、彼との会話を自然に増やすための1週間プランを提案します。</p>
      </section>
      <Card className="mt-6 text-center">
        <p className="inline-block rounded-xl border border-kimochi-primary px-5 py-2 font-bold text-kimochi-primary">買い切り</p>
        <p className="my-3 text-6xl font-bold text-kimochi-primary">480<span className="text-2xl text-kimochi-text">円</span></p>
        <PrimaryButton href="/checkout/confirm">購入してプランを見る</PrimaryButton>
      </Card>
      <Card className="mt-5">
        <h2 className="mb-4 text-xl font-bold">このプランに含まれるもの</h2>
        <PlanInclusionList />
      </Card>
      <section className="mt-7">
        <h2 className="mb-4 text-center text-2xl font-bold">プランの一部</h2>
        <PlanPreviewCard />
      </section>
      <Card className="mt-6 flex items-center gap-4">
        <Image src="/assets/icons/icon-hand-heart.png" alt="" width={80} height={80} className="h-20 w-20 object-contain" />
        <p className="font-bold leading-loose">このプランは、彼を操作したり、気持ちを無理に確認するためのものではありません。</p>
      </Card>
    </MobileShell>
  );
}

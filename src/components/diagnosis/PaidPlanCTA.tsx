import { CleanIconImage } from "@/components/ui/CleanIconImage";
import { PrimaryButton } from "@/components/ui/PrimaryButton";

export function PaidPlanCTA() {
  return (
    <section className="rounded-[24px] border border-kimochi-border bg-white p-5 soft-shadow">
      <div className="flex items-center gap-4">
        <CleanIconImage src="/assets/icons/icon-gift-heart.png" sizeClassName="h-16 w-16" />
        <p className="text-base font-bold leading-relaxed">
          今日だけで終わらせず、あなたの悩みに合わせた
          <span className="text-kimochi-primary">7日間プラン</span>
          で、1週間かけて安心感を育てませんか？
        </p>
      </div>
      <PrimaryButton href="/plan/offer" className="mt-4 text-base">あなたの悩みに合わせた7日間プランを見る</PrimaryButton>
      <p className="mt-3 text-center text-sm font-bold">買い切り <span className="text-2xl text-kimochi-primary">480円</span></p>
    </section>
  );
}

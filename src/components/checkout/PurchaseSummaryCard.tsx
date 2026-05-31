import { Card } from "@/components/ui/Card";
import { CleanIconImage } from "@/components/ui/CleanIconImage";

export function PurchaseSummaryCard() {
  return (
    <Card className="flex items-center gap-5">
      <CleanIconImage src="/assets/icons/icon-seven-day-action-plan.png" sizeClassName="h-24 w-24" imageClassName="scale-100" />
      <div>
        <p className="text-sm font-bold text-kimochi-primary">あなたの悩みに合わせた</p>
        <h2 className="mt-1 text-xl font-bold leading-relaxed">7日間アクションプラン</h2>
        <div className="mt-3 flex items-center gap-3">
          <span className="text-4xl font-bold text-kimochi-primary">480円</span>
          <span className="rounded-full bg-kimochi-primary-soft px-4 py-2 text-sm font-bold text-kimochi-primary-dark">
            買い切り
          </span>
        </div>
      </div>
    </Card>
  );
}

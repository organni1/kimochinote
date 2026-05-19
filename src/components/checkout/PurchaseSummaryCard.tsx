import Image from "next/image";
import { Card } from "@/components/ui/Card";

export function PurchaseSummaryCard() {
  return (
    <Card className="flex items-center gap-5">
      <Image
        src="/assets/icons/icon-notebook.png"
        alt=""
        width={110}
        height={110}
        className="h-24 w-24 shrink-0 object-contain"
      />
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

import { Card } from "@/components/ui/Card";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { SecondaryButton } from "@/components/ui/SecondaryButton";

export function ContinuationChoice() {
  return (
    <Card className="bg-[#fffafa]">
      <p className="text-center text-xs font-bold tracking-[0.22em] text-kimochi-primary">NEXT STEP</p>
      <h2 className="mt-2 text-center text-2xl font-bold">続け方を選ぶ</h2>
      <p className="mx-auto mt-3 max-w-[420px] text-center text-sm font-bold leading-relaxed text-kimochi-muted">
        まず1週間だけ整えるか、30日間ゆっくり伴走するか。今の気持ちに近い方を選べます。
      </p>

      <div className="mt-5 grid gap-4">
        <section className="rounded-2xl border border-kimochi-primary/30 bg-white p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-bold text-kimochi-primary">まず1週間だけ</p>
              <h3 className="mt-1 text-xl font-bold">7日間プラン</h3>
            </div>
            <div className="rounded-full bg-kimochi-primary-soft px-3 py-1 text-sm font-bold text-kimochi-primary-dark">
              480円
            </div>
          </div>
          <p className="mt-3 text-sm font-bold leading-relaxed text-kimochi-muted">
            買い切り。診断結果に合わせた7日分の小さな行動を確認できます。
          </p>
          <PrimaryButton href="/plan/offer" className="mt-4 text-base">
            7日間プランを見る
          </PrimaryButton>
        </section>

        <section className="rounded-2xl border border-kimochi-border bg-white p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-bold text-kimochi-primary">継続して整える</p>
              <h3 className="mt-1 text-xl font-bold">Kimochi Note Plus</h3>
            </div>
            <div className="rounded-full bg-[#f7f1ed] px-3 py-1 text-sm font-bold text-kimochi-text">
              月額980円
            </div>
          </div>
          <p className="mt-3 text-sm font-bold leading-relaxed text-kimochi-muted">
            30日伴走。チェックイン、30日アクション、LINE文面、ミニワークを使えます。
          </p>
          <SecondaryButton href="/plus" className="mt-4 text-base">
            Plusを見る
          </SecondaryButton>
        </section>
      </div>
    </Card>
  );
}

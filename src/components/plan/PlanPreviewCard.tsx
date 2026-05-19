import { Card } from "@/components/ui/Card";

export function PlanPreviewCard() {
  const items = [
    ["Day 1", "彼が最近してくれた行動を1つ思い出し、感謝を伝える"],
    ["Day 2", "自分がどんな時に安心するかを整理する"],
    ["Day 3", "彼を責めずに、自分の安心ポイントを軽く伝える"],
    ["Day 4〜Day 7", "購入後に表示されます"],
  ];
  return (
    <div className="grid grid-cols-2 gap-3">
      {items.map(([day, body]) => (
        <Card key={day} className="min-h-36 p-4 text-center">
          <p className="font-brand text-xl font-bold text-kimochi-primary">{day}</p>
          <p className="mt-2 text-sm font-bold leading-relaxed">{body}</p>
        </Card>
      ))}
    </div>
  );
}

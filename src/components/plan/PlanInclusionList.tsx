const inclusions = [
  "Day1〜Day7の具体的な行動",
  "それぞれの行動の目的",
  "実際に使える言葉の例",
  "避けたいNG行動",
  "彼の反応別アドバイス",
  "1日ごとの振り返り質問",
  "あなたが書いた悩みを踏まえた提案",
];

export function PlanInclusionList() {
  return (
    <div className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
      {inclusions.map((item) => (
        <div key={item} className="flex items-start gap-2 font-bold">
          <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-kimochi-primary text-xs text-white">✓</span>
          <span>{item}</span>
        </div>
      ))}
    </div>
  );
}

export type ShareCardProps = {
  anxietyTypeLabel: string;
  partnerExpressionTypeLabel: string;
  todayActionShort: string;
  siteUrl: string;
};

export function ShareCard({
  anxietyTypeLabel,
  partnerExpressionTypeLabel,
  todayActionShort,
  siteUrl,
}: ShareCardProps) {
  const host = siteUrl.replace(/^https?:\/\//, "").replace(/\/$/, "");

  return (
    <div className="relative flex h-[1080px] w-[1080px] flex-col overflow-hidden bg-[#FFF8F5] px-24 py-16 text-[#3D2C2C]">
      <div className="absolute right-28 top-24 text-6xl text-[#EF7D7D]">✦</div>
      <div className="absolute bottom-32 left-20 text-5xl text-[#F5B9B4]">♡</div>
      <div className="absolute bottom-24 right-24 text-5xl text-[#F5B9B4]">✧</div>

      <div className="mb-10 text-center">
        <p className="font-brand text-6xl font-bold leading-none text-[#EF7D7D]">Kimochi Note</p>
        <p className="mt-6 text-3xl font-bold leading-relaxed text-[#7A6666]">
          彼の気持ちを決めつけずに、<br />
          自分の不安を整理する診断
        </p>
      </div>

      <div className="relative z-10 flex flex-1 flex-col justify-center rounded-[56px] bg-white px-16 py-10 shadow-[0_28px_64px_rgba(95,54,41,0.10)]">
        <ShareCardItem label="私の恋愛不安タイプ" value={anxietyTypeLabel} />
        <ShareCardItem label="相手の愛情表現タイプ" value={partnerExpressionTypeLabel} />
        <ShareCardItem label="今日の小さな行動" value={todayActionShort} />
      </div>

      <p className="mt-8 text-center text-2xl font-bold text-[#7A6666]">{host}</p>
    </div>
  );
}

function ShareCardItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-b border-dashed border-[#F3D6D1] py-5 last:border-b-0">
      <p className="text-2xl font-bold text-[#EF7D7D]">{label}</p>
      <p className="mt-3 break-words text-4xl font-bold leading-snug">{value}</p>
    </div>
  );
}

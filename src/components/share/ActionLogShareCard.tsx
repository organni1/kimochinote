export type ActionLogShareCardProps = {
  day: number;
  title: string;
  action: string;
  insight: string;
  siteUrl: string;
};

export function ActionLogShareCard({
  day,
  title,
  action,
  insight,
  siteUrl,
}: ActionLogShareCardProps) {
  const host = siteUrl.replace(/^https?:\/\//, "").replace(/\/$/, "");

  return (
    <div className="relative flex h-[1080px] w-[1080px] flex-col overflow-hidden bg-[#FFF8F5] px-24 py-16 text-[#3D2C2C]">
      <div className="absolute right-28 top-24 text-6xl text-[#EF7D7D]">✦</div>
      <div className="absolute bottom-32 left-20 text-5xl text-[#F5B9B4]">♡</div>
      <div className="absolute bottom-24 right-24 text-5xl text-[#F5B9B4]">✧</div>

      <div className="mb-9 text-center">
        <p className="font-brand text-6xl font-bold leading-none text-[#EF7D7D]">Kimochi Note</p>
        <p className="mt-5 text-3xl font-bold leading-relaxed text-[#7A6666]">
          今日の一歩を記録しました
        </p>
      </div>

      <div className="relative z-10 flex flex-1 flex-col rounded-[56px] bg-white px-16 py-10 shadow-[0_28px_64px_rgba(95,54,41,0.10)]">
        <div className="mb-7 flex items-center justify-center gap-5">
          <span className="flex h-24 w-24 items-center justify-center rounded-full bg-[#FFE5E7] font-brand text-4xl font-bold text-[#EF7D7D]">
            {day}
          </span>
          <div className="text-left">
            <p className="text-2xl font-bold text-[#EF7D7D]">Day {day}</p>
            <h1 className="mt-1 break-words text-4xl font-bold leading-snug">{title}</h1>
          </div>
        </div>

        <ActionLogShareCardItem label="今日の行動" value={action} />
        <ActionLogShareCardItem label="今日の気づき" value={insight} />
      </div>

      <p className="mt-8 text-center text-2xl font-bold text-[#7A6666]">{host}</p>
    </div>
  );
}

function ActionLogShareCardItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-t border-dashed border-[#F3D6D1] py-7">
      <p className="text-2xl font-bold text-[#EF7D7D]">{label}</p>
      <p className="mt-3 break-words text-4xl font-bold leading-snug">{value}</p>
    </div>
  );
}

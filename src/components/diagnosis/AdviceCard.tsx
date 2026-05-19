import Image from "next/image";
import { Card } from "@/components/ui/Card";

export function AdviceCard({ title, body, icon, tone = "coral" }: { title: string; body: string; icon: string; tone?: "coral" | "green" | "purple" | "orange" }) {
  const toneClass = {
    coral: "text-kimochi-primary",
    green: "text-emerald-600",
    purple: "text-purple-500",
    orange: "text-amber-600",
  }[tone];
  return (
    <Card className="flex items-start gap-4">
      <Image src={icon} alt="" width={54} height={54} className="h-14 w-14 shrink-0 rounded-full object-contain" />
      <div>
        <h3 className={`text-lg font-bold ${toneClass}`}>{title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-kimochi-text">{body}</p>
      </div>
    </Card>
  );
}

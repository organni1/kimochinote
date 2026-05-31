import { Card } from "@/components/ui/Card";
import { CleanIconImage } from "@/components/ui/CleanIconImage";

export function ResultTypeCard({ label, title, description, icon, tone = "coral" }: { label: string; title: string; description: string; icon: string; tone?: "coral" | "blue" }) {
  return (
    <Card className="flex gap-4">
      <div className={`flex h-20 w-20 shrink-0 items-center justify-center rounded-full ${tone === "blue" ? "bg-blue-50" : "bg-kimochi-primary-soft"}`}>
        <CleanIconImage src={icon} sizeClassName="h-14 w-14" />
      </div>
      <div>
        <p className={`text-sm font-bold ${tone === "blue" ? "text-blue-500" : "text-kimochi-primary"}`}>{label}</p>
        <h3 className="mt-1 text-2xl font-bold">{title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-kimochi-muted">{description}</p>
      </div>
    </Card>
  );
}

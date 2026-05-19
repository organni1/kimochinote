import { Card } from "@/components/ui/Card";

export function QuestionCard({ text }: { text: string }) {
  return (
    <Card className="my-6 flex min-h-40 items-center justify-center px-7">
      <p className="text-center text-2xl font-bold leading-relaxed">{text}</p>
    </Card>
  );
}

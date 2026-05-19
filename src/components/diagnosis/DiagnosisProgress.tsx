import { ProgressBar } from "@/components/ui/ProgressBar";

export function DiagnosisProgress({ current }: { current: number }) {
  return (
    <div className="space-y-4">
      <p className="text-center text-4xl font-bold text-kimochi-text">
        <span className="text-kimochi-primary">{current}</span>
        <span className="mx-2 text-2xl">/</span>
        <span className="text-2xl">20</span>
      </p>
      <ProgressBar value={current} max={20} />
    </div>
  );
}

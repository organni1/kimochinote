import type { DiagnosisAnswer } from "@/types/diagnosis";

export function AnswerOption({
  label,
  score,
  selected,
  onSelect,
}: {
  label: string;
  score: DiagnosisAnswer["score"];
  selected: boolean;
  onSelect: (score: DiagnosisAnswer["score"]) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(score)}
      className={`flex min-h-16 w-full items-center gap-4 rounded-2xl border px-5 py-3 text-left text-base font-bold transition ${
        selected
          ? "border-kimochi-primary bg-kimochi-primary-soft text-kimochi-primary-dark"
          : "border-kimochi-border bg-white text-kimochi-text"
      }`}
    >
      <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 ${selected ? "border-kimochi-primary bg-kimochi-primary text-white" : "border-[#ad9a91]"}`}>
        {selected ? "✓" : ""}
      </span>
      <span>{label}</span>
    </button>
  );
}

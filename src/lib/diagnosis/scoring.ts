import type { DiagnosisAnswer, DiagnosisQuestion } from "@/types/diagnosis";

export function calculateTopTypes<TType extends string>(
  questions: DiagnosisQuestion<TType>[],
  answers: DiagnosisAnswer[],
  tieBreakOrder: readonly TType[],
): { primary: TType; secondary?: TType } {
  const scores = new Map<TType, number>();

  for (const question of questions) {
    if (!scores.has(question.targetType)) scores.set(question.targetType, 0);
    const answer = answers.find((a) => a.questionId === question.id);
    if (!answer) continue;
    scores.set(question.targetType, (scores.get(question.targetType) ?? 0) + answer.score);
  }

  const sorted = Array.from(scores.entries()).sort((a, b) => {
    if (b[1] !== a[1]) return b[1] - a[1];
    return tieBreakOrder.indexOf(a[0]) - tieBreakOrder.indexOf(b[0]);
  });

  return { primary: sorted[0][0], secondary: sorted[1]?.[0] };
}

export const anxietyTieBreakOrder = [
  "abandonment_anxiety",
  "contact_anxiety",
  "word_reassurance",
  "future_anxiety",
  "mismatch_anxiety",
] as const;

export const partnerTieBreakOrder = [
  "actions",
  "support",
  "time",
  "words",
  "future",
  "freedom",
] as const;

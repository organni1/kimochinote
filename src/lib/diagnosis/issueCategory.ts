import type { IssueCategory } from "@/types/diagnosis";

export const issueCategoryLabels: Record<IssueCategory, string> = {
  contact: "連絡頻度や返信の変化",
  words: "言葉での愛情表現の少なさ",
  abandonment: "相手の態度の変化",
  future: "将来の見通しが見えないこと",
  mismatch: "ふたりの気持ちの温度差",
  general: "今の関係への不安",
};

export function detectIssueCategory(text: string): IssueCategory {
  const normalized = text.toLowerCase();
  if (["line", "返信", "既読", "未読", "連絡"].some((word) => normalized.includes(word))) return "contact";
  if (["好き", "言ってくれ", "愛情表現", "愛され"].some((word) => normalized.includes(word))) return "words";
  if (["冷め", "そっけない", "前より", "態度", "嫌われ"].some((word) => normalized.includes(word))) return "abandonment";
  if (["結婚", "将来", "同棲"].some((word) => normalized.includes(word))) return "future";
  if (["自分ばかり", "温度差", "すれ違"].some((word) => normalized.includes(word))) return "mismatch";
  return "general";
}

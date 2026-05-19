export type AnxietyType =
  | "word_reassurance"
  | "contact_anxiety"
  | "abandonment_anxiety"
  | "future_anxiety"
  | "mismatch_anxiety";

export type PartnerExpressionType =
  | "words"
  | "actions"
  | "time"
  | "support"
  | "freedom"
  | "future";

export type IssueCategory =
  | "contact"
  | "words"
  | "abandonment"
  | "future"
  | "mismatch"
  | "general";

export type DiagnosisQuestion<TType extends string> = {
  id: string;
  order: number;
  section: "self" | "partner";
  text: string;
  targetType: TType;
};

export type DiagnosisAnswer = {
  questionId: string;
  score: 1 | 2 | 3 | 4 | 5;
};

export type DiagnosisResult = {
  anxietyType: AnxietyType;
  subAnxietyType?: AnxietyType;
  partnerExpressionType: PartnerExpressionType;
  subPartnerExpressionType?: PartnerExpressionType;
  issueCategory: IssueCategory;
  freeTextConcern?: string;
  answers: DiagnosisAnswer[];
};

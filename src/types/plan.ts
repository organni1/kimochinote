export type DayPlan = {
  day: number;
  title: string;
  action: string;
  example: string;
  reason: string;
  avoid: string;
  reflection: string;
};

export type ActionLogStatus = "done" | "partial" | "not_done";

export type ActionLog = {
  day: number;
  status: ActionLogStatus;
  partnerReaction: string;
  selfFeeling: string;
  insight: string;
  createdAt: string;
  updatedAt: string;
};

export type ActionLogsByDay = Record<string, ActionLog>;

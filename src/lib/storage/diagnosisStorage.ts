import type { DiagnosisAnswer, DiagnosisResult, IssueCategory } from "@/types/diagnosis";
import type { ActionLog, ActionLogsByDay } from "@/types/plan";

export const STORAGE_KEYS = {
  selfAnswers: "futari_self_answers",
  partnerAnswers: "futari_partner_answers",
  freeTextConcern: "futari_free_text_concern",
  detectedIssueCategory: "futari_detected_issue_category",
  diagnosisResult: "futari_diagnosis_result",
  purchased7DayPlan: "futari_purchased_7day_plan",
  actionLogs: "futari_action_logs",
} as const;

function canUseStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function readJson<T>(key: string, fallback: T): T {
  if (!canUseStorage()) return fallback;
  const raw = window.localStorage.getItem(key);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function saveAnswers(key: typeof STORAGE_KEYS.selfAnswers | typeof STORAGE_KEYS.partnerAnswers, answers: DiagnosisAnswer[]) {
  if (canUseStorage()) window.localStorage.setItem(key, JSON.stringify(answers));
}

export function readAnswers(key: typeof STORAGE_KEYS.selfAnswers | typeof STORAGE_KEYS.partnerAnswers) {
  return readJson<DiagnosisAnswer[]>(key, []);
}

export function saveFreeTextConcern(text: string) {
  if (canUseStorage()) window.localStorage.setItem(STORAGE_KEYS.freeTextConcern, text);
}

export function readFreeTextConcern() {
  return canUseStorage() ? window.localStorage.getItem(STORAGE_KEYS.freeTextConcern) ?? "" : "";
}

export function saveIssueCategory(category: IssueCategory) {
  if (canUseStorage()) window.localStorage.setItem(STORAGE_KEYS.detectedIssueCategory, category);
}

export function saveDiagnosisResult(result: DiagnosisResult) {
  if (canUseStorage()) window.localStorage.setItem(STORAGE_KEYS.diagnosisResult, JSON.stringify(result));
}

export function readDiagnosisResult() {
  return readJson<DiagnosisResult | null>(STORAGE_KEYS.diagnosisResult, null);
}

export function savePurchased7DayPlan() {
  if (canUseStorage()) window.localStorage.setItem(STORAGE_KEYS.purchased7DayPlan, "true");
}

export function hasPurchased7DayPlan() {
  return canUseStorage() && window.localStorage.getItem(STORAGE_KEYS.purchased7DayPlan) === "true";
}

export function readActionLogs() {
  return readJson<ActionLogsByDay>(STORAGE_KEYS.actionLogs, {});
}

export function saveActionLogs(logs: ActionLogsByDay) {
  if (canUseStorage()) window.localStorage.setItem(STORAGE_KEYS.actionLogs, JSON.stringify(logs));
}

export function readActionLog(day: number) {
  return readActionLogs()[String(day)] ?? null;
}

export function saveActionLog(log: Omit<ActionLog, "createdAt" | "updatedAt">) {
  if (!canUseStorage()) return;
  const logs = readActionLogs();
  const existing = logs[String(log.day)];
  const now = new Date().toISOString();
  logs[String(log.day)] = {
    ...log,
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
  };
  window.localStorage.setItem(STORAGE_KEYS.actionLogs, JSON.stringify(logs));
}

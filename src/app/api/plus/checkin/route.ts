import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/supabase/server";
import { savePlusCheckin } from "@/lib/supabase/userData";

const allowedTopics = new Set(["reply", "words", "distance", "future", "mismatch", "other"]);

export async function POST(request: Request) {
  const { user, error } = await getAuthenticatedUser(request);
  if (!user) return NextResponse.json({ error: error ?? "ログインが必要です。" }, { status: 401 });

  const payload = (await request.json().catch(() => null)) as {
    anxietyLevel?: number;
    topics?: string[];
    memo?: string;
  } | null;

  const anxietyLevel = Math.max(1, Math.min(5, Number(payload?.anxietyLevel) || 3));
  const topics = (payload?.topics ?? []).filter((topic) => allowedTopics.has(topic)).slice(0, 4);
  const memo = String(payload?.memo ?? "").trim().slice(0, 240);

  try {
    await savePlusCheckin({ user, anxietyLevel, topics, memo });
    return NextResponse.json({ ok: true });
  } catch (saveError) {
    console.error("Failed to save Plus checkin", saveError);
    return NextResponse.json({ error: "今日の不安チェックインを保存できませんでした。" }, { status: 500 });
  }
}

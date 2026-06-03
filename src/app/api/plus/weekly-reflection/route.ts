import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/supabase/server";
import { savePlusWeeklyReflection } from "@/lib/supabase/userData";

export async function POST(request: Request) {
  const { user, error } = await getAuthenticatedUser(request);
  if (!user) return NextResponse.json({ error: error ?? "ログインが必要です。" }, { status: 401 });

  const payload = (await request.json().catch(() => null)) as {
    weekNumber?: number;
    didText?: string;
    changedText?: string;
    nextText?: string;
  } | null;

  const weekNumber = Math.max(1, Math.min(4, Number(payload?.weekNumber) || 1));

  try {
    await savePlusWeeklyReflection({
      user,
      weekNumber,
      didText: String(payload?.didText ?? "").trim().slice(0, 240),
      changedText: String(payload?.changedText ?? "").trim().slice(0, 240),
      nextText: String(payload?.nextText ?? "").trim().slice(0, 240),
    });
    return NextResponse.json({ ok: true });
  } catch (saveError) {
    console.error("Failed to save Plus weekly reflection", saveError);
    return NextResponse.json({ error: "週次振り返りを保存できませんでした。" }, { status: 500 });
  }
}

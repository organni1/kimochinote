import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/supabase/server";
import { savePlusActionLog } from "@/lib/supabase/userData";

export async function POST(request: Request) {
  const { user, error } = await getAuthenticatedUser(request);
  if (!user) {
    return NextResponse.json(
      { error: error ?? "ログインが必要です。" },
      { status: 401 }
    );
  }

  const payload = (await request.json().catch(() => null)) as { day?: number; insight?: string } | null;
  const day = Number(payload?.day);
  const insight = String(payload?.insight ?? "").trim().slice(0, 240);

  if (!Number.isFinite(day) || day < 1 || day > 30) {
    return NextResponse.json({ error: "保存するDayを確認できませんでした。" }, { status: 400 });
  }

  try {
    await savePlusActionLog({ user, day, insight });
    return NextResponse.json({ ok: true });
  } catch (saveError) {
    console.error("Failed to save Plus action log", saveError);
    return NextResponse.json(
      { error: "Plusの記録を保存できませんでした。" },
      { status: 500 }
    );
  }
}

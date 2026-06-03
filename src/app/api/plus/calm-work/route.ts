import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/supabase/server";
import { savePlusCalmWork } from "@/lib/supabase/userData";

export async function POST(request: Request) {
  const { user, error } = await getAuthenticatedUser(request);
  if (!user) return NextResponse.json({ error: error ?? "ログインが必要です。" }, { status: 401 });

  const payload = (await request.json().catch(() => null)) as {
    factText?: string;
    imaginationText?: string;
    messageText?: string;
    decision?: string;
  } | null;

  try {
    await savePlusCalmWork({
      user,
      factText: String(payload?.factText ?? "").trim().slice(0, 240),
      imaginationText: String(payload?.imaginationText ?? "").trim().slice(0, 240),
      messageText: String(payload?.messageText ?? "").trim().slice(0, 240),
      decision: String(payload?.decision ?? "").trim().slice(0, 160),
    });
    return NextResponse.json({ ok: true });
  } catch (saveError) {
    console.error("Failed to save Plus calm work", saveError);
    return NextResponse.json({ error: "ミニワークを保存できませんでした。" }, { status: 500 });
  }
}

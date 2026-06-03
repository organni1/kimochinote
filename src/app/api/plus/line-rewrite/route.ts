import { NextResponse } from "next/server";
import { buildLineRewrite } from "@/lib/plus/lineRewrite";
import { getAuthenticatedUser } from "@/lib/supabase/server";
import { savePlusLineRewrite } from "@/lib/supabase/userData";

export async function POST(request: Request) {
  const { user, error } = await getAuthenticatedUser(request);
  if (!user) return NextResponse.json({ error: error ?? "ログインが必要です。" }, { status: 401 });

  const payload = (await request.json().catch(() => null)) as { originalText?: string } | null;
  const originalText = String(payload?.originalText ?? "").trim().slice(0, 240);

  if (!originalText) {
    return NextResponse.json({ error: "言い換えたい文面を入力してください。" }, { status: 400 });
  }

  const rewrite = buildLineRewrite(originalText);

  try {
    await savePlusLineRewrite({
      user,
      originalText,
      rewriteSoft: rewrite.soft,
      rewriteHonest: rewrite.honest,
      rewriteHold: rewrite.hold,
    });
    return NextResponse.json({ rewrite });
  } catch (saveError) {
    console.error("Failed to save Plus line rewrite", saveError);
    return NextResponse.json({ error: "LINE文面の言い換えを保存できませんでした。" }, { status: 500 });
  }
}

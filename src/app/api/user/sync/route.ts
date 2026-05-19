import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/supabase/server";
import { syncUserData } from "@/lib/supabase/userData";
import type { ActionLogsByDay } from "@/types/plan";
import type { DiagnosisResult } from "@/types/diagnosis";

export async function POST(request: Request) {
  const { user, error } = await getAuthenticatedUser(request);
  if (!user) return NextResponse.json({ error }, { status: 401 });

  try {
    const payload = (await request.json()) as {
      diagnosisResult?: DiagnosisResult | null;
      actionLogs?: ActionLogsByDay;
    };
    await syncUserData(user, payload);
    return NextResponse.json({ ok: true });
  } catch (syncError) {
    console.error("Failed to sync user data", syncError);
    return NextResponse.json(
      { error: "診断結果や行動ログの保存に失敗しました。" },
      { status: 500 }
    );
  }
}

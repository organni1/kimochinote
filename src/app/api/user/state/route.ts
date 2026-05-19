import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/supabase/server";
import { readUserState } from "@/lib/supabase/userData";

export async function GET(request: Request) {
  const { user, error } = await getAuthenticatedUser(request);
  if (!user) return NextResponse.json({ error }, { status: 401 });

  try {
    const state = await readUserState(user);
    return NextResponse.json(state);
  } catch (stateError) {
    console.error("Failed to read user state", stateError);
    return NextResponse.json(
      { error: "購入情報や保存済みデータを確認できませんでした。" },
      { status: 500 }
    );
  }
}

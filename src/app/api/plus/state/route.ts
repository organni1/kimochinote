import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/supabase/server";
import {
  readPlusActionLogs,
  readPlusDashboardData,
  readPlusState,
  readSevenDayContext,
  readUserState,
} from "@/lib/supabase/userData";
import { calculatePlusDay, getPlusAction } from "@/lib/plus/plusPlan";

export async function GET(request: Request) {
  const { user, error } = await getAuthenticatedUser(request);
  if (!user) {
    return NextResponse.json(
      { error: error ?? "ログインが必要です。" },
      { status: 401 }
    );
  }

  try {
    const [plusState, sevenDayContext, userState, plusActionLogs, dashboard] = await Promise.all([
      readPlusState(user),
      readSevenDayContext(user),
      readUserState(user),
      readPlusActionLogs(user),
      readPlusDashboardData(user),
    ]);
    const currentDay = plusState.subscription
      ? calculatePlusDay(plusState.subscription.createdAt, plusState.subscription.plusStartDay)
      : 1;

    return NextResponse.json({
      ...plusState,
      sevenDay: sevenDayContext,
      diagnosisResult: userState.diagnosisResult,
      actionLogs: userState.actionLogs,
      plusActionLogs,
      dashboard,
      currentDay,
      currentAction: getPlusAction(currentDay),
    });
  } catch (stateError) {
    console.error("Failed to read Plus state", stateError);
    return NextResponse.json(
      { error: "Plusの状態を確認できませんでした。" },
      { status: 500 }
    );
  }
}

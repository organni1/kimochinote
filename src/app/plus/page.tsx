"use client";

import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { AuthPanel } from "@/components/auth/AuthPanel";
import { AppHeader } from "@/components/layout/AppHeader";
import { MobileShell } from "@/components/layout/MobileShell";
import { PlusCheckoutButton } from "@/components/plus/PlusCheckoutButton";
import { Card } from "@/components/ui/Card";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { SecondaryButton } from "@/components/ui/SecondaryButton";
import { anxietyTypeLabels, partnerExpressionTypeLabels } from "@/lib/diagnosis/resultTemplates";
import { getSupabaseAccessToken, getSupabaseBrowserClient } from "@/lib/supabase/client";
import type { DiagnosisResult } from "@/types/diagnosis";
import type { ActionLogsByDay } from "@/types/plan";

type PlusAction = {
  day: number;
  title: string;
  action: string;
};

type PlusState = {
  hasPlus: boolean;
  subscription: {
    status: string;
    source: "direct_plus" | "transition_from_7day";
    plusStartDay: number;
    currentPeriodEnd: string | null;
    cancelAtPeriodEnd: boolean;
    createdAt: string | null;
  } | null;
  sevenDay: {
    hasSevenDayPurchase: boolean;
    sevenDayLogCount: number;
    latestCompletedDay: number;
    source: "direct_plus" | "transition_from_7day";
    plusStartDay: number;
  };
  diagnosisResult: DiagnosisResult | null;
  actionLogs: ActionLogsByDay;
  plusActionLogs: Record<string, {
    day: number;
    insight: string;
    completed: boolean;
    updatedAt: string;
  }>;
  dashboard: {
    latestCheckin: {
      anxietyLevel: number | null;
      topics: string[];
      memo: string;
      createdAt: string;
    } | null;
    latestCalmWork: {
      factText: string;
      imaginationText: string;
      messageText: string;
      decision: string;
      createdAt: string;
    } | null;
    latestLineRewrite: {
      originalText: string;
      rewriteSoft: string;
      rewriteHonest: string;
      rewriteHold: string;
      createdAt: string;
    } | null;
    latestWeeklyReflection: {
      weekNumber: number;
      didText: string;
      changedText: string;
      nextText: string;
      createdAt: string;
    } | null;
  };
  currentDay: number;
  currentAction: PlusAction;
};

const checkinTopics = [
  ["reply", "返信"],
  ["words", "言葉"],
  ["distance", "距離感"],
  ["future", "将来"],
  ["mismatch", "温度差"],
  ["other", "その他"],
] as const;

export default function PlusPage() {
  const [user, setUser] = useState<User | null>(null);
  const [state, setState] = useState<PlusState | null>(null);
  const [insight, setInsight] = useState("");
  const [anxietyLevel, setAnxietyLevel] = useState(3);
  const [topics, setTopics] = useState<string[]>([]);
  const [checkinMemo, setCheckinMemo] = useState("");
  const [factText, setFactText] = useState("");
  const [imaginationText, setImaginationText] = useState("");
  const [messageText, setMessageText] = useState("");
  const [decision, setDecision] = useState("");
  const [lineText, setLineText] = useState("");
  const [lineRewrite, setLineRewrite] = useState<{ soft: string; honest: string; hold: string } | null>(null);
  const [weekDid, setWeekDid] = useState("");
  const [weekChanged, setWeekChanged] = useState("");
  const [weekNext, setWeekNext] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSavingLog, setIsSavingLog] = useState(false);
  const [workingAction, setWorkingAction] = useState("");
  const [message, setMessage] = useState("");

  async function loadPlusState() {
    setIsLoading(true);
    setMessage("");

    const accessToken = await getSupabaseAccessToken();
    if (!accessToken) {
      setState(null);
      setIsLoading(false);
      return;
    }

    const response = await fetch("/api/plus/state", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const data = (await response.json().catch(() => null)) as PlusState | { error?: string } | null;
    setIsLoading(false);

    if (!response.ok || !data || "error" in data) {
      const errorMessage = data && "error" in data ? data.error : undefined;
      setMessage(errorMessage ?? "Plusの状態を確認できませんでした。");
      return;
    }

    const plusState = data as PlusState;
    setState(plusState);
    setInsight(plusState.plusActionLogs?.[String(plusState.currentDay)]?.insight ?? "");
    setAnxietyLevel(plusState.dashboard.latestCheckin?.anxietyLevel ?? 3);
    setTopics(plusState.dashboard.latestCheckin?.topics ?? []);
    setCheckinMemo(plusState.dashboard.latestCheckin?.memo ?? "");
    setFactText(plusState.dashboard.latestCalmWork?.factText ?? "");
    setImaginationText(plusState.dashboard.latestCalmWork?.imaginationText ?? "");
    setMessageText(plusState.dashboard.latestCalmWork?.messageText ?? "");
    setDecision(plusState.dashboard.latestCalmWork?.decision ?? "");
    setLineText(plusState.dashboard.latestLineRewrite?.originalText ?? "");
    setLineRewrite(
      plusState.dashboard.latestLineRewrite
        ? {
            soft: plusState.dashboard.latestLineRewrite.rewriteSoft,
            honest: plusState.dashboard.latestLineRewrite.rewriteHonest,
            hold: plusState.dashboard.latestLineRewrite.rewriteHold,
          }
        : null
    );
    setWeekDid(plusState.dashboard.latestWeeklyReflection?.didText ?? "");
    setWeekChanged(plusState.dashboard.latestWeeklyReflection?.changedText ?? "");
    setWeekNext(plusState.dashboard.latestWeeklyReflection?.nextText ?? "");
  }

  async function postPlusFeature(endpoint: string, body: unknown, actionName: string) {
    setWorkingAction(actionName);
    setMessage("");

    const accessToken = await getSupabaseAccessToken();
    if (!accessToken) {
      setWorkingAction("");
      setMessage("保存するにはログインが必要です。");
      return null;
    }

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(body),
    });

    const data = (await response.json().catch(() => null)) as { error?: string; rewrite?: { soft: string; honest: string; hold: string } } | null;
    setWorkingAction("");

    if (!response.ok) {
      setMessage(data?.error ?? "保存できませんでした。時間をおいてもう一度お試しください。");
      return null;
    }

    await loadPlusState();
    return data;
  }

  function toggleTopic(topic: string) {
    setTopics((current) =>
      current.includes(topic)
        ? current.filter((item) => item !== topic)
        : [...current, topic].slice(0, 4)
    );
  }

  async function saveCurrentActionLog() {
    if (!state) return;

    setIsSavingLog(true);
    setMessage("");

    const accessToken = await getSupabaseAccessToken();
    if (!accessToken) {
      setIsSavingLog(false);
      setMessage("記録を保存するにはログインが必要です。");
      return;
    }

    const response = await fetch("/api/plus/action-log", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        day: state.currentDay,
        insight,
      }),
    });

    setIsSavingLog(false);

    if (!response.ok) {
      const data = (await response.json().catch(() => null)) as { error?: string } | null;
      setMessage(data?.error ?? "Plusの記録を保存できませんでした。");
      return;
    }

    await loadPlusState();
    setMessage("今日の一歩を保存しました。");
  }

  async function saveCheckin() {
    const result = await postPlusFeature(
      "/api/plus/checkin",
      { anxietyLevel, topics, memo: checkinMemo },
      "checkin"
    );
    if (result) setMessage("今日の不安チェックインを保存しました。");
  }

  async function saveCalmWork() {
    const result = await postPlusFeature(
      "/api/plus/calm-work",
      { factText, imaginationText, messageText, decision },
      "calm"
    );
    if (result) setMessage("ミニワークを保存しました。");
  }

  async function rewriteLineText() {
    const result = await postPlusFeature(
      "/api/plus/line-rewrite",
      { originalText: lineText },
      "line"
    );
    if (result?.rewrite) {
      setLineRewrite(result.rewrite);
      setMessage("LINE文面を言い換えました。");
    }
  }

  async function saveWeeklyReflection() {
    const weekNumber = state ? Math.max(1, Math.min(4, Math.ceil(state.currentDay / 7))) : 1;
    const result = await postPlusFeature(
      "/api/plus/weekly-reflection",
      { weekNumber, didText: weekDid, changedText: weekChanged, nextText: weekNext },
      "weekly"
    );
    if (result) setMessage("週次振り返りを保存しました。");
  }

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      window.setTimeout(() => setIsLoading(false), 0);
      return;
    }

    let mounted = true;
    supabase.auth.getUser().then(async ({ data }) => {
      if (!mounted) return;
      setUser(data.user);
      if (data.user) await loadPlusState();
      else setIsLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) loadPlusState();
      else {
        setState(null);
        setIsLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const result = state?.diagnosisResult ?? null;
  const anxietyLabel = result ? anxietyTypeLabels[result.anxietyType] : null;
  const partnerLabel = result ? partnerExpressionTypeLabels[result.partnerExpressionType] : null;
  const isWeeklyReflectionDay = state ? [7, 14, 21, 28, 30].includes(state.currentDay) : false;

  return (
    <MobileShell>
      <AppHeader showBack backHref="/" title="Kimochi Note Plus" showMenu />

      <section className="flex flex-col gap-5">
        <Card className="bg-[#fffafa]">
          <p className="text-sm font-bold text-kimochi-primary">月額980円</p>
          <h1 className="mt-2 text-2xl font-bold leading-snug">30日間、気持ちを整える伴走プラン</h1>
          <p className="mt-3 text-sm leading-loose text-kimochi-muted">
            今日の不安チェックイン、30日アクション、ミニワーク、週次振り返り、LINE文面の言い換えで、
            彼の気持ちを決めつけずに自分の不安を整理していきます。
          </p>
          <p className="mt-3 rounded-2xl bg-kimochi-primary-soft p-4 text-sm font-bold leading-relaxed text-kimochi-primary-dark">
            7日間プランを購入していない方も、Plusから始められます。
          </p>
        </Card>

        {!user ? (
          <Card>
            <h2 className="text-xl font-bold">Plusをはじめるにはログインしてください</h2>
            <p className="mt-2 text-sm leading-relaxed text-kimochi-muted">
              購入状態や記録をメールアドレスに保存するため、メール認証後にPlusへ進めます。
            </p>
            <div className="mt-5">
              <AuthPanel
                embedded
                hideIntro
                successMessage="ログイン用メールを送信しました。メール内のリンクを開くとログインできます。"
                onAuthChange={setUser}
              />
            </div>
          </Card>
        ) : null}

        {isLoading ? (
          <Card>
            <p className="text-center font-bold text-kimochi-muted">Plusの状態を確認しています。</p>
          </Card>
        ) : null}

        {message ? (
          <Card className="border border-amber-200 bg-kimochi-warning-bg">
            <p className="text-sm font-bold leading-relaxed text-amber-700">{message}</p>
          </Card>
        ) : null}

        {user && state && !state.hasPlus ? (
          <Card>
            <p className="text-sm font-bold text-kimochi-primary">Plusに加入する</p>
            <h2 className="mt-2 text-xl font-bold">
              {state.sevenDay.hasSevenDayPurchase
                ? "7日間の続きとして、30日間の伴走へ"
                : "PlusをDay1から始める"}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-kimochi-muted">
              {state.sevenDay.hasSevenDayPurchase
                ? "7日間プランで入力した診断結果と記録はそのまま残ります。Plusでは続きの行動を30日間のペースで確認できます。"
                : "診断結果に合わせて、30日間のアクションをDay1から進められます。"}
            </p>

            {!result ? (
              <div className="mt-5 space-y-3">
                <p className="text-sm font-bold leading-relaxed text-kimochi-primary-dark">
                  Plusは診断結果に合わせて内容を作ります。まず診断を完了してください。
                </p>
                <PrimaryButton href="/diagnosis/start">診断をはじめる</PrimaryButton>
              </div>
            ) : (
              <div className="mt-5">
                <PlusCheckoutButton>Kimochi Note Plusに加入する</PlusCheckoutButton>
              </div>
            )}
          </Card>
        ) : null}

        {user && state?.hasPlus ? (
          <>
            <Card className="order-[10] border border-emerald-100 bg-emerald-50">
              <p className="text-sm font-bold text-emerald-700">Plus加入中</p>
              <h2 className="mt-2 text-2xl font-bold">Day {state.currentDay} / 30</h2>
              <div className="mt-3">
                <ProgressBar value={state.currentDay} max={30} />
              </div>
              <p className="mt-3 text-sm leading-relaxed text-emerald-800">
                {state.subscription?.source === "transition_from_7day"
                  ? "7日間プランの記録を残したまま、Plusの伴走を続けられます。"
                  : "PlusをDay1から進めています。"}
              </p>
              <div className="mt-4 rounded-2xl bg-white/70 p-4">
                <p className="text-xs font-bold tracking-[0.18em] text-kimochi-primary">TODAY SESSION</p>
                <p className="mt-1 text-sm font-bold leading-relaxed text-emerald-900">
                  チェックイン → 今日のアクション → LINE文面 → ミニワーク → 気づき保存の順に、今日必要なところだけ使えます。
                </p>
              </div>
            </Card>

            {result ? (
              <Card className="order-[15]">
                <p className="text-sm font-bold text-kimochi-primary">あなたに合わせたPlus</p>
                <h2 className="mt-2 text-xl font-bold">{anxietyLabel}</h2>
                <p className="mt-2 text-sm leading-relaxed text-kimochi-muted">相手の愛情表現タイプ: {partnerLabel}</p>
              </Card>
            ) : (
              <Card className="order-[15]">
                <h2 className="text-xl font-bold">診断結果を追加しましょう</h2>
                <p className="mt-2 text-sm leading-relaxed text-kimochi-muted">
                  診断を完了すると、Plusの内容をあなたの悩みに合わせて表示できます。
                </p>
                <div className="mt-5">
                  <PrimaryButton href="/diagnosis/start">診断をはじめる</PrimaryButton>
                </div>
              </Card>
            )}

            <Card className="order-[30]">
              <p className="text-sm font-bold text-kimochi-primary">今日の30日アクション</p>
              <h2 className="mt-2 text-xl font-bold">Day {state.currentAction.day}: {state.currentAction.title}</h2>
              <p className="mt-3 text-sm leading-loose text-kimochi-muted">{state.currentAction.action}</p>
              <label className="mt-5 block text-sm font-bold text-kimochi-primary-dark" htmlFor="plus-insight">
                気づき保存
              </label>
              <textarea
                id="plus-insight"
                value={insight}
                onChange={(event) => setInsight(event.target.value.slice(0, 240))}
                maxLength={240}
                className="mt-2 min-h-28 w-full resize-none rounded-2xl border border-kimochi-border bg-white px-4 py-3 text-sm leading-relaxed outline-none focus:border-kimochi-primary"
                placeholder="小さく気づいたことや、やってみて感じたことを書いてください。"
              />
              <div className="mt-2 flex items-center justify-between text-xs text-kimochi-muted">
                <span>{state.plusActionLogs?.[String(state.currentDay)]?.completed ? "記録済み" : "未記録"}</span>
                <span>{insight.length} / 240</span>
              </div>
              <div className="mt-4">
                <PrimaryButton onClick={saveCurrentActionLog} disabled={isSavingLog}>
                  {isSavingLog ? "保存しています..." : "今日の一歩を保存する"}
                </PrimaryButton>
              </div>
            </Card>

            <Card className="order-[20]">
              <p className="text-sm font-bold text-kimochi-primary">今日の不安チェックイン</p>
              <h3 className="mt-2 text-lg font-bold">今の不安を1〜5で記録する</h3>
              <div className="mt-4">
                <input
                  type="range"
                  min={1}
                  max={5}
                  value={anxietyLevel}
                  onChange={(event) => setAnxietyLevel(Number(event.target.value))}
                  className="w-full accent-kimochi-primary"
                />
                <p className="mt-1 text-center text-sm font-bold text-kimochi-primary-dark">不安レベル {anxietyLevel}</p>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2">
                {checkinTopics.map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => toggleTopic(value)}
                    className={`rounded-full border px-3 py-2 text-xs font-bold ${
                      topics.includes(value)
                        ? "border-kimochi-primary bg-kimochi-primary-soft text-kimochi-primary-dark"
                        : "border-kimochi-border bg-white text-kimochi-muted"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <textarea
                value={checkinMemo}
                onChange={(event) => setCheckinMemo(event.target.value.slice(0, 240))}
                maxLength={240}
                className="mt-4 min-h-24 w-full resize-none rounded-2xl border border-kimochi-border bg-white px-4 py-3 text-sm leading-relaxed outline-none focus:border-kimochi-primary"
                placeholder="今いちばん気になっていることを短く書いてください。"
              />
              <div className="mt-4">
                <PrimaryButton onClick={saveCheckin} disabled={workingAction === "checkin"}>
                  {workingAction === "checkin" ? "保存しています..." : "チェックインを保存する"}
                </PrimaryButton>
              </div>
            </Card>

            <Card className="order-[50]">
              <p className="text-sm font-bold text-kimochi-primary">ミニワーク</p>
              <h3 className="mt-2 text-lg font-bold">事実と想像を分ける</h3>
              {[
                ["事実", factText, setFactText, "実際に起きたことだけを書いてください。"],
                ["想像", imaginationText, setImaginationText, "頭の中でふくらんでいる想像を書いてください。"],
                ["本当は伝えたいこと", messageText, setMessageText, "責めずに伝えたい気持ちを書いてください。"],
                ["今日の決めごと", decision, setDecision, "送る・待つ・休むなど、小さな決めごとを書いてください。"],
              ].map(([label, value, setter, placeholder]) => (
                <label key={label as string} className="mt-4 block text-sm font-bold text-kimochi-primary-dark">
                  {label as string}
                  <textarea
                    value={value as string}
                    onChange={(event) => (setter as (value: string) => void)(event.target.value.slice(0, 240))}
                    maxLength={240}
                    className="mt-2 min-h-20 w-full resize-none rounded-2xl border border-kimochi-border bg-white px-4 py-3 text-sm leading-relaxed outline-none focus:border-kimochi-primary"
                    placeholder={placeholder as string}
                  />
                </label>
              ))}
              <div className="mt-4">
                <PrimaryButton onClick={saveCalmWork} disabled={workingAction === "calm"}>
                  {workingAction === "calm" ? "保存しています..." : "ミニワークを保存する"}
                </PrimaryButton>
              </div>
            </Card>

            <Card className="order-[40]">
              <p className="text-sm font-bold text-kimochi-primary">LINE文面言い換え</p>
              <h3 className="mt-2 text-lg font-bold">重くなりすぎない言い方に整える</h3>
              <textarea
                value={lineText}
                onChange={(event) => setLineText(event.target.value.slice(0, 240))}
                maxLength={240}
                className="mt-4 min-h-24 w-full resize-none rounded-2xl border border-kimochi-border bg-white px-4 py-3 text-sm leading-relaxed outline-none focus:border-kimochi-primary"
                placeholder="送りたいLINE文面を入れてください。"
              />
              <div className="mt-4">
                <PrimaryButton onClick={rewriteLineText} disabled={workingAction === "line" || !lineText.trim()}>
                  {workingAction === "line" ? "言い換えています..." : "文面を言い換える"}
                </PrimaryButton>
              </div>
              {lineRewrite ? (
                <div className="mt-4 space-y-3">
                  {[
                    ["やわらかめ", lineRewrite.soft],
                    ["正直に伝える", lineRewrite.honest],
                    ["今日は置いておく", lineRewrite.hold],
                  ].map(([label, text]) => (
                    <div key={label} className="rounded-2xl border border-kimochi-border bg-kimochi-bg p-4">
                      <p className="text-xs font-bold text-kimochi-primary">{label}</p>
                      <p className="mt-2 text-sm leading-relaxed">{text}</p>
                    </div>
                  ))}
                </div>
              ) : null}
            </Card>

            <Card className={isWeeklyReflectionDay ? "order-[60] border border-kimochi-primary/30 bg-[#fffafa]" : "order-[60] bg-white/80"}>
              <p className="text-sm font-bold text-kimochi-primary">週次振り返り</p>
              <h3 className="mt-2 text-lg font-bold">
                {isWeeklyReflectionDay ? "今週できたことを見返す" : "週末に使う振り返り"}
              </h3>
              {!isWeeklyReflectionDay ? (
                <p className="mt-2 text-sm leading-relaxed text-kimochi-muted">
                  Day 7 / 14 / 21 / 28 の近くで、1週間をゆっくり振り返るための場所です。必要なときだけ使えます。
                </p>
              ) : null}
              {[
                ["できたこと", weekDid, setWeekDid, "小さくできたことを書いてください。"],
                ["変化したこと", weekChanged, setWeekChanged, "気持ちや行動の変化を書いてください。"],
                ["来週の一歩", weekNext, setWeekNext, "来週試したい小さな一歩を書いてください。"],
              ].map(([label, value, setter, placeholder]) => (
                <label key={label as string} className="mt-4 block text-sm font-bold text-kimochi-primary-dark">
                  {label as string}
                  <textarea
                    value={value as string}
                    onChange={(event) => (setter as (value: string) => void)(event.target.value.slice(0, 240))}
                    maxLength={240}
                    className="mt-2 min-h-20 w-full resize-none rounded-2xl border border-kimochi-border bg-white px-4 py-3 text-sm leading-relaxed outline-none focus:border-kimochi-primary"
                    placeholder={placeholder as string}
                  />
                </label>
              ))}
              <div className="mt-4">
                <PrimaryButton onClick={saveWeeklyReflection} disabled={workingAction === "weekly"}>
                  {workingAction === "weekly" ? "保存しています..." : "週次振り返りを保存する"}
                </PrimaryButton>
              </div>
            </Card>

            <div className="order-[70] space-y-3">
              {state.sevenDay.hasSevenDayPurchase ? (
                <SecondaryButton href="/plan/7days">7日間プランの記録を見る</SecondaryButton>
              ) : null}
              <SecondaryButton href="/mypage">マイページへ</SecondaryButton>
            </div>
          </>
        ) : null}
      </section>
    </MobileShell>
  );
}

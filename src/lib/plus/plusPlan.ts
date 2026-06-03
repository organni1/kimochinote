export type PlusAction = {
  day: number;
  title: string;
  action: string;
};

const plusThemes = [
  "不安を言葉にする",
  "事実と想像を分ける",
  "LINEを送る前に整える",
  "重くならない伝え方を考える",
  "返信が遅いときの過ごし方",
  "彼の行動に目を向ける",
  "1週間の振り返り",
  "自分ばかり好きだと感じる理由",
  "好きと言ってくれない不安",
  "会う頻度への不安",
  "寂しさを責めずに伝える",
  "追いLINEしたくなったとき",
  "彼との温度差を整理する",
  "2週間の振り返り",
  "自分の期待を書き出す",
  "彼に求めている安心を知る",
  "自分時間を取り戻す",
  "不安な夜の過ごし方",
  "会えない日の安心材料",
  "相手のペースを見直す",
  "3週間の振り返り",
  "伝えることと我慢することを分ける",
  "喧嘩後の距離感を整える",
  "彼に確認したいことを整理する",
  "送る前に一晩置く練習",
  "自分を責めないノート",
  "うれしかった行動を記録する",
  "4週間の振り返り",
  "これからの関係で大切にしたいこと",
  "30日間のまとめ",
];

export const plusActions: PlusAction[] = plusThemes.map((title, index) => ({
  day: index + 1,
  title,
  action: buildPlusAction(title, index + 1),
}));

export function getPlusAction(day: number) {
  return plusActions[Math.max(1, Math.min(30, day)) - 1];
}

export function calculatePlusDay(startedAt?: string | null, startDay = 1) {
  if (!startedAt) return Math.max(1, Math.min(30, startDay));
  const started = new Date(startedAt);
  if (Number.isNaN(started.getTime())) return Math.max(1, Math.min(30, startDay));

  const now = new Date();
  const elapsedDays = Math.max(0, Math.floor((startOfDay(now).getTime() - startOfDay(started).getTime()) / 86400000));
  return Math.max(1, Math.min(30, startDay + elapsedDays));
}

function buildPlusAction(title: string, day: number) {
  if ([7, 14, 21, 28, 30].includes(day)) {
    return "今週の気持ち、できた行動、まだ不安なことを分けて書き出してみましょう。";
  }

  return `今日は「${title}」をテーマに、彼に答えを急がせる前に自分の気持ちを1つ整理してみましょう。`;
}

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

import type { AnxietyType, PartnerExpressionType } from "@/types/diagnosis";

export const anxietyTypeLabels: Record<AnxietyType, string> = {
  word_reassurance: "言葉で安心したいタイプ",
  contact_anxiety: "連絡頻度で不安になりやすいタイプ",
  abandonment_anxiety: "見捨てられ不安タイプ",
  future_anxiety: "将来不安タイプ",
  mismatch_anxiety: "愛情表現すれ違いタイプ",
};

export const partnerExpressionTypeLabels: Record<PartnerExpressionType, string> = {
  words: "言葉で伝えるタイプ",
  actions: "行動で示すタイプ",
  time: "一緒に過ごす時間重視タイプ",
  support: "サポート重視タイプ",
  freedom: "自由尊重タイプ",
  future: "将来設計重視タイプ",
};

export const anxietyDescriptions: Record<AnxietyType, string> = {
  word_reassurance: "あなたは、相手からの言葉によって安心感を得やすいタイプです。「好き」「大切に思っている」などの言葉が少ないと、実際には関係が悪くなっていなくても、不安が強くなりやすい傾向があります。",
  contact_anxiety: "あなたは、連絡頻度や返信の早さから相手の気持ちを感じ取りやすいタイプです。返信が遅い時に、つい不安が大きくなりやすい傾向があります。",
  abandonment_anxiety: "あなたは、相手の少しの変化に敏感で、嫌われたのではないかと考えやすいタイプです。不安を感じた時は、事実と想像を分けることが大切です。",
  future_anxiety: "あなたは、将来の見通しが見えない時に不安を感じやすいタイプです。いきなり大きな答えを求めるより、小さな会話から始めることが大切です。",
  mismatch_anxiety: "あなたは、相手の愛情表現と自分が求める愛情表現の違いから不安を感じやすいタイプです。まずは、相手がどんな形で気持ちを示しているかを整理してみましょう。",
};

export const partnerExpressionDescriptions: Record<PartnerExpressionType, string> = {
  words: "彼は、言葉で気持ちを伝えることを大切にするタイプの可能性があります。気持ちを言葉にすることで安心感を共有しやすい傾向があります。",
  actions: "彼は、言葉よりも行動や態度で愛情を伝えることを大切にするタイプの可能性があります。手伝う、予定を合わせる、気にかけるなどに気持ちが表れやすいかもしれません。",
  time: "彼は、一緒に過ごす時間を通じて愛情を示すタイプの可能性があります。頻繁な言葉より、会っている時間や共有する体験を大切にする傾向があります。",
  support: "彼は、あなたを支える行動で愛情を示すタイプの可能性があります。困った時に助ける、生活面で支えるなどが愛情表現になりやすいかもしれません。",
  freedom: "彼は、お互いの自由や距離感を尊重することで関係を大切にするタイプの可能性があります。束縛しないことを信頼の表現と考えている場合があります。",
  future: "彼は、将来の予定や生活の話を通じて関係を大切にするタイプの可能性があります。具体的な計画に気持ちが表れやすいかもしれません。",
};

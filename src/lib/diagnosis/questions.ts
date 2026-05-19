import type {
  AnxietyType,
  DiagnosisQuestion,
  PartnerExpressionType,
} from "@/types/diagnosis";

export const selfQuestions: DiagnosisQuestion<AnxietyType>[] = [
  { id: "self_01", order: 1, section: "self", text: "彼が「好き」と言ってくれないと不安になる", targetType: "word_reassurance" },
  { id: "self_02", order: 2, section: "self", text: "LINEの返信が遅いと、冷められたのではと思う", targetType: "contact_anxiety" },
  { id: "self_03", order: 3, section: "self", text: "少し態度が変わると、嫌われたのではと考えてしまう", targetType: "abandonment_anxiety" },
  { id: "self_04", order: 4, section: "self", text: "彼が将来の話をしないと不安になる", targetType: "future_anxiety" },
  { id: "self_05", order: 5, section: "self", text: "彼は優しいのに、なぜか愛されている実感が少ない", targetType: "mismatch_anxiety" },
  { id: "self_06", order: 6, section: "self", text: "自分ばかり好きな気がすることがある", targetType: "abandonment_anxiety" },
  { id: "self_07", order: 7, section: "self", text: "もっと言葉で愛情を伝えてほしいと思う", targetType: "word_reassurance" },
  { id: "self_08", order: 8, section: "self", text: "連絡頻度が減ると関係が悪くなった気がする", targetType: "contact_anxiety" },
  { id: "self_09", order: 9, section: "self", text: "結婚や同棲の話を避けられると不安になる", targetType: "future_anxiety" },
  { id: "self_10", order: 10, section: "self", text: "彼の愛情表現と自分が求めているものが違う気がする", targetType: "mismatch_anxiety" },
];

export const partnerQuestions: DiagnosisQuestion<PartnerExpressionType>[] = [
  { id: "partner_01", order: 11, section: "partner", text: "彼は「好き」「かわいい」などを言葉で伝えてくれる", targetType: "words" },
  { id: "partner_02", order: 12, section: "partner", text: "彼は困った時に助けてくれる", targetType: "actions" },
  { id: "partner_03", order: 13, section: "partner", text: "彼は一緒に過ごす時間を大切にしてくれる", targetType: "time" },
  { id: "partner_04", order: 14, section: "partner", text: "彼は仕事や生活面で支えてくれる", targetType: "support" },
  { id: "partner_05", order: 15, section: "partner", text: "彼はお互いの自由な時間を尊重する", targetType: "freedom" },
  { id: "partner_06", order: 16, section: "partner", text: "彼は将来の予定や生活について話してくれる", targetType: "future" },
  { id: "partner_07", order: 17, section: "partner", text: "彼は言葉は少ないけれど、行動で気にかけてくれることがある", targetType: "actions" },
  { id: "partner_08", order: 18, section: "partner", text: "彼はあなたの予定や気持ちに合わせようとしてくれる", targetType: "support" },
  { id: "partner_09", order: 19, section: "partner", text: "彼は頻繁に連絡するより、会った時の時間を大切にする", targetType: "time" },
  { id: "partner_10", order: 20, section: "partner", text: "彼は束縛せず、信頼して任せることが多い", targetType: "freedom" },
];

export const answerOptions = [
  { label: "まったく当てはまらない", score: 1 },
  { label: "あまり当てはまらない", score: 2 },
  { label: "どちらとも言えない", score: 3 },
  { label: "やや当てはまる", score: 4 },
  { label: "とても当てはまる", score: 5 },
] as const;

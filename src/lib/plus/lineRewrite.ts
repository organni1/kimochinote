function normalizeText(text: string) {
  return text.replace(/\s+/g, " ").trim().slice(0, 240);
}

export function buildLineRewrite(originalText: string) {
  const text = normalizeText(originalText);
  const base = text || "少し不安になっていた";

  return {
    soft: `今ちょっとだけ${base}気持ちがあって。責めたいわけじゃなくて、落ち着いて話せたらうれしいな。`,
    honest: `${base}って感じていたよ。あなたを責めたいわけではなくて、自分の気持ちをちゃんと伝えておきたかった。`,
    hold: `今は少し気持ちを整理しているところ。また落ち着いたら、ちゃんと話せたらうれしい。`,
  };
}

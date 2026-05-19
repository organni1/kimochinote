"use client";

import { useState } from "react";

export function FreeTextConcernForm({ defaultValue = "", onSubmit }: { defaultValue?: string; onSubmit: (value: string) => void }) {
  const [value, setValue] = useState(defaultValue);
  return (
    <div className="space-y-5">
      <div className="rounded-[24px] bg-white p-4 soft-shadow">
        <textarea
          value={value}
          maxLength={300}
          onChange={(event) => setValue(event.target.value)}
          placeholder={"例：\n最近、彼の返信が遅くて不安です。\n前より好きと言ってくれなくなった気がして、\n自分ばかり好きなのかなと思ってしまいます。"}
          className="min-h-72 w-full resize-none bg-transparent text-lg leading-relaxed outline-none placeholder:text-kimochi-muted/70"
        />
        <p className="text-right text-sm text-kimochi-muted">最大300文字</p>
      </div>
      <p className="text-sm text-kimochi-muted">♡ 入力は任意です。あとから書き直すこともできます。</p>
      <button type="button" onClick={() => onSubmit(value)} className="inline-flex min-h-14 w-full items-center justify-center rounded-full bg-gradient-to-r from-[#ff6f73] to-kimochi-primary px-6 text-lg font-bold text-white shadow-[0_10px_20px_rgba(239,125,125,0.28)]">
        診断結果を見る
      </button>
      <button type="button" onClick={() => onSubmit("")} className="w-full text-center text-kimochi-primary underline underline-offset-4">
        今は書かずに結果を見る
      </button>
    </div>
  );
}

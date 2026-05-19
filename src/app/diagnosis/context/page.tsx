"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { AppHeader } from "@/components/layout/AppHeader";
import { MobileShell } from "@/components/layout/MobileShell";
import { FreeTextConcernForm } from "@/components/diagnosis/FreeTextConcernForm";
import { readFreeTextConcern, saveFreeTextConcern } from "@/lib/storage/diagnosisStorage";

export default function DiagnosisContextPage() {
  const router = useRouter();
  function submit(value: string) {
    saveFreeTextConcern(value.trim());
    router.push("/diagnosis/loading");
  }
  return (
    <MobileShell>
      <AppHeader showBack backHref="/diagnosis/partner" />
      <Image src="/assets/illustrations/illustration-writing-concern.png" alt="" width={190} height={180} className="mx-auto h-32 w-auto object-contain opacity-90" />
      <h1 className="mt-4 text-center text-3xl font-bold leading-relaxed">最後に、<br />今いちばん悩んでいることを<br />教えてください</h1>
      <p className="my-5 text-center leading-loose text-kimochi-muted">書ける範囲で大丈夫です。あなたの診断結果とあわせて、今日取るべき行動を提案します。</p>
      <FreeTextConcernForm defaultValue={readFreeTextConcern()} onSubmit={submit} />
    </MobileShell>
  );
}

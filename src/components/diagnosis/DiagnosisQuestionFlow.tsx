"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AppHeader } from "@/components/layout/AppHeader";
import { MobileShell } from "@/components/layout/MobileShell";
import { AnswerOption } from "@/components/diagnosis/AnswerOption";
import { DiagnosisProgress } from "@/components/diagnosis/DiagnosisProgress";
import { QuestionCard } from "@/components/diagnosis/QuestionCard";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { SecondaryButton } from "@/components/ui/SecondaryButton";
import { answerOptions, partnerQuestions, selfQuestions } from "@/lib/diagnosis/questions";
import { saveAnswers, STORAGE_KEYS } from "@/lib/storage/diagnosisStorage";
import type { DiagnosisAnswer } from "@/types/diagnosis";

export function DiagnosisQuestionFlow({ section }: { section: "self" | "partner" }) {
  const router = useRouter();
  const questions = section === "self" ? selfQuestions : partnerQuestions;
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<DiagnosisAnswer[]>([]);
  const question = questions[index];
  const currentAnswer = useMemo(() => answers.find((answer) => answer.questionId === question.id), [answers, question.id]);

  function select(score: DiagnosisAnswer["score"]) {
    setAnswers((prev) => {
      const rest = prev.filter((answer) => answer.questionId !== question.id);
      return [...rest, { questionId: question.id, score }];
    });
  }

  function next() {
    if (!currentAnswer) return;
    if (index < questions.length - 1) {
      setIndex((value) => value + 1);
      return;
    }
    saveAnswers(section === "self" ? STORAGE_KEYS.selfAnswers : STORAGE_KEYS.partnerAnswers, answers);
    router.push(section === "self" ? "/diagnosis/partner" : "/diagnosis/context");
  }

  function back() {
    if (index > 0) {
      setIndex((value) => value - 1);
      return;
    }
    router.push(section === "self" ? "/diagnosis/start" : "/diagnosis/self");
  }

  return (
    <MobileShell>
      <AppHeader title="診断" showBack backHref={section === "self" ? "/diagnosis/start" : "/diagnosis/self"} />
      <DiagnosisProgress current={question.order} />
      <p className="mt-8 text-center text-lg font-bold">
        {section === "self" ? "あなたについて教えてください" : "彼について教えてください"}
      </p>
      <QuestionCard text={question.text} />
      {section === "partner" ? <p className="mb-4 text-center text-sm leading-relaxed text-kimochi-muted">分からない場合は「どちらとも言えない」を選んでください。</p> : null}
      <div className="space-y-3">
        {answerOptions.map((option) => (
          <AnswerOption key={option.score} label={option.label} score={option.score} selected={currentAnswer?.score === option.score} onSelect={select} />
        ))}
      </div>
      <p className="my-6 text-center text-sm text-kimochi-muted">♡ 直感で選んでください</p>
      <div className="grid grid-cols-2 gap-4 pb-4">
        <SecondaryButton onClick={back}>戻る</SecondaryButton>
        <PrimaryButton onClick={next} disabled={!currentAnswer}>次へ</PrimaryButton>
      </div>
    </MobileShell>
  );
}

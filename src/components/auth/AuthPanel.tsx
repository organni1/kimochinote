"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { Card } from "@/components/ui/Card";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { getSupabaseBrowserClient, isSupabaseBrowserConfigured } from "@/lib/supabase/client";

export type AuthPanelHandle = {
  focusEmail: () => void;
};

export const AuthPanel = forwardRef<AuthPanelHandle, {
  onAuthChange?: (user: User | null) => void;
  onEmailChange?: (email: string) => void;
  notice?: string;
  highlight?: boolean;
  title?: string;
  description?: string;
  successMessage?: string;
  embedded?: boolean;
  hideIntro?: boolean;
}>(function AuthPanel({
  onAuthChange,
  onEmailChange,
  notice,
  highlight = false,
  title = "購入前にメール認証をお願いします",
  description = "購入済み状態を別の端末でも復元できるよう、メールアドレスに購入情報を紐づけます。",
  successMessage = "ログイン用メールを送信しました。メール内のリンクを開くと購入に進めます。",
  embedded = false,
  hideIntro = false,
}, ref) {
  const [email, setEmail] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [hasSent, setHasSent] = useState(false);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const configured = isSupabaseBrowserConfigured();

  useImperativeHandle(ref, () => ({
    focusEmail() {
      emailInputRef.current?.focus();
    },
  }), []);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;

    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      onAuthChange?.(data.user);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      onAuthChange?.(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [onAuthChange]);

  async function sendMagicLink() {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      setMessage("メール認証の設定がまだ完了していません。");
      return;
    }

    setIsSending(true);
    setMessage("");

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    setIsSending(false);

    if (error) {
      setMessage("メールを送信できませんでした。メールアドレスと認証設定を確認してください。");
      return;
    }

    setHasSent(true);
    setMessage(successMessage);
  }

  if (!configured) {
    const content = (
      <>
        <p className="font-bold text-amber-700">メール認証の設定が必要です</p>
        <p className="mt-2 text-sm leading-relaxed text-kimochi-muted">
          購入情報をアカウントに保存するには、メール認証の設定が必要です。
        </p>
      </>
    );

    return embedded ? (
      <div className="border border-amber-200 bg-kimochi-warning-bg">{content}</div>
    ) : (
      <Card className="border border-amber-200 bg-kimochi-warning-bg">{content}</Card>
    );
  }

  if (user) {
    const content = (
      <>
        <p className="font-bold text-emerald-700">ログイン中です</p>
        <p className="mt-1 text-sm leading-relaxed text-emerald-700">{user.email}</p>
      </>
    );

    return embedded ? (
      <div className="border border-emerald-100 bg-emerald-50">{content}</div>
    ) : (
      <Card className="border border-emerald-100 bg-emerald-50">{content}</Card>
    );
  }

  const formClassName = `space-y-4 ${highlight ? "border-2 border-kimochi-primary bg-[#fffafa]" : ""}`;
  const formContent = (
    <>
      {!hideIntro ? (
        <div>
          <p className="font-bold text-kimochi-primary">{title}</p>
          <p className="mt-2 text-sm leading-relaxed text-kimochi-muted">
            {description}
          </p>
        </div>
      ) : null}

      {notice ? (
        <div className="rounded-2xl bg-kimochi-primary-soft p-4 text-sm font-bold leading-relaxed text-kimochi-primary-dark">
          {notice}
        </div>
      ) : null}

      <input
        ref={emailInputRef}
        type="email"
        value={email}
        onChange={(event) => {
          setEmail(event.target.value);
          onEmailChange?.(event.target.value);
        }}
        placeholder="mail@example.com"
        className="min-h-14 w-full rounded-2xl border border-kimochi-border bg-white px-4 outline-none focus:border-kimochi-primary"
      />

      <PrimaryButton onClick={sendMagicLink} disabled={isSending || !email.trim()}>
        {isSending ? "メールを送信しています..." : hasSent ? "ログイン用メールを再送する" : "ログイン用メールを送る"}
      </PrimaryButton>

      {message ? <p className="text-sm leading-relaxed text-kimochi-muted">{message}</p> : null}

      {hasSent ? (
        <div className="rounded-2xl border border-kimochi-border bg-kimochi-bg p-4 text-sm leading-relaxed text-kimochi-muted">
          <p className="font-bold text-kimochi-text">メールが届かない場合</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>入力したメールアドレスに間違いがないか確認してください。</li>
            <li>迷惑メール、プロモーション、すべてのメールを確認してください。</li>
            <li>数分待っても届かない場合は、もう一度送信してください。</li>
            <li>それでも届かない場合は、運営者にお問い合わせください。</li>
          </ul>
        </div>
      ) : null}
    </>
  );

  return embedded ? (
    <div className={formClassName}>{formContent}</div>
  ) : (
    <Card className={formClassName}>{formContent}</Card>
  );
});

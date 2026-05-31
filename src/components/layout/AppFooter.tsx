import Link from "next/link";

export function AppFooter() {
  return (
    <footer className="mt-10 pb-4 text-center text-xs leading-relaxed text-kimochi-muted">
      <p>
        Kimochi Noteは、彼の気持ちを断定するものではありません。不安を整理し、今日できる小さな行動を提案するサービスです。
      </p>
      <p className="mt-1">Kimochi Note</p>
      <nav className="mt-4 flex flex-wrap justify-center gap-x-4 gap-y-2">
        <Link href="/legal/terms" className="underline underline-offset-4">
          利用規約
        </Link>
        <Link href="/legal/privacy" className="underline underline-offset-4">
          プライバシーポリシー
        </Link>
        <Link href="/legal/commercial-transactions" className="underline underline-offset-4">
          特定商取引法に基づく表記
        </Link>
      </nav>
    </footer>
  );
}

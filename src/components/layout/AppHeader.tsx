import Image from "next/image";
import Link from "next/link";

type AppHeaderProps = {
  title?: string;
  showBack?: boolean;
  backHref?: string;
  showMenu?: boolean;
  leftLinkLabel?: string;
  leftLinkHref?: string;
};

export function AppHeader({
  title = "Kimochi Note",
  showBack,
  backHref = "/",
  showMenu = false,
  leftLinkLabel,
  leftLinkHref = "/",
}: AppHeaderProps) {
  return (
    <header className="mb-6 flex h-12 items-center justify-between">
      <div className="flex w-24 justify-start">
        {leftLinkLabel ? (
          <Link
            href={leftLinkHref}
            className="flex min-h-10 items-center rounded-full text-sm font-bold text-kimochi-primary"
          >
            {leftLinkLabel}
          </Link>
        ) : showBack ? (
          <Link href={backHref} aria-label="戻る" className="flex h-10 w-10 items-center justify-center rounded-full">
            <Image src="/assets/icons/icon-arrow-back.png" alt="" width={22} height={22} className="h-6 w-6 object-contain" />
          </Link>
        ) : null}
      </div>
      <Link href="/" aria-label="トップページへ" className="flex min-w-0 flex-1 items-center justify-center px-2 text-center">
        <span className="truncate font-brand text-2xl tracking-normal text-kimochi-text">{title}</span>
      </Link>
      <div className="flex w-24 justify-end">
        {showMenu ? (
          <Link
            href="/mypage"
            aria-label="マイページ"
            className="flex min-h-10 items-center justify-center rounded-full px-2 text-sm font-bold text-kimochi-primary"
          >
            マイページ
          </Link>
        ) : null}
      </div>
    </header>
  );
}

import Image from "next/image";
import Link from "next/link";

type AppHeaderProps = {
  title?: string;
  showBack?: boolean;
  backHref?: string;
  showMenu?: boolean;
};

export function AppHeader({ title = "Kimochi Note", showBack, backHref = "/", showMenu = false }: AppHeaderProps) {
  return (
    <header className="mb-6 flex h-12 items-center justify-between">
      <div className="w-10">
        {showBack ? (
          <Link href={backHref} aria-label="戻る" className="flex h-10 w-10 items-center justify-center rounded-full">
            <Image src="/assets/icons/icon-arrow-back.png" alt="" width={22} height={22} className="h-6 w-6 object-contain" />
          </Link>
        ) : null}
      </div>
      <Link href="/" className="flex items-center gap-2">
        <Image src="/assets/icons/icon-note-heart.png" alt="" width={34} height={34} className="h-8 w-8 object-contain" />
        <span className="font-brand text-2xl tracking-normal text-kimochi-text">{title}</span>
      </Link>
      <div className="flex w-10 justify-end">
        {showMenu ? (
          <Link href="/mypage" aria-label="マイページ" className="flex h-10 w-10 items-center justify-center rounded-full">
            <Image src="/assets/icons/icon-menu.png" alt="" width={28} height={28} className="h-7 w-7 object-contain" />
          </Link>
        ) : null}
      </div>
    </header>
  );
}

import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  href?: string;
  children: ReactNode;
};

const classes = "inline-flex min-h-14 w-full items-center justify-center rounded-full border-2 border-kimochi-primary bg-white px-6 py-3 text-center text-lg font-bold text-kimochi-primary transition active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-45";

export function SecondaryButton({ href, children, className = "", ...props }: Props) {
  if (href) return <Link href={href} className={`${classes} ${className}`}>{children}</Link>;
  return <button className={`${classes} ${className}`} {...props}>{children}</button>;
}

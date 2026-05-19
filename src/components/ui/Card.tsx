import type { ReactNode } from "react";

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <section className={`rounded-[24px] border border-kimochi-border/70 bg-white p-5 soft-shadow ${className}`}>{children}</section>;
}

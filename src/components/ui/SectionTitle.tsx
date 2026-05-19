import type { ReactNode } from "react";

export function SectionTitle({ children, eyebrow }: { children: ReactNode; eyebrow?: string }) {
  return (
    <div className="mb-4 text-center">
      {eyebrow ? <p className="mb-2 text-sm font-bold text-kimochi-primary">{eyebrow}</p> : null}
      <h2 className="text-2xl font-bold leading-relaxed text-kimochi-text">{children}</h2>
      <div className="mx-auto mt-2 h-px w-28 bg-gradient-to-r from-transparent via-kimochi-primary to-transparent" />
    </div>
  );
}

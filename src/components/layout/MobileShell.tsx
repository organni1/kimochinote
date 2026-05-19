import type { ReactNode } from "react";

export function MobileShell({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-screen bg-kimochi-bg text-kimochi-text">
      <div className="mx-auto min-h-screen w-full max-w-[430px] overflow-hidden bg-kimochi-bg px-5 py-5 shadow-[0_0_60px_rgba(61,44,44,0.08)]">
        {children}
      </div>
    </main>
  );
}

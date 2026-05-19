import type { ReactNode } from "react";
import { AppFooter } from "@/components/layout/AppFooter";
import { AppHeader } from "@/components/layout/AppHeader";
import { MobileShell } from "@/components/layout/MobileShell";
import { Card } from "@/components/ui/Card";

export function LegalPage({
  title,
  lead,
  children,
}: {
  title: string;
  lead: string;
  children: ReactNode;
}) {
  return (
    <MobileShell>
      <AppHeader showBack backHref="/checkout/confirm" title="Kimochi Note" />
      <section className="mb-6 text-center">
        <p className="font-brand text-lg font-bold text-kimochi-primary">Kimochi Note</p>
        <h1 className="mt-2 text-3xl font-bold leading-relaxed">{title}</h1>
        <p className="mt-3 text-sm leading-loose text-kimochi-muted">{lead}</p>
      </section>
      <Card className="space-y-6 text-sm leading-loose">{children}</Card>
      <p className="mt-5 text-xs leading-relaxed text-kimochi-muted">
        このページの内容はMVP用の仮文面です。正式な販売開始前に、事業内容に合わせて専門家レビューを行ってください。
      </p>
      <AppFooter />
    </MobileShell>
  );
}

export function LegalSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section>
      <h2 className="mb-2 text-lg font-bold text-kimochi-primary">{title}</h2>
      <div className="space-y-2 text-kimochi-text">{children}</div>
    </section>
  );
}

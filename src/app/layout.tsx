import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "きもちノート | Kimochi Note",
  description: "恋愛不安タイプと彼の愛情表現タイプを診断し、今日の小さな行動を提案します。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className="h-full">
      <body className="min-h-full">{children}</body>
    </html>
  );
}

import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tribune Foot",
  description:
    "Toute l'actualité du football français, européen et international sur Tribune Foot.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
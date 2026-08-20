import type { Metadata } from "next";
import "./globals.css";
import VisitTracker from "@/components/VisitTracker";

const siteUrl = "https://www.tribunesport.fr";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  title: {
    default: "Tribune Foot",
    template: "%s | Tribune Foot",
  },

  description:
    "Toute l'actualité du football français, européen et international sur Tribune Foot.",

  applicationName: "Tribune Foot",

  keywords: [
    "football",
    "actualité football",
    "FC Metz",
    "Ligue 1",
    "football français",
    "mercato",
    "résultats football",
    "matchs football",
    "joueurs",
    "clubs",
  ],

  authors: [
    {
      name: "Tribune Foot",
      url: siteUrl,
    },
  ],

  creator: "Tribune Foot",
  publisher: "Tribune Foot",

  alternates: {
    canonical: siteUrl,
  },

  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: siteUrl,
    siteName: "Tribune Foot",
    title: "Tribune Foot",
    description:
      "Toute l'actualité du football français, européen et international.",
  },

  twitter: {
    card: "summary_large_image",
    title: "Tribune Foot",
    description:
      "Toute l'actualité du football français, européen et international.",
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  category: "sports",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body>
        <VisitTracker />
        {children}
      </body>
    </html>
  );
}
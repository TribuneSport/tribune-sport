import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://tribunesport.fr"),

  title: {
    default: "Tribune Foot",
    template: "%s | Tribune Foot",
  },

  description:
    "Toute l'actualité du football français et international : Ligue 1, Premier League, Liga, Serie A, Bundesliga, Ligue des Champions, Mercato, analyses et résultats.",

  keywords: [
    "football",
    "mercato",
    "ligue 1",
    "premier league",
    "liga",
    "serie a",
    "bundesliga",
    "champions league",
    "actualité football",
    "transferts",
    "Tribune Foot",
  ],

  authors: [
    {
      name: "Tribune Foot",
    },
  ],

  creator: "Tribune Foot",

  publisher: "Tribune Foot",

  alternates: {
    canonical: "/",
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

  verification: {
    google: "QkhHtTzzldlra_jyqVF7qc1aJ4M1YmIrqjdMLbbo3to",
  },

  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://tribunesport.fr",
    siteName: "Tribune Foot",
    title: "Tribune Foot",
    description:
      "Toute l'actualité du football en continu.",
    images: [
      {
        url: "/og.jpg",
        width: 1200,
        height: 630,
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Tribune Foot",
    description:
      "Toute l'actualité du football en continu.",
    images: ["/og.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className="bg-gray-100 text-gray-900">
        {children}
      </body>
    </html>
  );
}
import type { Metadata } from "next";
import "./globals.css";
import VisitTracker from "@/components/VisitTracker";

const siteUrl = "https://www.tribunesport.fr";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  title: {
    default: "Tribune Foot | Actualité football, Ligue 1 et mercato",
    template: "%s | Tribune Foot",
  },

  description:
    "Tribune Foot : toute l'actualité du football français, européen et international, Ligue 1, Ligue 2, mercato, clubs, joueurs et équipe de France.",

  applicationName: "Tribune Foot",

  keywords: [
    "football",
    "actualité football",
    "football français",
    "Ligue 1",
    "Ligue 2",
    "mercato",
    "transferts",
    "équipe de France",
    "FC Metz",
    "PSG",
    "OM",
    "Olympique Lyonnais",
    "Lens",
    "résultats football",
    "matchs football",
    "clubs de football",
    "joueurs de football",
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
    title:
      "Tribune Foot | Actualité football, Ligue 1 et mercato",
    description:
      "Toute l'actualité du football français, européen et international, le mercato, la Ligue 1, les clubs, les joueurs et l'équipe de France.",
  },

  twitter: {
    card: "summary_large_image",
    title:
      "Tribune Foot | Actualité football, Ligue 1 et mercato",
    description:
      "Toute l'actualité du football français, européen et international, le mercato, la Ligue 1, les clubs, les joueurs et l'équipe de France.",
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
  const websiteStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Tribune Foot",
    alternateName: [
      "Tribune Foot",
      "TribuneSport",
    ],
    url: siteUrl,
    inLanguage: "fr-FR",
    description:
      "Actualité du football français, européen et international, Ligue 1, Ligue 2, mercato, clubs, joueurs et équipe de France.",
  };

  const organizationStructuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Tribune Foot",
    url: siteUrl,
    logo: `${siteUrl}/football.jpg`,
  };

  return (
    <html lang="fr">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(
              websiteStructuredData
            ),
          }}
        />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(
              organizationStructuredData
            ),
          }}
        />

        <VisitTracker />

        {children}
      </body>
    </html>
  );
}
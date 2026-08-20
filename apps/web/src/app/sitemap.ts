import type { MetadataRoute } from "next";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";
export const revalidate = 3600;

const SITE_URL = "https://www.tribunesport.fr";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticUrls: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${SITE_URL}/articles`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/clubs`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];

  try {
    const [articles, clubs, players, competitions] =
      await Promise.all([
        db.article.findMany({
          where: {
            published: true,
          },
          select: {
            slug: true,
            updatedAt: true,
          },
        }),

        db.club.findMany({
          select: {
            slug: true,
          },
        }),

        db.player.findMany({
          select: {
            slug: true,
          },
        }),

        db.competition.findMany({
          select: {
            slug: true,
          },
        }),
      ]);

    return [
      ...staticUrls,

      ...articles.map((article) => ({
        url: `${SITE_URL}/article/${article.slug}`,
        lastModified: article.updatedAt,
        changeFrequency: "weekly" as const,
        priority: 0.8,
      })),

      ...clubs.map((club) => ({
        url: `${SITE_URL}/clubs/${club.slug}`,
        lastModified: now,
        changeFrequency: "weekly" as const,
        priority: 0.7,
      })),

      ...players.map((player) => ({
        url: `${SITE_URL}/players/${player.slug}`,
        lastModified: now,
        changeFrequency: "weekly" as const,
        priority: 0.6,
      })),

      ...competitions.map((competition) => ({
        url: `${SITE_URL}/competitions/${competition.slug}`,
        lastModified: now,
        changeFrequency: "weekly" as const,
        priority: 0.6,
      })),
    ];
  } catch (error) {
    console.error("Sitemap database error:", error);

    // Le sitemap principal reste disponible même si la base
    // est temporairement indisponible.
    return staticUrls;
  }
}
import { MetadataRoute } from "next";
import { db } from "@/lib/db";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const articles = await db.article.findMany({
    where: {
      published: true,
    },
    select: {
      slug: true,
      updatedAt: true,
    },
  });

  return [
    {
      url: "https://tribunesport.fr",
      lastModified: new Date(),
    },

    ...articles.map((article) => ({
      url: `https://tribunesport.fr/article/${article.slug}`,
      lastModified: article.updatedAt,
    })),
  ];
}
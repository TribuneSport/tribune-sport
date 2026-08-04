import { prisma } from "@/lib/prisma";
import { RSSService } from "./rss.service";
import { normalizeCategory } from "@/lib/categories";
import { createSlug } from "@/lib/slug";

export class RSSImportService {
  async import() {
    const rss = new RSSService();

    const articles = await rss.getSources();

    let imported = 0;

    for (const article of articles) {
      if (!article.link) continue;

      const existing = await prisma.article.findUnique({
        where: {
          sourceUrl: article.link,
        },
      });

      if (existing) continue;

      const title = article.title?.trim() || "Sans titre";

      const summary =
        article.description?.trim() ||
        "Aucun résumé disponible.";

      let slug = createSlug(title);

      let i = 2;

      while (
        await prisma.article.findUnique({
          where: { slug },
        })
      ) {
        slug = `${createSlug(title)}-${i}`;
        i++;
      }

      await prisma.article.create({
        data: {
          title,

          summary,

          content: summary,

          category: normalizeCategory(article.club),

          image: "",

          sourceUrl: article.link,

          published: false,

          seoTitle: title,

          seoDescription: summary.substring(0, 160),

          slug,
        },
      });

      imported++;
    }

    return imported;
  }
}
import { prisma } from "@/lib/prisma";
import { RSSService } from "./rss.service";

export class RSSImportService {
  async import() {
    const rss = new RSSService();

    const articles = await rss.getSources();

    let imported = 0;

    for (const article of articles) {
      const exists = await prisma.article.findUnique({
        where: {
          sourceUrl: article.link,
        },
      });

      if (exists) continue;

      await prisma.article.create({
        data: {
          title: article.title,
          summary: article.description,
          content: article.description,
          category: article.club,
          image: "",
          sourceUrl: article.link,
          published: false,
        },
      });

      imported++;
    }

    return imported;
  }
}
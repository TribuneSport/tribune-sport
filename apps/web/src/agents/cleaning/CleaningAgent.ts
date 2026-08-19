import { db } from "@/lib/db";

export class CleaningAgent {
  async execute(): Promise<number> {
    const articles = await db.article.findMany({
      where: {
        published: false,
        aiRewritten: false,
      },
    });

    let total = 0;

    for (const article of articles) {
      const cleanTitle = article.title
        .replace(/\s+/g, " ")
        .trim();

      const cleanSummary = article.summary
        .replace(/<[^>]*>/g, " ")
        .replace(/\s+/g, " ")
        .trim();

      const cleanContent = article.content
        .trim();

      await db.article.update({
        where: {
          id: article.id,
        },
        data: {
          title: cleanTitle,
          summary: cleanSummary,
          content: cleanContent,
        },
      });

      total++;
    }

    return total;
  }
}
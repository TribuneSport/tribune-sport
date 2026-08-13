import { db } from "@/lib/db";

export class CleaningAgent {

  async execute(): Promise<number> {

    const articles = await db.article.findMany({
      where: {
        published: false,
      },
    });

    let total = 0;

    for (const article of articles) {

      const cleanContent = article.content
        .replace(/<[^>]*>/g, " ")
        .replace(/\s+/g, " ")
        .trim();

      await db.article.update({
        where: {
          id: article.id,
        },
        data: {
          content: cleanContent,
        },
      });

      total++;
    }

    return total;

  }

}
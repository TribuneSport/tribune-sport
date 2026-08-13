import { db } from "@/lib/db";

export class PublishAgent {
  async execute(): Promise<number> {
    const articles = await db.article.findMany({
      where: {
        published: false,
      },
    });

    let total = 0;

    for (const article of articles) {
      if (
        article.slug &&
        article.seoTitle &&
        article.seoDescription
      ) {
        await db.article.update({
          where: {
            id: article.id,
          },
          data: {
            published: true,
          },
        });

        total++;
      }
    }

    return total;
  }
}
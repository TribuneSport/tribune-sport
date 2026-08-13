import slugify from "slugify";
import { db } from "@/lib/db";

export class SEOAgent {
  async execute(): Promise<number> {
    const articles = await db.article.findMany({
      where: {
        OR: [
          { slug: null },
          { seoTitle: null },
          { seoDescription: null },
        ],
      },
    });

    let total = 0;

    for (const article of articles) {
      let slug = slugify(article.title, {
        lower: true,
        strict: true,
        trim: true,
      });

      let i = 2;

      while (
        await db.article.findFirst({
          where: {
            slug,
            NOT: {
              id: article.id,
            },
          },
        })
      ) {
        slug = `${slug}-${i}`;
        i++;
      }

      await db.article.update({
        where: {
          id: article.id,
        },
        data: {
          slug,
          seoTitle: article.title,
          seoDescription: article.summary.substring(0, 160),
        },
      });

      total++;
    }

    return total;
  }
}
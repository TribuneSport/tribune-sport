import { db } from "@/lib/db";

export class PublishAgent {
  async execute(): Promise<number> {
    const articles = await db.article.findMany({
      where: {
        published: false,
        aiRewritten: true,
      },
    });

    let total = 0;

    for (const article of articles) {
      if (
        article.slug &&
        article.seoTitle &&
        article.seoDescription &&
        article.aiRewritten
      ) {
        /*
         * ATTENTION :
         *
         * Même après traitement IA,
         * l'article reste volontairement en brouillon.
         *
         * Cet agent ne publie donc plus automatiquement.
         *
         * La publication doit être faite depuis l'administration
         * après validation humaine.
         */
        continue;
      }
    }

    return total;
  }
}
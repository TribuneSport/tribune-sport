import { db } from "@/lib/db";
import { AIService } from "@/services/ai.service";

export class NewsAgent {
  private ai = new AIService();

  async execute(): Promise<number> {
    const articles = await db.article.findMany({
      where: {
        published: false,
        aiRewritten: false,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    let processed = 0;

    for (const article of articles) {
      try {
        if (!article.content?.trim()) {
          console.log(
            `Article ignoré : contenu vide - ${article.title}`
          );
          continue;
        }

        console.log(
          `🤖 Réécriture IA : ${article.title}`
        );

        const rewritten =
          await this.ai.rewriteArticle({
            title: article.title,
            summary: article.summary,
            content: article.content,
            category: article.category,
          });

        await db.article.update({
          where: {
            id: article.id,
          },
          data: {
            title: rewritten.title,
            summary: rewritten.summary,
            content: rewritten.content,

            seoTitle: rewritten.seoTitle,

            seoDescription:
              rewritten.seoDescription,

            aiRewritten: true,

            /*
             * Très important :
             * l'article reste en brouillon.
             */
            published: false,
          },
        });

        processed++;

        console.log(
          `✅ Article réécrit : ${rewritten.title}`
        );
      } catch (error) {
        console.error(
          `❌ Erreur réécriture article ${article.id}:`,
          error
        );
      }
    }

    return processed;
  }
}
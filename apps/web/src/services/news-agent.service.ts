import { prisma } from "@/lib/prisma";
import { OllamaService } from "./ollama.service";

export class NewsAgentService {

  async process() {

    const ollama = new OllamaService();

    const articles = await prisma.article.findMany({

      where: {
        published: false,
      },

      orderBy: {
        createdAt: "asc",
      },

    });

    for (const article of articles) {

      const rewritten = await ollama.rewrite(
        article.title,
        article.summary
      );

      await prisma.article.update({

        where: {
          id: article.id,
        },

        data: {

          title: this.cleanTitle(article.title),

          summary: rewritten.substring(0, 300),

          content: rewritten,

        },

      });

    }

    return articles.length;

  }

  private cleanTitle(title: string) {

    return title
      .replace(/\|.*/g, "")
      .replace(/- RMC Sport/g, "")
      .replace(/- L'Équipe/g, "")
      .trim();

  }

}
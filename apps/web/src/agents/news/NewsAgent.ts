import { prisma } from "@/lib/prisma";
import { AIService } from "@/services/ai.service";

export class NewsAgent {
  async process() {
    const ai = new AIService();

    const articles = await prisma.article.findMany({
      where: {
        published: false,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    for (const article of articles) {
      const rewritten = await ai.rewriteArticle({
        title: this.cleanTitle(article.title),
        summary: this.createSummary(article.summary),
        content: this.createContent(article),
      });

      await prisma.article.update({
        where: {
          id: article.id,
        },
        data: rewritten,
      });
    }

    return articles.length;
  }

  private cleanTitle(title: string) {
    return title
      .replace(/\|.*/g, "")
      .replace(/- RMC Sport/g, "")
      .trim();
  }

  private createSummary(summary: string) {
    return summary.substring(0, 180);
  }

  private createContent(article: any) {
    return `
# ${article.title}

${article.summary}

Cet article a été récupéré automatiquement par Tribune Sport.

Source :
${article.sourceUrl}
`;
  }
}
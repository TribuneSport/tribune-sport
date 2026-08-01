import { prisma } from "@/lib/prisma";

export class SEOAgent {
  async process() {
    const articles = await prisma.article.findMany({
      where: {
        published: false,
      },
    });

    for (const article of articles) {
      await prisma.article.update({
        where: {
          id: article.id,
        },
        data: {
          seoTitle: this.createSeoTitle(article.title),
          seoDescription: this.createDescription(article.summary),
          slug: this.createSlug(article.title),
        },
      });
    }

    return articles.length;
  }

  private createSeoTitle(title: string) {
    return `${title} | Tribune Sport`;
  }

  private createDescription(summary: string) {
    return summary.substring(0, 155);
  }

  private createSlug(title: string) {
    return title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  }
}
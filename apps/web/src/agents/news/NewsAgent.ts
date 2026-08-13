import { db } from "@/lib/db";
import { BaseAgent } from "../base/BaseAgent";
import { createSlug } from "@/lib/slug";

export class NewsAgent extends BaseAgent {
  constructor() {
    super("NewsAgent");
  }

  async execute(): Promise<number> {
    const articles = await db.article.findMany({
      where: {
        published: false,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    let processed = 0;

    for (const article of articles) {
      const title = this.cleanTitle(article.title);

      await db.article.update({
        where: {
          id: article.id,
        },
        data: {
          title,
          slug: article.slug ?? createSlug(title),
          seoTitle:
            article.seoTitle ??
            `${title} | Tribune Sport`,
          seoDescription:
            article.seoDescription ??
            this.createSeoDescription(article.summary),
        },
      });

      processed++;
    }

    this.success(`${processed} article(s) préparé(s).`);

    return processed;
  }

  private cleanTitle(title: string): string {
    return title
      .replace(/\|.*/g, "")
      .replace(/- RMC Sport/gi, "")
      .replace(/- L'Équipe/gi, "")
      .replace(/- Foot Mercato/gi, "")
      .trim();
  }

  private createSeoDescription(summary: string): string {
    if (!summary) {
      return "";
    }

    return summary.length > 155
      ? summary.substring(0, 155) + "..."
      : summary;
  }
}
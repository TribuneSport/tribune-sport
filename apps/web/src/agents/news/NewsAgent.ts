import { db } from "@/lib/db";
import { OllamaService } from "@/services/ollama.service";
import { AGENTS } from "@/config/agents";

function stripHtml(text: string): string {
  return text
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/\s+/g, " ")
    .trim();
}

function cleanText(text: string): string {
  return stripHtml(text)
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function normalizeContent(content: string): string {
  let value = content.trim();

  value = value.replace(/```html/gi, "");
  value = value.replace(/```/g, "");

  value = value
    .replace(/<h1[^>]*>/gi, "<h2>")
    .replace(/<\/h1>/gi, "</h2>")
    .replace(/<h3[^>]*>/gi, "<h2>")
    .replace(/<\/h3>/gi, "</h2>");

  value = value.replace(
    /<(?!\/?(?:p|h2)\b)[^>]+>/gi,
    ""
  );

  return value.trim();
}

export class NewsAgent {
  private readonly ollama = new OllamaService();

  async execute(): Promise<number> {
    const articles = await db.article.findMany({
      where: {
        published: false,
        aiRewritten: false,
      },
      orderBy: {
        createdAt: "asc",
      },
      take: AGENTS.MAX_ARTICLES_PER_RUN,
    });

    let processed = 0;

    for (const article of articles) {
      try {
        if (!article.content?.trim()) {
          console.log(
            `⚠️ Article ignoré : contenu vide - ${article.title}`
          );
          continue;
        }

        console.log(
          `🤖 Agent éditorial Ollama : ${article.title}`
        );

        const title = cleanText(article.title);
        const summary = cleanText(article.summary || "");
        const content = cleanText(article.content || "");

        const result = await this.ollama.generateArticle({
          title,
          summary,
          content,
          category: article.category,
        });

        const safeTitle = escapeHtml(result.title);
        const safeSummary = escapeHtml(result.summary);

        const editorialContent = normalizeContent(
          result.content
        );

        if (!editorialContent) {
          throw new Error(
            "Le contenu généré est vide."
          );
        }

        await db.article.update({
          where: {
            id: article.id,
          },
          data: {
            title: safeTitle,
            summary: safeSummary,
            content: editorialContent,
            seoTitle: result.seoTitle,
            seoDescription: result.seoDescription,
            aiRewritten: true,
            published: false,
          },
        });

        processed++;

        console.log(
          `✅ Article généré : ${result.title}`
        );
      } catch (error) {
        console.error(
          `❌ Erreur Agent éditorial - article ${article.id}:`,
          error
        );
      }
    }

    console.log(
      `🤖 Agent éditorial terminé : ${processed}/${articles.length}`
    );

    return processed;
  }
}
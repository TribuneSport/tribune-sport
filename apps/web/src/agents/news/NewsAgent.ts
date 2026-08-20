import { db } from "@/lib/db";

function cleanText(text: string): string {
  return text
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

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

function buildArticleContent(
  title: string,
  summary: string,
  content: string
): string {
  const cleanSummary = stripHtml(cleanText(summary));
  const cleanContent = stripHtml(cleanText(content));

  const paragraphs = cleanContent
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  const html: string[] = [];

  if (cleanSummary) {
    html.push(`<p>${cleanSummary}</p>`);
  }

  if (paragraphs.length > 0) {
    for (const paragraph of paragraphs) {
      if (
        paragraph === cleanSummary ||
        paragraph.length < 30
      ) {
        continue;
      }

      html.push(`<p>${paragraph}</p>`);
    }
  }

  if (html.length === 0) {
    html.push(
      `<p>${cleanContent || cleanSummary || title}</p>`
    );
  }

  return html.join("");
}

function buildSeoTitle(title: string): string {
  return title.trim().substring(0, 60);
}

function buildSeoDescription(
  summary: string,
  title: string
): string {
  const source =
    stripHtml(summary).trim() ||
    title.trim();

  return source.substring(0, 160);
}

export class NewsAgent {
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
          `📰 Préparation article : ${article.title}`
        );

        const content = buildArticleContent(
          article.title,
          article.summary,
          article.content
        );

        const summary =
          stripHtml(article.summary || "").trim() ||
          stripHtml(article.content || "")
            .trim()
            .substring(0, 300);

        const seoTitle = buildSeoTitle(article.title);

        const seoDescription =
          buildSeoDescription(
            summary,
            article.title
          );

        await db.article.update({
          where: {
            id: article.id,
          },
          data: {
            title: article.title.trim(),

            summary,

            content,

            seoTitle,

            seoDescription,

            /*
             * Ce champ ne signifie plus qu'une API IA
             * payante a été utilisée.
             *
             * Il indique que l'article a été traité
             * par l'automatisation éditoriale.
             */
            aiRewritten: true,

            /*
             * L'article reste en brouillon.
             */
            published: false,
          },
        });

        processed++;

        console.log(
          `✅ Article préparé : ${article.title}`
        );
      } catch (error) {
        console.error(
          `❌ Erreur préparation article ${article.id}:`,
          error
        );
      }
    }

    return processed;
  }
}
import { db } from "@/lib/db";

export class TranslationAgent {

  async execute(): Promise<number> {

    const articles = await db.article.findMany({
      where: {
        published: false,
      },
    });

    let translated = 0;

    for (const article of articles) {

      const language = this.detectLanguage(article.content);

      if (language === "fr") {
        continue;
      }

      const translatedContent = await this.translate(
        article.content,
        language
      );

      const translatedTitle = await this.translate(
        article.title,
        language
      );

      const translatedSummary = await this.translate(
        article.summary,
        language
      );

      await db.article.update({
        where: {
          id: article.id,
        },
        data: {
          title: translatedTitle,
          summary: translatedSummary,
          content: translatedContent,
        },
      });

      translated++;
    }

    return translated;
  }

  private detectLanguage(text: string): string {

    if (/\b(the|and|with|goal|match|player|club)\b/i.test(text))
      return "en";

    if (/\b(el|los|del|liga|jugador|gol)\b/i.test(text))
      return "es";

    if (/\b(il|gli|calcio|giocatore|gol)\b/i.test(text))
      return "it";

    if (/\b(der|die|das|spieler|tor)\b/i.test(text))
      return "de";

    return "fr";
  }

  private async translate(
    text: string,
    language: string
  ): Promise<string> {

    /**
     * Temporaire.
     * La vraie traduction sera branchée ici.
     */

    return text;
  }

}
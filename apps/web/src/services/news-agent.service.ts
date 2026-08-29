import { db } from "@/lib/db";
import { OllamaService } from "./ollama.service";
import type { EditorialArticleInput } from "./ollama.service";

export class NewsAgentService {
  private readonly ollama = new OllamaService();

  async process(): Promise<number> {
    const articles = await db.article.findMany({
      where: {
        published: false,
        aiRewritten: false,
      },
      orderBy: {
        createdAt: "asc",
      },
      take: 5,
    });

    let processed = 0;

    for (const article of articles) {
      try {
        const title = article.title || "";
        const summary = article.summary || "";
        const content = article.content || "";

        // Bloque les articles qui ne sont manifestement pas français.
        if (!this.isFrench(title, summary, content)) {
          console.log(
            `🌍 Article non français ignoré : ${title}`
          );

          // On le marque comme traité pour qu'il ne soit
          // jamais renvoyé à Ollama lors du prochain passage.
          await db.article.update({
            where: {
              id: article.id,
            },
            data: {
              aiRewritten: true,
            },
          });

          continue;
        }

        if (!content.trim()) {
          console.log(
            `⚠️ Article ignoré : contenu vide - ${title}`
          );
          continue;
        }

        console.log(
          `🤖 Agent éditorial Ollama : ${title}`
        );

        const input: EditorialArticleInput = {
          title,
          summary,
          content,
          category: article.category,
        };

        const result =
          await this.ollama.generateArticle(input);

        await db.article.update({
          where: {
            id: article.id,
          },
          data: {
            title: result.title,
            summary: result.summary,
            content: result.content,
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
          `❌ Erreur article ${article.id}:`,
          error
        );
      }
    }

    console.log(
      `🤖 Agent éditorial terminé : ${processed}/${articles.length}`
    );

    return processed;
  }

  private isFrench(
    title: string,
    summary: string,
    content: string
  ): boolean {
    const clean = (value: string) =>
      value
        .replace(/<[^>]*>/g, " ")
        .replace(/\s+/g, " ")
        .toLowerCase();

    const titleText = clean(title);
    const fullText = clean(
      `${title} ${summary} ${content}`
    );

    /*
     * Mots caractéristiques de l'anglais.
     */
    const englishWords = [
      "the",
      "and",
      "with",
      "from",
      "for",
      "after",
      "before",
      "will",
      "would",
      "could",
      "should",
      "has",
      "have",
      "this",
      "that",
      "who",
      "why",
      "what",
      "when",
      "where",
      "how",
      "new",
      "sign",
      "signing",
      "signed",
      "joins",
      "joined",
      "win",
      "wins",
      "won",
      "lose",
      "loses",
      "lost",
      "manager",
      "player",
      "players",
      "team",
      "teams",
      "goal",
      "goals",
      "game",
      "games",
      "match",
      "matches",
      "transfer",
      "transfers",
      "watch",
      "highlights",
      "footballer",
      "defender",
      "midfielder",
      "striker",
      "coach",
      "captain",
      "retirement",
      "retire",
      "hospital",
      "injured",
      "injury",
      "deal",
      "agrees",
      "agreed",
      "appoint",
      "appointed",
      "takeover",
      "weekend",
      "season",
      "summer",
      "fans",
      "supporters",
      "live",
      "score",
      "updates",
      "screen",
      "inside",
      "happened",
      "star",
      "stars",
      "never",
      "made",
    ];

    /*
     * Mots caractéristiques du français.
     */
    const frenchWords = [
      "le",
      "la",
      "les",
      "un",
      "une",
      "des",
      "du",
      "de",
      "et",
      "avec",
      "pour",
      "dans",
      "sur",
      "après",
      "avant",
      "mais",
      "qui",
      "que",
      "ce",
      "cette",
      "cet",
      "son",
      "sa",
      "ses",
      "leur",
      "leurs",
      "est",
      "sont",
      "être",
      "avoir",
      "joueur",
      "joueurs",
      "équipe",
      "équipes",
      "club",
      "clubs",
      "match",
      "victoire",
      "défaite",
      "transfert",
      "transferts",
      "mercato",
      "entraîneur",
      "entraîneurs",
      "défenseur",
      "milieu",
      "attaquant",
      "capitaine",
      "retraite",
      "blessure",
      "blessé",
      "contrat",
      "accord",
      "arrivée",
      "départ",
      "championnat",
      "football",
      "supporters",
      "saison",
      "direct",
      "score",
      "actualité",
      "actualités",
      "jouer",
      "joue",
      "joueurs",
      "français",
      "française",
    ];

    const countWords = (
      text: string,
      words: string[]
    ): number => {
      let count = 0;

      for (const word of words) {
        const regex = new RegExp(
          `\\b${this.escapeRegex(word)}\\b`,
          "gi"
        );

        count += (text.match(regex) || []).length;
      }

      return count;
    };

    const englishTitleScore = countWords(
      titleText,
      englishWords
    );

    const frenchTitleScore = countWords(
      titleText,
      frenchWords
    );

    const englishScore = countWords(
      fullText,
      englishWords
    );

    const frenchScore = countWords(
      fullText,
      frenchWords
    );

    /*
     * TITRE :
     *
     * Deux mots anglais caractéristiques ou plus
     * suffisent généralement à bloquer l'article.
     */
    if (
      englishTitleScore >= 2 &&
      englishTitleScore > frenchTitleScore
    ) {
      return false;
    }

    /*
     * Expressions anglaises très caractéristiques.
     */
    const obviousEnglishPatterns = [
      /\bwhy\s+/i,
      /\bwhat\s+/i,
      /\bwho\s+/i,
      /\bhow\s+/i,
      /\bthe\s+\w+/i,
      /\bnewcastle\s+captain\b/i,
      /\bpremier\s+league\s+club\b/i,
      /\bshould\s+fans\b/i,
      /\bfor\s+each\b/i,
      /\bwhat\s+happened\b/i,
      /\binside\s+\w+/i,
      /\blive\s+score\b/i,
      /\bwatch\s+highlights\b/i,
      /\bsign\s+\w+/i,
      /\bsigning\s+\w+/i,
      /\bset\s+to\s+sign\b/i,
      /\bready\s+to\s+make\b/i,
    ];

    for (const pattern of obviousEnglishPatterns) {
      if (pattern.test(titleText)) {
        return false;
      }
    }

    /*
     * Si le contenu contient beaucoup plus d'anglais
     * que de français, on bloque.
     */
    if (
      englishScore >= 4 &&
      englishScore > frenchScore * 1.4
    ) {
      return false;
    }

    /*
     * Caractères français.
     */
    const hasFrenchCharacters =
      /[àâäçéèêëîïôöùûüÿœæ]/i.test(fullText);

    /*
     * Texte clairement français.
     */
    if (
      frenchScore >= 4 &&
      frenchScore > englishScore
    ) {
      return true;
    }

    if (
      hasFrenchCharacters &&
      frenchScore >= 2 &&
      frenchScore >= englishScore
    ) {
      return true;
    }

    /*
     * Si aucun signal français fiable n'est présent,
     * on bloque l'article.
     */
    return false;
  }

  private escapeRegex(value: string): string {
    return value.replace(
      /[.*+?^${}()|[\]\\]/g,
      "\\$&"
    );
  }
}
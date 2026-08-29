import Parser from "rss-parser";
import { db } from "@/lib/db";
import { detectCategory } from "@/lib/classifier";

type RSSItem = {
  title?: string;
  link?: string;
  contentSnippet?: string;
  content?: string;
  enclosure?: {
    url?: string;
  };
  mediaContent?: {
    url?: string;
    $?: {
      url?: string;
    };
  };
  mediaThumbnail?: {
    url?: string;
    $?: {
      url?: string;
    };
  };
};

export class RSSAgent {
  private parser = new Parser<{}, RSSItem>({
    customFields: {
      item: [
        ["media:content", "mediaContent", { keepArray: false }],
        ["media:thumbnail", "mediaThumbnail", { keepArray: false }],
      ],
    },
  });

  private feeds = [
    "https://rmcsport.bfmtv.com/rss/football/",
  ];

  async execute(): Promise<number> {
    let imported = 0;

    for (const url of this.feeds) {
      try {
        console.log(`📡 RSS : ${url}`);

        const feed = await this.parser.parseURL(url);

        for (const item of feed.items) {
          if (!item.title || !item.link) {
            continue;
          }

          const title = item.title.trim();

          const summary =
            item.contentSnippet?.trim() ??
            item.content?.trim() ??
            "";

          const content =
            item.content?.trim() ??
            item.contentSnippet?.trim() ??
            "";

          // Bloque les articles qui ne sont pas en français.
          if (!this.isFrench(title, summary, content)) {
            console.log(
              `🌍 Article ignoré (non français) : ${title}`
            );
            continue;
          }

          const exists = await db.article.findUnique({
            where: {
              sourceUrl: item.link,
            },
          });

          if (exists) {
            continue;
          }

          const category = detectCategory(title, summary);

          let image = this.extractImage(item);

          if (!image) {
            image = await this.extractOgImage(item.link);
          }

          console.log(
            image
              ? `🖼️ Image trouvée : ${image}`
              : `⚠️ Aucune image : ${title}`
          );

          await db.article.create({
            data: {
              title,
              summary,
              content,
              image,
              category,
              sourceUrl: item.link,
              published: false,
              aiRewritten: false,
            },
          });

          imported++;
        }
      } catch (error) {
        console.error("RSS :", url, error);
      }
    }

    console.log(`✅ ${imported} articles français importés.`);

    return imported;
  }

  private isFrench(
    title: string,
    summary: string,
    content: string
  ): boolean {
    const text = `${title} ${summary} ${content}`
      .toLowerCase()
      .replace(/<[^>]*>/g, " ");

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
      "signed",
      "joins",
      "joined",
      "win",
      "wins",
      "won",
      "lose",
      "loses",
      "lost",
      "loss",
      "manager",
      "player",
      "players",
      "team",
      "teams",
      "club",
      "clubs",
      "goal",
      "goals",
      "match",
      "matches",
      "game",
      "games",
      "transfer",
      "transfers",
      "world cup",
      "premier league",
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
      "victory",
      "defeat",
    ];

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
    ];

    let englishScore = 0;
    let frenchScore = 0;

    for (const word of englishWords) {
      const regex = new RegExp(`\\b${this.escapeRegex(word)}\\b`, "gi");
      englishScore += (text.match(regex) || []).length;
    }

    for (const word of frenchWords) {
      const regex = new RegExp(`\\b${this.escapeRegex(word)}\\b`, "gi");
      frenchScore += (text.match(regex) || []).length;
    }

    /*
     * Titre anglais : blocage immédiat.
     *
     * Exemple :
     * "Why Arsenal are signing Newcastle captain Guimaraes"
     * contient plusieurs marqueurs anglais.
     */
    const titleEnglishScore = this.countWords(title, englishWords);
    const titleFrenchScore = this.countWords(title, frenchWords);

    if (
      titleEnglishScore >= 2 &&
      titleEnglishScore > titleFrenchScore
    ) {
      return false;
    }

    /*
     * Si le contenu est nettement plus anglais que français,
     * on bloque également.
     */
    if (
      englishScore >= 4 &&
      englishScore > frenchScore * 1.5
    ) {
      return false;
    }

    /*
     * Présence de caractères et mots typiquement français.
     */
    const frenchCharacters =
      /[àâäçéèêëîïôöùûüÿœæ]/i.test(text);

    if (
      frenchCharacters &&
      frenchScore >= 2 &&
      frenchScore >= englishScore
    ) {
      return true;
    }

    /*
     * Pour un texte clairement français.
     */
    if (frenchScore >= 4 && frenchScore > englishScore) {
      return true;
    }

    /*
     * Si aucun signal fiable n'est trouvé,
     * on bloque plutôt que d'importer de l'anglais.
     */
    return englishScore < 2 && frenchScore >= 2;
  }

  private countWords(
    text: string,
    words: string[]
  ): number {
    let score = 0;

    const normalized = text.toLowerCase();

    for (const word of words) {
      const regex = new RegExp(
        `\\b${this.escapeRegex(word)}\\b`,
        "gi"
      );

      score += (normalized.match(regex) || []).length;
    }

    return score;
  }

  private escapeRegex(value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  private extractImage(item: RSSItem): string {
    if (item.enclosure?.url) {
      return item.enclosure.url;
    }

    if (item.mediaContent?.url) {
      return item.mediaContent.url;
    }

    if (item.mediaContent?.$?.url) {
      return item.mediaContent.$.url;
    }

    if (item.mediaThumbnail?.url) {
      return item.mediaThumbnail.url;
    }

    if (item.mediaThumbnail?.$?.url) {
      return item.mediaThumbnail.$.url;
    }

    return "";
  }

  private async extractOgImage(
    url: string
  ): Promise<string> {
    try {
      const response = await fetch(url, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/150 Safari/537.36",
        },
        cache: "no-store",
      });

      if (!response.ok) {
        return "";
      }

      const html = await response.text();

      const match =
        html.match(
          /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i
        ) ||
        html.match(
          /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i
        );

      return match?.[1]?.trim() ?? "";
    } catch {
      return "";
    }
  }
}

export default RSSAgent;
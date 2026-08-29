import { db } from "@/lib/db";

export class CleaningAgent {
  async execute(): Promise<number> {
    const articles = await db.article.findMany({
      where: {
        published: false,
        aiRewritten: false,
      },
    });

    let total = 0;

    for (const article of articles) {
      const cleanTitle = article.title
        .replace(/\s+/g, " ")
        .trim();

      const cleanSummary = article.summary
        .replace(/<[^>]*>/g, " ")
        .replace(/\s+/g, " ")
        .trim();

      const cleanContent = article.content
        .replace(/<[^>]*>/g, " ")
        .replace(/\s+/g, " ")
        .trim();

      /*
       * FILTRE DE LANGUE
       *
       * Les articles manifestement anglais sont supprimés
       * du pipeline avant Ollama.
       */
      if (!this.isFrench(cleanTitle, cleanSummary, cleanContent)) {
        console.log(
          `🌍 Article anglais ignoré : ${cleanTitle}`
        );

        await db.article.delete({
          where: {
            id: article.id,
          },
        });

        continue;
      }

      await db.article.update({
        where: {
          id: article.id,
        },
        data: {
          title: cleanTitle,
          summary: cleanSummary,
          content: cleanContent,
        },
      });

      total++;
    }

    console.log(`🧹 Nettoyage terminé : ${total} articles français.`);

    return total;
  }

  private isFrench(
    title: string,
    summary: string,
    content: string
  ): boolean {
    const text = `${title} ${summary} ${content}`.toLowerCase();

    const englishPatterns = [
      /\bthe\b/,
      /\band\b/,
      /\bwith\b/,
      /\bfrom\b/,
      /\bfor\b/,
      /\bafter\b/,
      /\bbefore\b/,
      /\bwill\b/,
      /\bwould\b/,
      /\bcould\b/,
      /\bshould\b/,
      /\bhas\b/,
      /\bhave\b/,
      /\bthis\b/,
      /\bthat\b/,
      /\bwho\b/,
      /\bwhy\b/,
      /\bwhat\b/,
      /\bwhen\b/,
      /\bwhere\b/,
      /\bhow\b/,
      /\bnew\b/,
      /\bsign\b/,
      /\bsigned\b/,
      /\bjoins\b/,
      /\bjoined\b/,
      /\bwin\b/,
      /\bwins\b/,
      /\bwon\b/,
      /\bloss\b/,
      /\blost\b/,
      /\bplayer\b/,
      /\bplayers\b/,
      /\bteam\b/,
      /\bteams\b/,
      /\bclub\b/,
      /\bclubs\b/,
      /\bgoal\b/,
      /\bgoals\b/,
      /\bmatch\b/,
      /\bmatches\b/,
      /\bgame\b/,
      /\bgames\b/,
      /\btransfer\b/,
      /\btransfers\b/,
      /\bmanager\b/,
      /\bcoach\b/,
      /\bdefender\b/,
      /\bmidfielder\b/,
      /\bstriker\b/,
      /\bfootballer\b/,
      /\bwatch\b/,
      /\bhighlights\b/,
      /\bworld cup\b/,
      /\bpremier league\b/,
    ];

    const frenchPatterns = [
      /\ble\b/,
      /\bla\b/,
      /\bles\b/,
      /\bun\b/,
      /\bune\b/,
      /\bdes\b/,
      /\bdu\b/,
      /\bde\b/,
      /\bet\b/,
      /\bavec\b/,
      /\bpour\b/,
      /\bdans\b/,
      /\bsur\b/,
      /\baprès\b/,
      /\bavant\b/,
      /\bmais\b/,
      /\bqui\b/,
      /\bque\b/,
      /\bce\b/,
      /\bcette\b/,
      /\bcet\b/,
      /\bson\b/,
      /\bsa\b/,
      /\bses\b/,
      /\béquipe\b/,
      /\bjoueur\b/,
      /\bvictoire\b/,
      /\bdéfaite\b/,
      /\btransfert\b/,
      /\bmercato\b/,
      /\bentraîneur\b/,
      /\bmatch\b/,
    ];

    let englishScore = 0;
    let frenchScore = 0;

    for (const pattern of englishPatterns) {
      if (pattern.test(text)) {
        englishScore++;
      }
    }

    for (const pattern of frenchPatterns) {
      if (pattern.test(text)) {
        frenchScore++;
      }
    }

    /*
     * Plusieurs marqueurs anglais sans marqueurs
     * français = article probablement anglais.
     */
    if (englishScore >= 3 && englishScore > frenchScore) {
      return false;
    }

    /*
     * Plusieurs marqueurs français = article français.
     */
    if (frenchScore >= 2) {
      return true;
    }

    /*
     * Texte très ambigu : on ne bloque pas.
     */
    return englishScore < 4;
  }
}
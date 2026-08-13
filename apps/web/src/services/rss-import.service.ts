import { db } from "@/lib/db";
import { RSSService } from "./rss.service";
import { normalizeCategory } from "@/lib/categories";
import { createSlug } from "@/lib/slug";
import { franc } from "franc";

export class RSSImportService {
  async import() {
    const rssService = new RSSService();

    const articles = await rssService.getSources();

    let imported = 0;

    for (const article of articles) {
      if (!article.link) {
        continue;
      }

      const title = article.title?.trim() || "Sans titre";

      const summary =
        article.description?.trim() || "Aucun résumé disponible.";

      /*
       * ---------------------------------------------------------
       * 1. Vérification de la langue
       * ---------------------------------------------------------
       *
       * Les flux que nous utilisons sont francophones.
       *
       * franc peut être imprécis sur les textes très courts.
       * On ne l'utilise donc que lorsque nous avons suffisamment
       * de texte pour effectuer une détection raisonnable.
       */

      const textToAnalyze = `${title} ${summary}`.trim();

      if (textToAnalyze.length >= 50) {
        const language = franc(textToAnalyze);

        if (language !== "fra") {
          continue;
        }
      }

      /*
       * ---------------------------------------------------------
       * 2. Vérification du doublon
       * ---------------------------------------------------------
       *
       * Le lien original est notre identifiant de source.
       */

      const existing = await db.article.findUnique({
        where: {
          sourceUrl: article.link,
        },
      });

      if (existing) {
        continue;
      }

      /*
       * ---------------------------------------------------------
       * 3. Création du slug
       * ---------------------------------------------------------
       */

      const baseSlug = createSlug(title);

      let slug = baseSlug;
      let counter = 2;

      while (
        await db.article.findUnique({
          where: {
            slug,
          },
        })
      ) {
        slug = `${baseSlug}-${counter}`;
        counter++;
      }

      /*
       * ---------------------------------------------------------
       * 4. Création de l'article en BROUILLON
       * ---------------------------------------------------------
       *
       * Aucun article importé automatiquement n'est publié.
       */

      await db.article.create({
        data: {
          title,

          summary,

          /*
           * Pour l'instant nous conservons le résumé dans le
           * contenu.
           *
           * Plus tard, nous pourrons ajouter une étape de
           * traduction / reformulation avant publication.
           */
          content: summary,

          category: normalizeCategory(article.club),

          /*
           * L'image sera ajoutée lorsque le RSSService récupérera
           * correctement le champ media:content.
           */
          image: article.image || "",

          /*
           * Source originale conservée.
           */
          sourceUrl: article.link,

          /*
           * IMPORTANT :
           * les imports RSS restent toujours en brouillon.
           */
          published: false,

          seoTitle: title,

          seoDescription: summary.substring(0, 160),

          slug,
        },
      });

      imported++;
    }

    return imported;
  }
}
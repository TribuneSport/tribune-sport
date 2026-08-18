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
    let duplicates = 0;
    let updatedImages = 0;
    let nonFrench = 0;
    let invalid = 0;

    console.log("");
    console.log("📰 Démarrage de l'import RSS...");
    console.log("");

    for (const article of articles) {
      if (!article.link || !article.title) {
        invalid++;
        continue;
      }

      const title = article.title.trim();

      const summary =
        article.description?.trim() ||
        "Aucun résumé disponible.";

      /*
       * ---------------------------------------------------------
       * 1. FILTRE DE LANGUE
       * ---------------------------------------------------------
       */

      const textToAnalyze =
        `${title} ${summary}`.trim();

      if (textToAnalyze.length >= 80) {
        const language = franc(textToAnalyze);

        if (language !== "fra") {
          console.log(
            `🌍 Article ignoré (non français) : ${title}`
          );

          nonFrench++;
          continue;
        }
      }

      /*
       * ---------------------------------------------------------
       * 2. ANTI-DOUBLON + RÉCUPÉRATION DES IMAGES MANQUANTES
       * ---------------------------------------------------------
       */

      const existing = await db.article.findUnique({
        where: {
          sourceUrl: article.link,
        },
      });

      if (existing) {
        /*
         * Si l'article existe déjà mais n'a aucune image,
         * on utilise automatiquement l'image récupérée
         * depuis le RSS ou og:image.
         */
        if (!existing.image && article.image) {
          await db.article.update({
            where: {
              id: existing.id,
            },
            data: {
              image: article.image,
            },
          });

          updatedImages++;

          console.log(
            `🖼️ Image ajoutée à l'article existant : ${title}`
          );
        } else {
          duplicates++;

          console.log(
            `↩️ Déjà présent : ${title}`
          );
        }

        continue;
      }

      /*
       * ---------------------------------------------------------
       * 3. SLUG
       * ---------------------------------------------------------
       */

      const baseSlug =
        createSlug(title) ||
        `article-${Date.now()}`;

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
       * 4. CATÉGORIE
       * ---------------------------------------------------------
       */

      const category = normalizeCategory(
        article.club
      );

      /*
       * ---------------------------------------------------------
       * 5. CRÉATION DU BROUILLON
       * ---------------------------------------------------------
       *
       * Aucun article RSS n'est publié automatiquement.
       */

      await db.article.create({
        data: {
          title,

          summary,

          content: summary,

          category,

          /*
           * L'image est maintenant récupérée automatiquement
           * depuis le RSS ou depuis og:image.
           */
          image: article.image || "",

          sourceUrl: article.link,

          published: false,

          seoTitle: title,

          seoDescription:
            summary.substring(0, 160),

          slug,
        },
      });

      imported++;

      console.log(
        `✅ Brouillon créé : ${title}`
      );
    }

    console.log("");
    console.log("================================");
    console.log("📊 RÉSULTAT IMPORT RSS");
    console.log("================================");
    console.log(`✅ Nouveaux brouillons : ${imported}`);
    console.log(`↩️ Doublons : ${duplicates}`);
    console.log(`🖼️ Images mises à jour : ${updatedImages}`);
    console.log(`🌍 Non français : ${nonFrench}`);
    console.log(`⚠️ Invalides : ${invalid}`);
    console.log("================================");
    console.log("");

    return imported;
  }
}
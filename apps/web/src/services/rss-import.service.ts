import { db } from "@/lib/db";
import { RSSService } from "./rss.service";
import { detectCategory } from "@/lib/classifier";
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
        article.content?.trim() ||
        "Aucun résumé disponible.";

      /*
       * ---------------------------------------------------------
       * 1. FILTRE LANGUE
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
       * 2. ANTI-DOUBLON
       * ---------------------------------------------------------
       */

      const existing =
        await db.article.findUnique({
          where: {
            sourceUrl: article.link,
          },
        });

      if (existing) {
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
            `🖼️ Image ajoutée : ${title}`
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
       * 3. CATÉGORIE
       * ---------------------------------------------------------
       */

      const category = detectCategory(
        title,
        summary
      );

      /*
       * ---------------------------------------------------------
       * 4. SLUG
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
       * 5. IMAGE
       * ---------------------------------------------------------
       */

      const image =
        article.image?.trim() || "";

      /*
       * ---------------------------------------------------------
       * 6. BROUILLON
       * ---------------------------------------------------------
       *
       * L'article RSS entre comme matière première.
       * L'agent IA le réécrira ensuite.
       */

      await db.article.create({
        data: {
          title,

          summary,

          content:
            article.content?.trim() ||
            summary,

          category,

          image,

          sourceUrl: article.link,

          published: false,

          aiRewritten: false,

          seoTitle: null,

          seoDescription: null,

          slug,
        },
      });

      imported++;

      console.log(
        `✅ Brouillon créé [${category}] : ${title}`
      );
    }

    console.log("");
    console.log("================================");
    console.log("📊 RÉSULTAT IMPORT RSS");
    console.log("================================");
    console.log(
      `✅ Nouveaux brouillons : ${imported}`
    );
    console.log(
      `↩️ Doublons : ${duplicates}`
    );
    console.log(
      `🖼️ Images mises à jour : ${updatedImages}`
    );
    console.log(
      `🌍 Non français : ${nonFrench}`
    );
    console.log(
      `⚠️ Invalides : ${invalid}`
    );
    console.log("================================");
    console.log("");

    return imported;
  }
}
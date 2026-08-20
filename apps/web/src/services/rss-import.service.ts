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
    let updatedDates = 0;
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
       * 2. DATE DE PUBLICATION
       * ---------------------------------------------------------
       *
       * On utilise la vraie date provenant du RSS.
       *
       * Si la date est invalide, on laisse null.
       */

      let pubDate: Date | null = null;

      if (article.pubDate?.trim()) {
        const parsedDate = new Date(
          article.pubDate.trim()
        );

        if (!Number.isNaN(parsedDate.getTime())) {
          pubDate = parsedDate;
        }
      }

      /*
       * ---------------------------------------------------------
       * 3. ANTI-DOUBLON
       * ---------------------------------------------------------
       */

      const existing =
        await db.article.findUnique({
          where: {
            sourceUrl: article.link,
          },
        });

      if (existing) {
        const updateData: {
          image?: string;
          pubDate?: Date;
        } = {};

        /*
         * Si l'ancien article n'a pas d'image,
         * on récupère celle du RSS.
         */

        if (!existing.image && article.image) {
          updateData.image = article.image;

          updatedImages++;

          console.log(
            `🖼️ Image ajoutée : ${title}`
          );
        }

        /*
         * Si l'ancien article n'a pas encore de date,
         * on récupère la date RSS.
         */

        if (!existing.pubDate && pubDate) {
          updateData.pubDate = pubDate;

          updatedDates++;

          console.log(
            `📅 Date ajoutée : ${title}`
          );
        }

        if (Object.keys(updateData).length > 0) {
          await db.article.update({
            where: {
              id: existing.id,
            },
            data: updateData,
          });
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
       * 4. CATÉGORIE
       * ---------------------------------------------------------
       */

      const category = detectCategory(
        title,
        summary
      );

      /*
       * ---------------------------------------------------------
       * 5. SLUG
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
       * 6. IMAGE
       * ---------------------------------------------------------
       */

      const image =
        article.image?.trim() || "";

      /*
       * ---------------------------------------------------------
       * 7. CRÉATION DU BROUILLON
       * ---------------------------------------------------------
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

          pubDate,

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
      `📅 Dates mises à jour : ${updatedDates}`
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
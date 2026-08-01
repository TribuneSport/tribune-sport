import { RSSImportService } from "@/services/rss-import.service";
import { NewsAgent } from "./news/NewsAgent";

export class Scheduler {
  async run() {
    console.log("==================================");
    console.log("TRIBUNE SPORT IA");
    console.log("Lancement des agents...");
    console.log("==================================");

    const rss = new RSSImportService();
    const imported = await rss.import();

    console.log(`${imported} articles importés.`);

    const news = new NewsAgent();
    const processed = await news.process();

    console.log(`${processed} articles réécrits.`);

    console.log("==================================");
    console.log("Cycle terminé.");
    console.log("==================================");

    return {
      imported,
      processed,
    };
  }
}
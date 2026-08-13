import { BaseAgent } from "../base/BaseAgent";
import { RSSService } from "@/services/rss.service";

export class SourceAgent extends BaseAgent {
  constructor() {
    super("SourceAgent");
  }

  async execute(): Promise<number> {
    this.log("Lecture des flux RSS...");

    const rss = new RSSService();

    const articles = await rss.getSources();

    console.table(articles);

    this.success(`${articles.length} articles récupérés.`);

    return articles.length;
  }
}
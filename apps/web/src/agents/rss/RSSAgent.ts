import Parser from "rss-parser";
import { db } from "@/lib/db";

export class RSSAgent {
  private parser = new Parser();

  private feeds = [
    "https://www.lequipe.fr/rss/actu_rss_Football.xml",
    "https://rmcsport.bfmtv.com/rss/football/",
    "https://www.footmercato.net/rss",
  ];

  async execute(): Promise<number> {
    let imported = 0;

    for (const url of this.feeds) {
      try {
        const feed = await this.parser.parseURL(url);

        for (const item of feed.items) {
          if (!item.title || !item.link) {
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

          await db.article.create({
            data: {
              title: item.title,
              summary:
                item.contentSnippet ??
                item.content ??
                "",
              content:
                item.content ??
                item.contentSnippet ??
                "",
              image: "",
              category: "Football",
              sourceUrl: item.link,
              published: false,
            },
          });

          imported++;
        }
      } catch (e) {
        console.error("RSS :", url, e);
      }
    }

    return imported;
  }
}
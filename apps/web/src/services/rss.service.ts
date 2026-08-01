import Parser from "rss-parser";
import { RSS_SOURCES } from "@/rss/sources";

const parser = new Parser();

export class RSSService {
  async getSources() {
    const articles = [];

    for (const source of RSS_SOURCES) {
      try {
        const feed = await parser.parseURL(source.url);

        for (const item of feed.items) {
          articles.push({
            club: source.club,
            title: item.title ?? "",
            link: item.link ?? "",
            description: item.contentSnippet ?? "",
            date: item.pubDate ?? "",
          });
        }
      } catch (error) {
        console.error(`Erreur RSS ${source.club}`, error);
      }
    }

    return articles;
  }
}
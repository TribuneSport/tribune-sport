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
    "https://www.lequipe.fr/rss/actu_rss_Football.xml",
    "https://rmcsport.bfmtv.com/rss/football/",
    "https://www.footmercato.net/rss",
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

          const exists = await db.article.findUnique({
            where: {
              sourceUrl: item.link,
            },
          });

          if (exists) {
            continue;
          }

          const summary =
            item.contentSnippet?.trim() ??
            item.content?.trim() ??
            "";

          const content =
            item.content?.trim() ??
            item.contentSnippet?.trim() ??
            "";

          const category = detectCategory(
            item.title,
            summary
          );

          let image = this.extractImage(item);

          if (!image) {
            image = await this.extractOgImage(item.link);
          }

          console.log(
            image
              ? `🖼️ Image trouvée : ${image}`
              : `⚠️ Aucune image : ${item.title}`
          );

          await db.article.create({
            data: {
              title: item.title.trim(),
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

    console.log(`✅ ${imported} articles importés.`);

    return imported;
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
import Parser from "rss-parser";

type RSSItem = {
  title?: string;
  contentSnippet?: string;
  content?: string;
  link?: string;
  pubDate?: string;

  enclosure?: {
    url?: string;
    type?: string;
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

type RSSFeed = {
  name: string;
  club: string;
  url: string;
};

export type RSSArticle = {
  club: string;
  sourceName: string;
  title: string;
  description: string;
  content: string;
  link: string;
  pubDate: string;
  image: string;
};

const parser = new Parser<{}, RSSItem>({
  customFields: {
    item: [
      ["media:content", "mediaContent", { keepArray: false }],
      ["media:thumbnail", "mediaThumbnail", { keepArray: false }],
    ],
  },
});

export class RSSService {
  async getSources(): Promise<RSSArticle[]> {
    const feeds: RSSFeed[] = [
      {
        name: "Le Figaro Football",
        club: "Football",
        url: "https://www.lefigaro.fr/rss/figaro_football.xml",
      },
      {
        name: "UEFA",
        club: "UEFA",
        url: "https://www.uefa.com/rssfeed/news/rss.xml",
      },
      {
        name: "BBC Sport Football",
        club: "Football",
        url: "https://feeds.bbci.co.uk/sport/football/rss.xml",
      },
      {
        name: "The Guardian Football",
        club: "Football",
        url: "https://www.theguardian.com/football/rss",
      },
    ];

    const articles: RSSArticle[] = [];

    for (const feed of feeds) {
      try {
        console.log(`📡 RSS : ${feed.name}`);

        const rss = await parser.parseURL(feed.url);

        console.log(
          `   → ${rss.items.length} éléments récupérés`
        );

        for (const item of rss.items) {
          const title = item.title?.trim() ?? "";
          const link = item.link?.trim() ?? "";

          if (!title || !link) {
            continue;
          }

          const description =
            item.contentSnippet?.trim() ||
            item.content?.trim() ||
            "";

          const content =
            item.content?.trim() ||
            item.contentSnippet?.trim() ||
            description;

          let image = this.extractImage(item);

          if (!image) {
            image = await this.extractOgImage(link);
          }

          articles.push({
            club: feed.club,
            sourceName: feed.name,
            title,
            description,
            content,
            link,
            pubDate: item.pubDate ?? "",
            image,
          });
        }
      } catch (error) {
        console.error(
          `❌ Impossible de récupérer le flux RSS : ${feed.name}`,
          error
        );
      }
    }

    return articles;
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

  private async extractOgImage(url: string): Promise<string> {
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
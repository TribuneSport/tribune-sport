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

  "media:content"?: {
    url?: string;
    $?: {
      url?: string;
    };
  };

  "media:thumbnail"?: {
    url?: string;
    $?: {
      url?: string;
    };
  };

  "media:group"?: {
    "media:content"?: {
      url?: string;
      $?: {
        url?: string;
      };
    };
  };

  image?: {
    url?: string;
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
      ["media:group", "mediaGroup", { keepArray: false }],
    ],
  },
});

export class RSSService {
  async getSources(): Promise<RSSArticle[]> {
    const feeds: RSSFeed[] = [
      {
        name: "RMC Sport",
        club: "Football",
        url: "https://rmcsport.bfmtv.com/rss/football/",
      },
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

          /*
           * Si le flux RSS ne fournit pas directement l'image,
           * on récupère l'image Open Graph de la page.
           */
          if (!image) {
            image = await this.extractOgImage(link);
          }

          /*
           * Certaines images sont encodées dans le contenu HTML
           * de l'article RSS.
           */
          if (!image) {
            image = this.extractImageFromHtml(
              item.content || ""
            );
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
    /*
     * 1. enclosure
     */
    if (item.enclosure?.url) {
      return item.enclosure.url.trim();
    }

    /*
     * 2. media:content
     */
    if (item.mediaContent?.url) {
      return item.mediaContent.url.trim();
    }

    if (item.mediaContent?.$?.url) {
      return item.mediaContent.$.url.trim();
    }

    /*
     * 3. media:thumbnail
     */
    if (item.mediaThumbnail?.url) {
      return item.mediaThumbnail.url.trim();
    }

    if (item.mediaThumbnail?.$?.url) {
      return item.mediaThumbnail.$.url.trim();
    }

    /*
     * 4. Champs XML bruts éventuels
     */
    if (item["media:content"]?.url) {
      return item["media:content"].url.trim();
    }

    if (item["media:content"]?.$?.url) {
      return item["media:content"].$.url.trim();
    }

    if (item["media:thumbnail"]?.url) {
      return item["media:thumbnail"].url.trim();
    }

    if (item["media:thumbnail"]?.$?.url) {
      return item["media:thumbnail"].$.url.trim();
    }

    /*
     * 5. Champ image standard éventuel
     */
    if (item.image?.url) {
      return item.image.url.trim();
    }

    return "";
  }

  private extractImageFromHtml(html: string): string {
    if (!html) {
      return "";
    }

    /*
     * <img src="...">
     */
    const imgMatch =
      html.match(
        /<img[^>]+src=["']([^"']+)["']/i
      );

    if (imgMatch?.[1]) {
      return this.cleanImageUrl(imgMatch[1]);
    }

    /*
     * data-src="..."
     */
    const dataSrcMatch =
      html.match(
        /data-src=["']([^"']+)["']/i
      );

    if (dataSrcMatch?.[1]) {
      return this.cleanImageUrl(dataSrcMatch[1]);
    }

    /*
     * srcset="..."
     */
    const srcsetMatch =
      html.match(
        /srcset=["']([^"']+)["']/i
      );

    if (srcsetMatch?.[1]) {
      const firstImage =
        srcsetMatch[1]
          .split(",")[0]
          ?.trim()
          ?.split(" ")[0];

      if (firstImage) {
        return this.cleanImageUrl(firstImage);
      }
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
          Accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
        },
        cache: "no-store",
      });

      if (!response.ok) {
        return "";
      }

      const html = await response.text();

      /*
       * og:image avec property avant content
       */
      const propertyFirst =
        html.match(
          /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i
        );

      if (propertyFirst?.[1]) {
        return this.cleanImageUrl(
          propertyFirst[1]
        );
      }

      /*
       * og:image avec content avant property
       */
      const contentFirst =
        html.match(
          /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i
        );

      if (contentFirst?.[1]) {
        return this.cleanImageUrl(
          contentFirst[1]
        );
      }

      /*
       * Twitter image
       */
      const twitterImage =
        html.match(
          /<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["']/i
        );

      if (twitterImage?.[1]) {
        return this.cleanImageUrl(
          twitterImage[1]
        );
      }

      /*
       * Variante content avant name
       */
      const twitterImageReverse =
        html.match(
          /<meta[^>]+content=["']([^"']+)["'][^>]+name=["']twitter:image["']/i
        );

      if (twitterImageReverse?.[1]) {
        return this.cleanImageUrl(
          twitterImageReverse[1]
        );
      }

      return "";
    } catch {
      return "";
    }
  }

  private cleanImageUrl(
    value: string
  ): string {
    try {
      const decoded =
        value
          .replace(/&amp;/g, "&")
          .replace(/&quot;/g, '"')
          .replace(/&#39;/g, "'")
          .trim();

      if (
        decoded.startsWith("http://") ||
        decoded.startsWith("https://")
      ) {
        return decoded;
      }

      return "";
    } catch {
      return "";
    }
  }
}
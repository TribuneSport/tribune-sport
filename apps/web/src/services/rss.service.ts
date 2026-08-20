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

  image?: {
    url?: string;
  };
};

type RSSFeed = {
  name: string;
  club: string;
  url: string;
  priority: "France" | "Francophone";
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
    /*
     * ============================================================
     * SOURCES RSS
     * ============================================================
     *
     * PRIORITÉ 1 :
     * Médias français
     *
     * PRIORITÉ 2 :
     * Médias francophones internationaux
     *
     * L'ordre est volontaire :
     * les sources françaises sont interrogées en premier.
     */

    const feeds: RSSFeed[] = [
      /*
       * ============================================================
       * 🇫🇷 FRANCE — PRIORITÉ
       * ============================================================
       */

      {
        name: "RMC Sport",
        club: "Football",
        url: "https://rmcsport.bfmtv.com/rss/football/",
        priority: "France",
      },

      {
        name: "L'Équipe",
        club: "Football",
        url: "https://dwh.lequipe.fr/api/edito/rss?path=/Football/",
        priority: "France",
      },

      {
        name: "Le Figaro Football",
        club: "Football",
        url: "https://www.lefigaro.fr/rss/figaro_football.xml",
        priority: "France",
      },

      {
        name: "FootMercato",
        club: "Football",
        url: "https://www.footmercato.net/rss",
        priority: "France",
      },

      {
        name: "Foot National Ligue 1",
        club: "Ligue 1",
        url: "https://www.foot-national.com/rss/ligue-1.html",
        priority: "France",
      },

      {
        name: "Foot National Ligue 2",
        club: "Ligue 2",
        url: "https://www.foot-national.com/rss/ligue-2.html",
        priority: "France",
      },

      {
        name: "La Dépêche Football",
        club: "Football",
        url: "https://www.ladepeche.fr/sport/football/rss.xml",
        priority: "France",
      },

      {
        name: "L'Indépendant Football",
        club: "Football",
        url: "https://www.lindependant.fr/sport/football/rss.xml",
        priority: "France",
      },

      {
        name: "Midi Libre Football",
        club: "Football",
        url: "https://www.midilibre.fr/sport/football/rss.xml",
        priority: "France",
      },

      {
        name: "Sud Ouest Football",
        club: "Football",
        url: "https://www.sudouest.fr/sport/football/rss.xml",
        priority: "France",
      },

      {
        name: "Lyon Foot",
        club: "Football",
        url: "https://www.lyonfoot.com/rss",
        priority: "France",
      },

      {
        name: "Football Club Marseille",
        club: "OM",
        url: "https://www.footballclubdemarseille.fr/feed",
        priority: "France",
      },

      {
        name: "Foot en France",
        club: "Football",
        url: "https://www.footenfrance.fr/xml/syndication.rss",
        priority: "France",
      },

      {
        name: "Dico du Sport",
        club: "Football",
        url: "https://dicodusport.fr/blog/actualites/football/feed/",
        priority: "France",
      },

      {
        name: "Sports.fr",
        club: "Football",
        url: "https://www.sports.fr/football/feed",
        priority: "France",
      },

      {
        name: "Sport.fr",
        club: "Football",
        url: "https://www.sport.fr/category/football/feed",
        priority: "France",
      },

      {
        name: "Afrik-Foot",
        club: "Football Afrique",
        url: "https://www.afrik-foot.com/feed",
        priority: "France",
      },

      {
        name: "Foot Afrique 24",
        club: "Football Afrique",
        url: "https://footafrique24.com/feed/",
        priority: "France",
      },

      /*
       * ============================================================
       * 🌍 FRANCOPHONE INTERNATIONAL
       * ============================================================
       */

      {
        name: "RFI Football",
        club: "International",
        url: "https://www.rfi.fr/fr/tag/football/rss",
        priority: "Francophone",
      },

      {
        name: "RFI Afrique Football",
        club: "Afrique",
        url: "https://www.rfi.fr/fr/afrique-foot/rss",
        priority: "Francophone",
      },

      {
        name: "RTS Football",
        club: "Suisse",
        url: "https://www.rts.ch/sport/football/?format=rss/news",
        priority: "Francophone",
      },

      {
        name: "Radio-Canada Soccer",
        club: "Canada",
        url: "https://ici.radio-canada.ca/info/rss/sous-theme/soccer",
        priority: "Francophone",
      },

      {
        name: "7sur7 Football",
        club: "Belgique",
        url: "https://www.7sur7.be/football/rss.xml",
        priority: "Francophone",
      },

      {
        name: "7sur7 Football belge",
        club: "Belgique",
        url: "https://www.7sur7.be/football-belge/rss.xml",
        priority: "Francophone",
      },

      {
        name: "7sur7 Football étranger",
        club: "International",
        url: "https://www.7sur7.be/football-etranger/rss.xml",
        priority: "Francophone",
      },

      {
        name: "7sur7 Diables Rouges",
        club: "Belgique",
        url: "https://www.7sur7.be/diables-rouges/rss.xml",
        priority: "Francophone",
      },

      {
        name: "La Presse Soccer",
        club: "Canada",
        url: "https://www.lapresse.ca/sports/soccer/rss",
        priority: "Francophone",
      },

      {
        name: "RTL Info Football",
        club: "Belgique",
        url: "http://feeds.feedburner.com/rtlsport/football?format=xml",
        priority: "Francophone",
      },

      {
        name: "L'Essentiel Football",
        club: "Luxembourg",
        url: "https://partner-feeds.lessentiel.lu/rss/lessentiel-fr/sports/football",
        priority: "Francophone",
      },

      /*
       * ============================================================
       * 🌍 INTERNATIONAL — SOURCES COMPLÉMENTAIRES
       * ============================================================
       */

      {
        name: "UEFA",
        club: "UEFA",
        url: "https://www.uefa.com/rssfeed/news/rss.xml",
        priority: "Francophone",
      },

      {
        name: "BBC Sport Football",
        club: "International",
        url: "https://feeds.bbci.co.uk/sport/football/rss.xml",
        priority: "Francophone",
      },

      {
        name: "The Guardian Football",
        club: "International",
        url: "https://www.theguardian.com/football/rss",
        priority: "Francophone",
      },
    ];

    const articles: RSSArticle[] = [];

    /*
     * ============================================================
     * IMPORT DES FLUX
     * ============================================================
     */

    for (const feed of feeds) {
      try {
        console.log(
          `📡 RSS [${feed.priority}] : ${feed.name}`
        );

        const rss = await parser.parseURL(feed.url);

        console.log(
          `   → ${rss.items.length} éléments récupérés`
        );

        for (const item of rss.items) {
          const title =
            item.title?.trim() ?? "";

          const link =
            item.link?.trim() ?? "";

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

          /*
           * --------------------------------------------------------
           * IMAGE
           * --------------------------------------------------------
           */

          let image =
            this.extractImage(item);

          /*
           * Image dans le HTML RSS
           */
          if (!image) {
            image =
              this.extractImageFromHtml(
                item.content || ""
              );
          }

          /*
           * Image Open Graph
           */
          if (!image) {
            image =
              await this.extractOgImage(link);
          }

          articles.push({
            club: feed.club,
            sourceName: feed.name,
            title,
            description,
            content,
            link,
            pubDate:
              item.pubDate ?? "",
            image,
          });
        }
      } catch (error) {
        /*
         * Une source qui tombe ne doit jamais
         * bloquer les autres sources.
         */

        console.error(
          `❌ Impossible de récupérer le flux RSS : ${feed.name}`,
          error
        );
      }
    }

    console.log(
      `📰 Total articles RSS récupérés : ${articles.length}`
    );

    return articles;
  }

  /*
   * ============================================================
   * EXTRACTION IMAGE RSS
   * ============================================================
   */

  private extractImage(
    item: RSSItem
  ): string {
    /*
     * 1. enclosure
     */

    if (item.enclosure?.url) {
      return this.cleanImageUrl(
        item.enclosure.url
      );
    }

    /*
     * 2. media:content
     */

    if (item.mediaContent?.url) {
      return this.cleanImageUrl(
        item.mediaContent.url
      );
    }

    if (item.mediaContent?.$?.url) {
      return this.cleanImageUrl(
        item.mediaContent.$.url
      );
    }

    /*
     * 3. media:thumbnail
     */

    if (item.mediaThumbnail?.url) {
      return this.cleanImageUrl(
        item.mediaThumbnail.url
      );
    }

    if (item.mediaThumbnail?.$?.url) {
      return this.cleanImageUrl(
        item.mediaThumbnail.$.url
      );
    }

    /*
     * 4. XML brut
     */

    if (item["media:content"]?.url) {
      return this.cleanImageUrl(
        item["media:content"].url
      );
    }

    if (item["media:content"]?.$?.url) {
      return this.cleanImageUrl(
        item["media:content"].$.url
      );
    }

    if (item["media:thumbnail"]?.url) {
      return this.cleanImageUrl(
        item["media:thumbnail"].url
      );
    }

    if (item["media:thumbnail"]?.$?.url) {
      return this.cleanImageUrl(
        item["media:thumbnail"].$.url
      );
    }

    /*
     * 5. Champ image
     */

    if (item.image?.url) {
      return this.cleanImageUrl(
        item.image.url
      );
    }

    return "";
  }

  /*
   * ============================================================
   * IMAGE DANS HTML RSS
   * ============================================================
   */

  private extractImageFromHtml(
    html: string
  ): string {
    if (!html) {
      return "";
    }

    /*
     * src=""
     */

    const imgMatch =
      html.match(
        /<img[^>]+src=["']([^"']+)["']/i
      );

    if (imgMatch?.[1]) {
      return this.cleanImageUrl(
        imgMatch[1]
      );
    }

    /*
     * data-src=""
     */

    const dataSrcMatch =
      html.match(
        /data-src=["']([^"']+)["']/i
      );

    if (dataSrcMatch?.[1]) {
      return this.cleanImageUrl(
        dataSrcMatch[1]
      );
    }

    /*
     * srcset=""
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
        return this.cleanImageUrl(
          firstImage
        );
      }
    }

    return "";
  }

  /*
   * ============================================================
   * IMAGE OPEN GRAPH
   * ============================================================
   */

  private async extractOgImage(
    url: string
  ): Promise<string> {
    try {
      const response =
        await fetch(url, {
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

      const html =
        await response.text();

      /*
       * og:image
       * property → content
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
       * og:image
       * content → property
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
       * Twitter image
       * content → name
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

  /*
   * ============================================================
   * NETTOYAGE URL IMAGE
   * ============================================================
   */

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
        decoded.startsWith(
          "http://"
        ) ||
        decoded.startsWith(
          "https://"
        )
      ) {
        return decoded;
      }

      return "";
    } catch {
      return "";
    }
  }
}
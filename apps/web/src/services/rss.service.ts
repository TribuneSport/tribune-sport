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

const parser = new Parser<{}, RSSItem>({
  customFields: {
    item: [
      ["media:content", "mediaContent", { keepArray: false }],
      ["media:thumbnail", "mediaThumbnail", { keepArray: false }],
    ],
  },
});

export class RSSService {
  async getSources() {
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

    const articles: Array<{
      club: string;
      sourceName: string;
      title: string;
      description: string;
      link: string;
      pubDate: string;
      image: string;
    }> = [];

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

          const image = this.extractImage(item);

          articles.push({
            club: feed.club,
            sourceName: feed.name,
            title,
            description,
            link,
            pubDate: item.pubDate ?? "",
            image,
          });
        }
      } catch (error) {
        console.error(
          `❌ Flux RSS indisponible : ${feed.name}`,
          error
        );
      }
    }

    console.log(
      `📰 Total RSS récupéré : ${articles.length} articles`
    );

    return articles;
  }

  private extractImage(item: RSSItem): string {
    if (item.mediaContent?.$?.url) {
      return item.mediaContent.$.url;
    }

    if (item.mediaContent?.url) {
      return item.mediaContent.url;
    }

    if (item.mediaThumbnail?.$?.url) {
      return item.mediaThumbnail.$.url;
    }

    if (item.mediaThumbnail?.url) {
      return item.mediaThumbnail.url;
    }

    if (item.enclosure?.url) {
      return item.enclosure.url;
    }

    return "";
  }
}
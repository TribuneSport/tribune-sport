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
};

type RSSFeed = {
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
        club: "Football",
        url: "https://www.lefigaro.fr/rss/figaro_football.xml",
      },

      {
        club: "Football",
        url: "https://feeds.bbci.co.uk/sport/football/rss.xml",
      },

      {
        club: "Football",
        url: "https://www.theguardian.com/football/rss",
      },

      {
        club: "UEFA",
        url: "https://www.uefa.com/rssfeed/news/rss.xml",
      },
    ];

    const articles: any[] = [];

    for (const feed of feeds) {
      try {
        const rss = await parser.parseURL(feed.url);

        for (const item of rss.items) {
          const mediaContent = (item as any).mediaContent;
          const mediaThumbnail = (item as any).mediaThumbnail;

          let image = "";

          if (mediaContent?.$?.url) {
            image = mediaContent.$.url;
          } else if (mediaContent?.url) {
            image = mediaContent.url;
          } else if (mediaThumbnail?.$?.url) {
            image = mediaThumbnail.$.url;
          } else if (mediaThumbnail?.url) {
            image = mediaThumbnail.url;
          } else if (item.enclosure?.url) {
            image = item.enclosure.url;
          }

          articles.push({
            club: feed.club,

            title: item.title ?? "",

            description:
              item.contentSnippet ??
              item.content ??
              "",

            link: item.link ?? "",

            pubDate: item.pubDate ?? "",

            image,
          });
        }
      } catch (e) {
        console.error(
          "Flux RSS indisponible :",
          feed.url,
          e
        );
      }
    }

    return articles;
  }
}
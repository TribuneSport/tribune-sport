import Parser from "rss-parser";

const parser = new Parser();

export class RSSService {

  async getSources() {

    const feeds = [

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

          articles.push({

            club: feed.club,

            title: item.title ?? "",

            description: item.contentSnippet ?? item.content ?? "",

            link: item.link ?? "",

            pubDate: item.pubDate ?? "",

          });

        }

      } catch (e) {

        console.error("Flux RSS indisponible :", feed.url);

      }

    }

    return articles;

  }

}
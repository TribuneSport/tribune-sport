import { RSSAgent } from "./rss/RSSAgent";
import { CleaningAgent } from "./cleaning/CleaningAgent";
import { EntityAgent } from "./entity/EntityAgent";
import { NewsAgent } from "./news/NewsAgent";
import { SEOAgent } from "./seo/SEOAgent";
import { PublishAgent } from "./publish/PublishAgent";

export class Scheduler {
  async run() {
    console.log("================================");
    console.log("Tribune Foot");
    console.log("Pipeline Football");
    console.log("================================");

    const rss = new RSSAgent();
    const imported = await rss.execute();

    const cleaning = new CleaningAgent();
    const cleaned = await cleaning.execute();

    const entity = new EntityAgent();
    const linked = await entity.execute();

    const news = new NewsAgent();
    const rewritten = await news.execute();

    const seo = new SEOAgent();
    const optimized = await seo.execute();

    const publish = new PublishAgent();
    const published = await publish.execute();

    console.log("================================");
    console.log(
      `Pipeline terminé. RSS=${imported} | Nettoyage=${cleaned} | Entités=${linked} | Ollama=${rewritten} | SEO=${optimized} | Publiés=${published}`
    );
    console.log("================================");

    return {
      imported,
      cleaned,
      rewritten,
      linked,
      optimized,
      published,
    };
  }
}
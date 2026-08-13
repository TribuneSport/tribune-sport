import { RSSAgent } from "./rss/RSSAgent";
import { CleaningAgent } from "./cleaning/CleaningAgent";
import { EntityAgent } from "./entity/EntityAgent";
import { SEOAgent } from "./seo/SEOAgent";
import { PublishAgent } from "./publish/PublishAgent";

export class Scheduler {
  async run() {
    console.log("================================");
    console.log("TRIBUNE SPORT");
    console.log("Pipeline Football");
    console.log("================================");

    const rss = new RSSAgent();
    const imported = await rss.execute();

    const cleaning = new CleaningAgent();
    const cleaned = await cleaning.execute();

    const entity = new EntityAgent();
    const linked = await entity.execute();

    const seo = new SEOAgent();
    const optimized = await seo.execute();

    const publish = new PublishAgent();
    const published = await publish.execute();

    console.log("================================");

    return {
      imported,
      cleaned,
      linked,
      optimized,
      published,
    };
  }
}
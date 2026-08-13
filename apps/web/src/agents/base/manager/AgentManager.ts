import { BaseAgent } from "../BaseAgent";
import { RSSAgent } from "../../rss/RSSAgent";
import { CleaningAgent } from "../../cleaning/CleaningAgent";
import { EntityAgent } from "../../entity/EntityAgent";
import { SEOAgent } from "../../seo/SEOAgent";
import { PublishAgent } from "../../publish/PublishAgent";

export class AgentManager extends BaseAgent {
  constructor() {
    super("AgentManager");
  }

  async execute(): Promise<number> {
    this.log("Démarrage du pipeline...");

    const rss = new RSSAgent();
    const imported = await rss.execute();

    const cleaning = new CleaningAgent();
    await cleaning.execute();

    const entity = new EntityAgent();
    await entity.execute();

    const seo = new SEOAgent();
    await seo.execute();

    const publish = new PublishAgent();
    await publish.execute();

    this.success("Pipeline terminé.");

    return imported;
  }
}
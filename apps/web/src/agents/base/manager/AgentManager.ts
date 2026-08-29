import { BaseAgent } from "../BaseAgent";
import { RSSAgent } from "../../rss/RSSAgent";
import { CleaningAgent } from "../../cleaning/CleaningAgent";
import { EntityAgent } from "../../entity/EntityAgent";
import { NewsAgent } from "../../news/NewsAgent";
import { SEOAgent } from "../../seo/SEOAgent";
import { PublishAgent } from "../../publish/PublishAgent";

export class AgentManager extends BaseAgent {
  constructor() {
    super("AgentManager");
  }

  async execute(): Promise<number> {
    this.log("Démarrage du pipeline éditorial...");

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

    this.success(
      `Pipeline terminé. RSS=${imported} | Nettoyage=${cleaned} | Entités=${linked} | Ollama=${rewritten} | SEO=${optimized} | Publiés=${published}`
    );

    return rewritten;
  }
}
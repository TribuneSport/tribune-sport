import { BaseAgent } from "../base/BaseAgent";
import { SourceAgent } from "../news/SourceAgent";
import { NewsAgent } from "../news/NewsAgent";

export class AgentManager extends BaseAgent {
  constructor() {
    super("AgentManager");
  }

  async execute(): Promise<void> {
    this.log("Démarrage des agents...");

    const sourceAgent = new SourceAgent();
    await sourceAgent.execute();

    const newsAgent = new NewsAgent();
    await newsAgent.execute();

    this.success("Tous les agents ont terminé leur travail.");
  }
}
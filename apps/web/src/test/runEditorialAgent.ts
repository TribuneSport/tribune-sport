import { NewsAgentService } from "../services/news-agent.service";

async function main() {
  console.log("================================");
  console.log("TRIBUNE FOOT");
  console.log("TEST AGENT ÉDITORIAL OLLAMA");
  console.log("================================");

  try {
    const agent = new NewsAgentService();

    const processed = await agent.process();

    console.log("--------------------------------");
    console.log(`Articles générés : ${processed}`);
    console.log("--------------------------------");
  } catch (error) {
    console.error("❌ Erreur agent éditorial :", error);
    process.exit(1);
  }
}

main();
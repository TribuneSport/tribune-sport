import { AgentManager } from "@/agents/manager/AgentManager";

async function main() {
  const manager = new AgentManager();

  await manager.execute();
}

main();
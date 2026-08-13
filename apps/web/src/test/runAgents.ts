import { AgentManager } from "@/agents/base/manager/AgentManager";

async function main() {
  const manager = new AgentManager();
  await manager.execute();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
import { Scheduler } from "@/agents/Scheduler";

export class SchedulerService {
  private timer: NodeJS.Timeout | null = null;

  start(intervalMinutes = 15) {
    if (this.timer) return;

    const scheduler = new Scheduler();

    this.timer = setInterval(async () => {
      console.log("=== Nouveau cycle IA ===");
      await scheduler.run();
    }, intervalMinutes * 60 * 1000);

    console.log(
      `Scheduler démarré (${intervalMinutes} minutes).`
    );
  }

  stop() {
    if (!this.timer) return;

    clearInterval(this.timer);
    this.timer = null;

    console.log("Scheduler arrêté.");
  }
}
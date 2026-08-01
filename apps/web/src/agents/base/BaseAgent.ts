export abstract class BaseAgent {
  protected readonly name: string;

  constructor(name: string) {
    this.name = name;
  }

  protected log(message: string) {
    console.log(`[${this.name}] ${message}`);
  }

  protected success(message: string) {
    console.log(`✅ [${this.name}] ${message}`);
  }

  protected error(message: string) {
    console.error(`❌ [${this.name}] ${message}`);
  }

  abstract execute(): Promise<void>;
}
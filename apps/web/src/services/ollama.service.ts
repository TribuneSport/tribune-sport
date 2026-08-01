export class OllamaService {
  private readonly url = "http://localhost:11434/api/generate";

  async generate(prompt: string): Promise<string> {
    try {
      const response = await fetch(this.url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama3.2",
          prompt,
          stream: false,
        }),
      });

      if (!response.ok) {
        throw new Error("Impossible de contacter Ollama");
      }

      const data = await response.json();

      return data.response ?? "";
    } catch (error) {
      console.error("Erreur Ollama :", error);

      return "";
    }
  }
}
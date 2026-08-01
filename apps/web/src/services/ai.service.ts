import { articlePrompt } from "@/prompts/article.prompt";
import { OllamaService } from "./ollama.service";

export interface RewriteArticleInput {
  title: string;
  summary: string;
  content: string;
}

export interface RewriteArticleOutput {
  title: string;
  summary: string;
  content: string;
}

export class AIService {
  private ollama = new OllamaService();

  async rewriteArticle(
    article: RewriteArticleInput
  ): Promise<RewriteArticleOutput> {

    const prompt = articlePrompt(
      article.title,
      article.content
    );

    const rewritten = await this.ollama.generate(prompt);

    if (!rewritten) {
      return {
        title: article.title,
        summary: article.summary,
        content: article.content,
      };
    }

    return {
      title: article.title,
      summary: article.summary,
      content: rewritten,
    };
  }
}
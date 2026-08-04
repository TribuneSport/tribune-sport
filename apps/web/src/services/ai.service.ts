import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export class AIService {
  async rewriteArticle(article: {
    title: string;
    content: string;
    category: string;
  }) {
    const prompt = `
Tu es journaliste sportif.

Réécris entièrement cet article.

Consignes :

- ne copie jamais les phrases
- garde uniquement les faits
- écris dans un style journalistique
- améliore le titre
- écris un résumé
- écris un article complet
- optimise le référencement SEO

Retourne uniquement du JSON.

Format :

{
"title":"",
"summary":"",
"content":"",
"seoTitle":"",
"seoDescription":""
}

Titre :

${article.title}

Article :

${article.content}
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-5",
      temperature: 0.5,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const text = completion.choices[0].message.content;

    if (!text) {
      throw new Error("Réponse IA vide");
    }

    return JSON.parse(text);
  }
}
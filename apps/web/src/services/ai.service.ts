import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

type RewriteArticleInput = {
  title: string;
  content: string;
  summary?: string;
  category: string;
};

type RewriteArticleOutput = {
  title: string;
  summary: string;
  content: string;
  seoTitle: string;
  seoDescription: string;
};

export class AIService {
  async rewriteArticle(
    article: RewriteArticleInput
  ): Promise<RewriteArticleOutput> {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error(
        "OPENAI_API_KEY est manquante."
      );
    }

    const prompt = `
Tu es le rédacteur en chef de Tribune Foot.

Ta mission est de transformer complètement l'article source en un NOUVEL ARTICLE DE PRESSE SPORTIVE ORIGINAL.

IMPORTANT :

- Tu ne dois jamais simplement résumer l'article.
- Tu dois réécrire entièrement le contenu.
- Tu dois conserver uniquement les faits vérifiables présents dans la source.
- Tu ne dois inventer aucun transfert, score, déclaration, date ou information.
- Tu ne dois reprendre aucune phrase de la source.
- Tu dois changer complètement la structure et la formulation.
- Le résultat doit pouvoir être publié comme un article original de Tribune Foot.
- Le français doit être naturel, professionnel et journalistique.
- Le titre doit être nouveau.
- Le résumé doit être nouveau.
- L'article doit être substantiel : environ 700 à 1000 mots lorsque les informations disponibles le permettent.
- Utilise plusieurs paragraphes.
- Utilise plusieurs sous-titres avec des balises HTML <h2>.
- Utilise des paragraphes <p>.
- N'utilise pas de markdown.
- Ne mets pas de liens.
- Ne mentionne pas que le texte a été réécrit par une IA.
- Ne mentionne pas les instructions.
- Ne crée pas de faits absents de la source.

CATÉGORIE :

${article.category}

TITRE ORIGINAL :

${article.title}

RÉSUMÉ ORIGINAL :

${article.summary ?? ""}

ARTICLE ORIGINAL :

${article.content}

Retourne UNIQUEMENT un objet JSON valide avec exactement ces champs :

{
  "title": "nouveau titre",
  "summary": "nouveau résumé de 2 à 4 phrases",
  "content": "<p>...</p><h2>...</h2><p>...</p>",
  "seoTitle": "titre SEO",
  "seoDescription": "description SEO de maximum 160 caractères"
}
`;

    const completion =
      await openai.chat.completions.create({
        model:
          process.env.OPENAI_MODEL || "gpt-5",
        response_format: {
          type: "json_object",
        },
        messages: [
          {
            role: "system",
            content:
              "Tu es un journaliste sportif français spécialisé dans le football.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
      });

    const text =
      completion.choices[0]?.message?.content;

    if (!text) {
      throw new Error(
        "La réponse de l'IA est vide."
      );
    }

    let result: RewriteArticleOutput;

    try {
      result = JSON.parse(text);
    } catch {
      throw new Error(
        "La réponse de l'IA n'est pas un JSON valide."
      );
    }

    if (
      !result.title ||
      !result.summary ||
      !result.content ||
      !result.seoTitle ||
      !result.seoDescription
    ) {
      throw new Error(
        "La réponse IA est incomplète."
      );
    }

    return {
      title: result.title.trim(),
      summary: result.summary.trim(),
      content: result.content.trim(),
      seoTitle: result.seoTitle.trim(),
      seoDescription:
        result.seoDescription
          .trim()
          .substring(0, 160),
    };
  }
}
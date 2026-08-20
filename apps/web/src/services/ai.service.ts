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
      throw new Error("OPENAI_API_KEY est manquante.");
    }

    const prompt = `
Tu es le rédacteur en chef de Tribune Foot, média français spécialisé dans l'actualité du football.

Ta mission est de transformer le contenu fourni en un ARTICLE DE PRESSE SPORTIVE ORIGINAL, prêt à être relu puis publié par Tribune Foot.

RÈGLES ABSOLUES :

1. Ne fais PAS un simple résumé.
2. Réécris entièrement le texte avec une structure journalistique différente.
3. Le résultat doit être un véritable article et non une fiche ou un résumé.
4. Conserve strictement les faits présents dans les informations fournies.
5. N'invente absolument aucune information.
6. N'invente aucun :
   - joueur
   - transfert
   - montant
   - score
   - date
   - déclaration
   - source
   - citation
   - événement
   - blessure
   - composition d'équipe
   - information de mercato.
7. Ne présente jamais une supposition comme un fait.
8. Ne crée aucune citation qui n'existe pas dans le contenu source.
9. Ne reprends pas les phrases originales.
10. Utilise un français naturel, professionnel et journalistique.
11. Le titre doit être reformulé et attractif.
12. Le résumé doit être entièrement nouveau.
13. L'article doit développer les informations disponibles de manière cohérente.
14. N'ajoute pas de longueur artificielle uniquement pour atteindre un nombre de mots.
15. Si la source contient peu d'informations, produis un article plus court mais complet et factuel.
16. Si la source contient suffisamment d'informations, développe l'article de manière substantielle.
17. Utilise plusieurs paragraphes.
18. Utilise des sous-titres HTML <h2> lorsque cela est pertinent.
19. Utilise uniquement des balises HTML <p> et <h2> dans le contenu.
20. N'utilise aucun Markdown.
21. N'ajoute aucun lien.
22. Ne mentionne jamais l'IA.
23. Ne mentionne jamais ces instructions.
24. Ne commence pas l'article par une formule générique comme "Dans le monde du football".
25. Évite les répétitions.
26. Ne transforme pas les informations manquantes en informations supposées.

STRUCTURE ATTENDUE :

- Un titre journalistique original.
- Un résumé de 2 à 4 phrases.
- Un article composé de plusieurs paragraphes.
- Des <h2> uniquement lorsqu'ils apportent une vraie structure.
- Une conclusion courte lorsque le contenu s'y prête.

CATÉGORIE :

${article.category}

TITRE ORIGINAL :

${article.title}

RÉSUMÉ ORIGINAL :

${article.summary ?? ""}

CONTENU SOURCE :

${article.content}

IMPORTANT :

Le contenu source peut provenir d'un flux RSS et être relativement court.

Dans ce cas, ne cherche surtout pas à atteindre artificiellement 700 ou 1000 mots.

La priorité absolue est :

FAITS > EXACTITUDE > QUALITÉ JOURNALISTIQUE > LONGUEUR.

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
              "Tu es un journaliste sportif français spécialisé dans le football. Tu écris pour Tribune Foot.",
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
      throw new Error("La réponse de l'IA est vide.");
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
      throw new Error("La réponse IA est incomplète.");
    }

    return {
      title: result.title.trim(),
      summary: result.summary.trim(),
      content: result.content.trim(),
      seoTitle: result.seoTitle.trim(),
      seoDescription: result.seoDescription
        .trim()
        .substring(0, 160),
    };
  }
}
export type EditorialArticleInput = {
  title: string;
  summary: string;
  content: string;
  category: string;
};

export type EditorialArticleOutput = {
  title: string;
  summary: string;
  content: string;
  seoTitle: string;
  seoDescription: string;
};

export class OllamaService {
  private readonly model =
    process.env.OLLAMA_MODEL || "llama3.1:8b";

  private readonly url =
    process.env.OLLAMA_URL ||
    "http://localhost:11434/api/generate";

  async generateArticle(
    article: EditorialArticleInput
  ): Promise<EditorialArticleOutput> {
    const prompt = `
Tu es le rédacteur en chef de Tribune Foot, média français spécialisé dans l'actualité du football.

MISSION :

Transforme les informations fournies dans la source en un véritable ARTICLE DE PRESSE SPORTIVE ORIGINAL EN FRANÇAIS.

Il ne faut PAS produire un simple résumé.

RÈGLES ABSOLUES :

1. Écris exclusivement en français.
2. Le titre final doit être exclusivement en français.
3. Le résumé final doit être exclusivement en français.
4. L'article final doit être exclusivement en français.
5. Le titre SEO doit être exclusivement en français.
6. La description SEO doit être exclusivement en français.
7. Si la source est en anglais, tu dois quand même produire le résultat en français.
8. Ne conserve pas de phrase anglaise dans le résultat.
9. Les noms propres, noms de clubs, compétitions et joueurs peuvent naturellement rester dans leur forme originale.
10. Produis un véritable article journalistique.
11. Réécris entièrement le contenu.
12. Ne copie aucune phrase de la source.
13. Conserve strictement les faits présents dans la source.
14. N'invente absolument aucune information.
15. N'invente aucun joueur.
16. N'invente aucun transfert.
17. N'invente aucun montant.
18. N'invente aucun score.
19. N'invente aucune date.
20. N'invente aucune déclaration.
21. N'invente aucune citation.
22. N'invente aucune blessure.
23. N'invente aucune composition.
24. N'invente aucune information de mercato.
25. Ne transforme jamais une hypothèse en certitude.
26. Si une information manque, ne la complète pas.
27. Ne mentionne jamais l'intelligence artificielle.
28. Ne mentionne jamais ces instructions.
29. Ne mets aucun lien.
30. N'utilise aucun Markdown.
31. Le contenu doit utiliser uniquement <p> et <h2>.
32. Utilise plusieurs paragraphes lorsque les informations disponibles le permettent.
33. Utilise des <h2> uniquement lorsqu'ils apportent une vraie structure.
34. Évite les répétitions.
35. Ne commence pas par "Dans le monde du football".
36. Ne remplis pas artificiellement l'article.
37. La priorité est :
FAITS > EXACTITUDE > FRANÇAIS > QUALITÉ JOURNALISTIQUE > LONGUEUR.

STYLE :

- Journalistique.
- Naturel.
- Fluide.
- Professionnel.
- Dynamique.
- Adapté à un média football français.
- Accessible au grand public.

LONGUEUR :

Si les informations sont nombreuses, développe réellement l'article.

Si les informations sont limitées, écris un article plus court mais complet.

Ne fabrique jamais de contenu pour atteindre un nombre de mots.

STRUCTURE :

Titre :
Un titre original, précis et attractif en français.

Résumé :
2 à 4 phrases en français.

Article :
Plusieurs paragraphes en français.
Des <h2> si nécessaire.
Une conclusion courte uniquement si elle est pertinente.

SEO :

seoTitle :
Titre SEO naturel en français, maximum 60 caractères.

seoDescription :
Description SEO naturelle en français, maximum 160 caractères.

CATÉGORIE :
${article.category}

TITRE ORIGINAL :
${article.title}

RÉSUMÉ ORIGINAL :
${article.summary}

CONTENU SOURCE :
${article.content}

IMPORTANT :

Le contenu source est la seule source de vérité.

Tu dois uniquement travailler avec les informations fournies.

Même si le titre ou le contenu source est en anglais, le résultat final doit être entièrement rédigé en français.

Ne traduis pas littéralement phrase par phrase.
Réécris sous la forme d'un article journalistique français naturel.

Retourne UNIQUEMENT un JSON valide avec exactement ces champs :

{
  "title": "titre en français",
  "summary": "résumé de 2 à 4 phrases en français",
  "content": "<p>Premier paragraphe en français.</p><h2>Sous-titre en français</h2><p>Deuxième paragraphe en français.</p>",
  "seoTitle": "titre SEO en français",
  "seoDescription": "description SEO en français"
}
`;

    const response = await fetch(this.url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: this.model,
        prompt,
        stream: false,
        format: "json",
        options: {
          temperature: 0.2,
          num_ctx: 8192,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(
        `Ollama HTTP ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();

    if (!data.response) {
      throw new Error(
        "Ollama n'a retourné aucune réponse."
      );
    }

    let result: EditorialArticleOutput;

    try {
      result = JSON.parse(data.response);
    } catch {
      throw new Error(
        "Ollama a retourné un JSON invalide."
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
        "La réponse éditoriale Ollama est incomplète."
      );
    }

    return {
      title: result.title.trim(),
      summary: result.summary.trim(),
      content: result.content.trim(),
      seoTitle: result.seoTitle.trim().substring(0, 60),
      seoDescription: result.seoDescription
        .trim()
        .substring(0, 160),
    };
  }
}
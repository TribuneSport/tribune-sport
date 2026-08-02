export class OllamaService {

  async rewrite(title: string, summary: string) {

    const prompt = `
Tu es un journaliste sportif professionnel.

Réécris cet article.

Consignes :

- Français.
- Style journalistique.
- Aucun copier/coller.
- Pas de phrase inventée.
- Garde uniquement les faits.
- Corrige les fautes.
- Résumé de 2 phrases maximum.
- Termine par :
Source : média d'origine.

Titre :
${title}

Article :
${summary}
`;

    const response = await fetch("http://localhost:11434/api/generate", {

      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({

        model: "llama3.1:8b",

        prompt,

        stream: false,

      }),

    });

    const data = await response.json();

    return data.response;

  }

}
export function articlePrompt(
  title: string,
  content: string
) {
  return `
Tu es journaliste sportif.

Réécris complètement cet article.

Règles :

- ne jamais copier
- style journalistique
- SEO
- minimum 700 mots
- plusieurs paragraphes
- plusieurs sous-titres
- français

Titre :

${title}

Article :

${content}
`;
}
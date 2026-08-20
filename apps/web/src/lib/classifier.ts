type Category = {
  name: string;
  keywords: string[];
  strongKeywords?: string[];
};

const categories: Category[] = [
  {
    name: "Mercato",

    strongKeywords: [
      "mercato",
      "transfert",
      "transferts",
      "transfere",
      "transféré",
      "recrutement",
      "recrute",
      "recruter",
      "recruté",
      "signing",
      "signed",
      "loan",
      "deal",
      "agreement",
      "medical",
      "prolonge",
      "prolongation",
      "extension",
      "contrat",
      "pret",
      "prêt",
      "arrivée",
      "arrivee",
      "départ",
      "depart",
    ],

    keywords: [
      "joins",
      "join",
      "departure",
      "arrival",
      "contract",
      "recruit",
      "recrue",
      "nouvelle recrue",
      "nouveau joueur",
      "nouvel attaquant",
      "nouveau milieu",
      "nouveau defenseur",
      "nouveau gardien",
      "piste",
      "cible",
      "cible le",
      "intérêt",
      "interet",
      "négociations",
      "negociations",
    ],
  },

  {
    name: "Ligue des Champions",

    strongKeywords: [
      "ligue des champions",
      "champions league",
      "uefa champions league",
      "uefa champions",
    ],

    keywords: [
      "ucl",
      "champions",
      "phase de ligue",
      "barrages de la ligue des champions",
      "qualification ligue des champions",
    ],
  },

  {
    name: "International",

    strongKeywords: [
      "coupe du monde",
      "world cup",
      "nations league",
      "copa america",
      "coupe d'afrique des nations",
      "coupe d'afrique",
      "afcon",
    ],

    keywords: [
      "fifa",
      "international",
      "euro",
      "euro 2024",
      "euro 2028",
      "euro 2032",
      "nation league",
      "sélection",
      "selection nationale",
      "équipe nationale",
      "equipe nationale",
    ],
  },

  {
    name: "France",

    strongKeywords: [
      "ligue 1",
      "ligue1",
      "ligue 2",
      "ligue2",
      "paris saint-germain",
      "paris saint germain",
      "olympique de marseille",
      "olympique lyonnais",
      "as monaco",
      "rc lens",
      "fc metz",
      "rc strasbourg",
      "stade rennais",
      "ogc nice",
      "fc nantes",
      "losc",
    ],

    keywords: [
      "psg",
      "marseille",
      "lyon",
      "monaco",
      "lille",
      "lens",
      "rennes",
      "nice",
      "nantes",
      "montpellier",
      "strasbourg",
      "metz",
      "brest",
      "reims",
      "auxerre",
      "toulouse",
      "angers",
      "lorient",
      "saint-etienne",
      "saint etienne",
      "asse",
      "le havre",
      "havre",
      "championnat de france",
      "football français",
      "football francais",
      "coupe de france",
      "trophée des champions",
      "ligue 1+",
    ],
  },

  {
    name: "Europe",

    strongKeywords: [
      "premier league",
      "la liga",
      "laliga",
      "serie a",
      "bundesliga",
      "eredivisie",
      "primeira liga",
      "liga portugal",
      "jupiler pro league",
      "scottish premiership",
      "super lig",
      "europa league",
      "conference league",
      "uefa europa league",
      "uefa conference league",
    ],

    keywords: [
      "arsenal",
      "chelsea",
      "liverpool",
      "manchester city",
      "manchester united",
      "tottenham",
      "newcastle",
      "aston villa",
      "west ham",
      "everton",
      "brighton",
      "crystal palace",
      "fulham",
      "wolves",
      "wolverhampton",
      "nottingham forest",
      "leicester",
      "southampton",
      "leeds united",

      "real madrid",
      "real de madrid",
      "barcelona",
      "fc barcelona",
      "atletico madrid",
      "athletic bilbao",
      "sevilla",
      "valencia",
      "villarreal",

      "juventus",
      "inter milan",
      "internazionale",
      "ac milan",
      "napoli",
      "roma",
      "as roma",
      "lazio",
      "atalanta",

      "bayern",
      "bayern munich",
      "borussia dortmund",
      "dortmund",
      "bayer leverkusen",
      "leverkusen",
      "rb leipzig",

      "ajax",
      "psv",
      "feyenoord",

      "benfica",
      "porto",
      "sporting lisbon",

      "anderlecht",
      "club brugge",

      "celtic",
      "rangers",

      "galatasaray",
      "fenerbahce",
      "besiktas",
    ],
  },

  {
    name: "Classements",

    strongKeywords: [
      "classement",
      "classements",
      "standings",
      "league table",
    ],

    keywords: [
      "ranking",
      "table",
      "position au classement",
      "au classement",
      "leader du championnat",
      "leader",
    ],
  },
];

function normalize(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[’]/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function containsKeyword(
  text: string,
  keyword: string
): boolean {
  const normalizedKeyword = normalize(keyword);

  if (!normalizedKeyword) {
    return false;
  }

  /*
   * Pour les mots courts, on utilise des limites
   * de mots afin d'éviter les faux positifs.
   */
  if (normalizedKeyword.length <= 4) {
    const escaped = normalizedKeyword.replace(
      /[.*+?^${}()|[\]\\]/g,
      "\\$&"
    );

    const regex = new RegExp(
      `(^|\\s|[^a-z0-9])${escaped}($|\\s|[^a-z0-9])`,
      "i"
    );

    return regex.test(text);
  }

  return text.includes(normalizedKeyword);
}

export function detectCategory(
  title: string,
  summary: string
): string {
  const titleText = normalize(title);
  const summaryText = normalize(summary);

  const fullText =
    `${titleText} ${summaryText}`.trim();

  const scores: Record<string, number> = {};

  for (const category of categories) {
    let score = 0;

    /*
     * Les mots trouvés dans le titre ont davantage
     * d'importance que ceux trouvés dans le résumé.
     */

    for (const keyword of category.strongKeywords ?? []) {
      if (containsKeyword(titleText, keyword)) {
        score += 10;
      }

      if (containsKeyword(summaryText, keyword)) {
        score += 5;
      }
    }

    for (const keyword of category.keywords) {
      if (containsKeyword(titleText, keyword)) {
        score += 4;
      }

      if (containsKeyword(summaryText, keyword)) {
        score += 2;
      }
    }

    scores[category.name] = score;
  }

  /*
   * ---------------------------------------------------------
   * PRIORITÉS ÉDITORIALES
   * ---------------------------------------------------------
   *
   * Certaines catégories doivent gagner même lorsqu'un
   * article contient des termes appartenant à plusieurs
   * catégories.
   */

  const mercatoScore = scores["Mercato"] ?? 0;
  const championsScore =
    scores["Ligue des Champions"] ?? 0;
  const internationalScore =
    scores["International"] ?? 0;
  const franceScore = scores["France"] ?? 0;
  const europeScore = scores["Europe"] ?? 0;
  const classementScore =
    scores["Classements"] ?? 0;

  /*
   * Mercato est prioritaire lorsqu'il est réellement
   * identifié dans le titre.
   */
  if (
    containsKeyword(titleText, "mercato") ||
    containsKeyword(titleText, "transfert") ||
    containsKeyword(titleText, "transferts") ||
    containsKeyword(titleText, "recrute") ||
    containsKeyword(titleText, "recrutement") ||
    containsKeyword(titleText, "prolonge") ||
    containsKeyword(titleText, "prolongation")
  ) {
    return "Mercato";
  }

  /*
   * Une mention explicite de la Ligue des Champions
   * doit toujours prendre cette catégorie.
   */
  if (
    containsKeyword(
      titleText,
      "ligue des champions"
    ) ||
    containsKeyword(
      titleText,
      "champions league"
    ) ||
    containsKeyword(
      titleText,
      "uefa champions league"
    )
  ) {
    return "Ligue des Champions";
  }

  /*
   * Les compétitions internationales explicites
   * passent avant Europe et France.
   */
  if (
    containsKeyword(
      titleText,
      "coupe du monde"
    ) ||
    containsKeyword(titleText, "world cup") ||
    containsKeyword(titleText, "euro") ||
    containsKeyword(
      titleText,
      "nations league"
    )
  ) {
    return "International";
  }

  /*
   * Si le titre parle explicitement de classement,
   * on utilise Classements.
   */
  if (
    containsKeyword(titleText, "classement") ||
    containsKeyword(titleText, "classements") ||
    containsKeyword(titleText, "standings") ||
    containsKeyword(titleText, "league table")
  ) {
    return "Classements";
  }

  /*
   * Ensuite on compare les scores.
   */
  const rankedCategories = [
    {
      name: "Mercato",
      score: mercatoScore,
    },
    {
      name: "Ligue des Champions",
      score: championsScore,
    },
    {
      name: "International",
      score: internationalScore,
    },
    {
      name: "France",
      score: franceScore,
    },
    {
      name: "Europe",
      score: europeScore,
    },
    {
      name: "Classements",
      score: classementScore,
    },
  ];

  rankedCategories.sort(
    (a, b) => b.score - a.score
  );

  const best = rankedCategories[0];

  if (best && best.score > 0) {
    return best.name;
  }

  /*
   * Aucun signal suffisamment fort.
   */
  return "Football";
}
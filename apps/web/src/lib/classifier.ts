type Category = {
  name: string;
  keywords: string[];
};

const categories: Category[] = [
  {
    name: "Mercato",
    keywords: [
      "transfer",
      "transfers",
      "mercato",
      "signs",
      "signed",
      "loan",
      "contract",
      "medical",
      "deal",
      "agreement",
      "joins",
      "departure",
      "arrival",
      "recruit",
      "recrute",
      "prolonge",
      "extension",
      "transfert",
      "pret",
      "prêt",
      "contrat",
      "prolongation",
      "recrutement",
    ],
  },

  {
    name: "Ligue des Champions",
    keywords: [
      "champions league",
      "uefa champions",
      "uefa champions league",
      "ucl",
      "ligue des champions",
    ],
  },

  {
    name: "International",
    keywords: [
      "world cup",
      "coupe du monde",
      "fifa",
      "international",
      "euro",
      "euro 2024",
      "euro 2028",
      "euro 2032",
      "nations league",
      "nation league",
      "copa america",
      "afcon",
      "coupe d'afrique",
      "coupe d'afrique des nations",
      "can 202",
    ],
  },

  {
    name: "Europe",
    keywords: [
      /*
       * Angleterre
       */
      "premier league",
      "premiership",
      "championship",
      "efl championship",
      "league one",
      "league two",
      "fa cup",
      "carabao cup",
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

      /*
       * Espagne
       */
      "la liga",
      "laliga",
      "real madrid",
      "real de madrid",
      "barcelona",
      "fc barcelona",
      "atletico madrid",
      "athletic bilbao",
      "sevilla",
      "valencia",
      "villarreal",

      /*
       * Italie
       */
      "serie a",
      "juventus",
      "inter milan",
      "internazionale",
      "ac milan",
      "milan",
      "napoli",
      "roma",
      "as roma",
      "lazio",
      "atalanta",

      /*
       * Allemagne
       */
      "bundesliga",
      "bayern",
      "bayern munich",
      "borussia dortmund",
      "dortmund",
      "bayer leverkusen",
      "leverkusen",
      "rb leipzig",

      /*
       * Pays-Bas
       */
      "eredivisie",
      "ajax",
      "psv",
      "feyenoord",

      /*
       * Portugal
       */
      "liga portugal",
      "primeira liga",
      "benfica",
      "porto",
      "sporting lisbon",

      /*
       * Belgique
       */
      "jupiler pro league",
      "anderlecht",
      "club brugge",

      /*
       * Écosse
       */
      "scottish premiership",
      "celtic",
      "rangers",

      /*
       * Turquie
       */
      "super lig",
      "galatasaray",
      "fenerbahce",
      "besiktas",

      /*
       * Compétitions européennes
       */
      "europa league",
      "uefa europa league",
      "conference league",
      "uefa conference league",
      "uefa",
    ],
  },

  {
    name: "France",
    keywords: [
      "ligue 1",
      "ligue1",
      "ligue 2",
      "ligue2",

      "paris saint-germain",
      "paris saint germain",
      "psg",

      "olympique de marseille",
      "marseille",

      "olympique lyonnais",
      "lyon",

      "as monaco",
      "monaco",

      "losc",
      "lille",

      "rc lens",
      "lens",

      "stade rennais",
      "rennes",

      "ogc nice",
      "nice",

      "fc nantes",
      "nantes",

      "montpellier",

      "rc strasbourg",
      "strasbourg",

      "fc metz",
      "metz",

      "stade brestois",
      "brest",

      "stade de reims",
      "reims",

      "aj auxerre",
      "auxerre",

      "toulouse fc",
      "toulouse",

      "angers sco",
      "angers",

      "fc lorient",
      "lorient",

      "saint-etienne",
      "saint etienne",
      "asse",

      "le havre",
      "havre",
    ],
  },

  {
    name: "Classements",
    keywords: [
      "standings",
      "ranking",
      "league table",
      "table",
      "classement",
      "leader",
      "classements",
    ],
  },
];

function normalize(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[’']/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function containsKeyword(text: string, keyword: string): boolean {
  const normalizedKeyword = normalize(keyword);

  /*
   * Pour les termes très courts, on exige des limites de mots.
   */
  if (normalizedKeyword.length <= 3) {
    const regex = new RegExp(
      `(^|\\s)${normalizedKeyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}($|\\s)`,
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
  const text = normalize(`${title} ${summary}`);

  /*
   * Priorité :
   * 1. Mercato
   * 2. Ligue des Champions
   * 3. International
   * 4. Europe
   * 5. France
   * 6. Classements
   */
  for (const category of categories) {
    const found = category.keywords.some((keyword) =>
      containsKeyword(text, keyword)
    );

    if (found) {
      return category.name;
    }
  }

  return "Football";
}
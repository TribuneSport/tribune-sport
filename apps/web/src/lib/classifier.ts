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
    name: "France",
    keywords: [
      "ligue 1",
      "ligue1",
      "l1",

      "psg",
      "paris saint-germain",
      "paris saint germain",

      "marseille",
      "olympique de marseille",
      "om",

      "lyon",
      "olympique lyonnais",

      "monaco",
      "as monaco",

      "lille",
      "losc",

      "lens",
      "rc lens",

      "rennes",
      "stade rennais",

      "nice",
      "ogc nice",

      "nantes",
      "fc nantes",

      "montpellier",
      "strasbourg",
      "rc strasbourg",

      "metz",
      "fc metz",

      "brest",
      "stade brestois",

      "reims",
      "stade de reims",

      "auxerre",
      "aj auxerre",

      "toulouse",
      "tfc",

      "angers",
      "lorient",

      "saint-etienne",
      "saint etienne",
      "asse",

      "le havre",
      "havre",
    ],
  },

  {
    name: "Europe",
    keywords: [
      "premier league",

      "arsenal",
      "chelsea",
      "liverpool",
      "manchester city",
      "manchester united",
      "tottenham",
      "newcastle",
      "aston villa",

      "real madrid",
      "real de madrid",
      "barcelona",
      "fc barcelona",
      "atletico madrid",

      "juventus",
      "inter milan",
      "inter",
      "ac milan",
      "napoli",
      "roma",
      "lazio",

      "bayern",
      "bayern munich",
      "bayern munich",
      "dortmund",
      "borussia dortmund",
      "leverkusen",
      "bayer leverkusen",

      "bundesliga",
      "serie a",
      "la liga",
      "liga",
      "eredivisie",
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
      "euro 202",
      "nation league",
      "nations league",
      "copa america",
      "afcon",
      "can",
      "coupe d'afrique",
      "coupe d'afrique des nations",
    ],
  },

  {
    name: "Classements",
    keywords: [
      "standings",
      "ranking",
      "table",
      "classement",
      "leader",
    ],
  },
];

export function detectCategory(
  title: string,
  summary: string
): string {
  const text = `${title} ${summary}`
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  for (const category of categories) {
    if (
      category.keywords.some((keyword) =>
        text.includes(
          keyword
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
        )
      )
    ) {
      return category.name;
    }
  }

  return "Football";
}
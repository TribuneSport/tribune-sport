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
      "ucl",
      "ligue des champions",
    ],
  },

  {
    name: "Ligue 1",
    keywords: [
      "ligue 1",

      "psg",
      "paris saint-germain",

      "marseille",
      "olympique de marseille",

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

      "barcelona",

      "atletico madrid",

      "juventus",

      "inter",

      "inter milan",

      "ac milan",

      "napoli",

      "roma",

      "lazio",

      "bayern",

      "dortmund",

      "leverkusen",

      "bundesliga",

      "serie a",

      "la liga",

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
      "nation league",
      "copa america",
      "afcon",
      "can",
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

  const text =
    `${title} ${summary}`.toLowerCase();

  for (const category of categories) {

    if (
      category.keywords.some(keyword =>
        text.includes(keyword.toLowerCase())
      )
    ) {
      return category.name;
    }

  }

  return "Football";
}
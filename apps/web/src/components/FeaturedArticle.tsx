import Image from "next/image";
import Link from "next/link";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

type ScoredArticle = {
  id: number;
  title: string;
  summary: string;
  category: string;
  image: string;
  slug: string | null;
  pubDate: Date | null;
  createdAt: Date;
  views: number;
  score: number;
};

function calculateScore(article: {
  title: string;
  summary: string;
  category: string;
  image: string;
  pubDate: Date | null;
  createdAt: Date;
  views: number;
}): number {
  const now = Date.now();

  const publicationDate =
    article.pubDate?.getTime() ??
    article.createdAt.getTime();

  const ageHours = Math.max(
    0,
    (now - publicationDate) / 1000 / 60 / 60
  );

  /*
   * ---------------------------------------------------------
   * FRAÎCHEUR
   * ---------------------------------------------------------
   */

  let freshness = 0;

  if (ageHours <= 3) {
    freshness = 45;
  } else if (ageHours <= 6) {
    freshness = 40;
  } else if (ageHours <= 12) {
    freshness = 35;
  } else if (ageHours <= 24) {
    freshness = 30;
  } else if (ageHours <= 48) {
    freshness = 20;
  } else if (ageHours <= 72) {
    freshness = 10;
  } else {
    freshness = 0;
  }

  /*
   * ---------------------------------------------------------
   * IMPORTANCE DU SUJET
   * ---------------------------------------------------------
   */

  const text =
    `${article.title} ${article.summary} ${article.category}`
      .toLowerCase();

  const importantTerms = [
    "psg",
    "paris saint-germain",
    "marseille",
    "om",
    "olympique lyonnais",
    "lyon",
    "lens",
    "metz",
    "fc metz",
    "équipe de france",
    "france",
    "bleus",
    "ligue 1",
    "ligue 2",
    "champions league",
    "ligue des champions",
    "europa league",
    "conference league",
    "mercato",
    "transfert",
    "transferts",
    "sélectionneur",
    "finale",
    "demi-finale",
    "qualification",
    "qualifié",
    "titre",
    "blessure",
    "retraite",
  ];

  let importance = 0;

  for (const term of importantTerms) {
    if (text.includes(term)) {
      importance += 5;
    }
  }

  /*
   * On évite qu'un titre rempli de mots-clés
   * puisse obtenir un score déraisonnable.
   */

  importance = Math.min(35, importance);

  /*
   * ---------------------------------------------------------
   * CATÉGORIE
   * ---------------------------------------------------------
   */

  let categoryBonus = 0;

  const category = article.category.toLowerCase();

  if (
    category.includes("mercato") ||
    category.includes("france") ||
    category.includes("europe")
  ) {
    categoryBonus += 8;
  }

  /*
   * ---------------------------------------------------------
   * POPULARITÉ
   * ---------------------------------------------------------
   */

  const viewsBonus = Math.min(
    15,
    Math.floor(article.views / 10)
  );

  /*
   * ---------------------------------------------------------
   * IMAGE
   * ---------------------------------------------------------
   */

  const imageBonus =
    article.image?.trim() ? 5 : 0;

  /*
   * ---------------------------------------------------------
   * ANCIENNETÉ
   * ---------------------------------------------------------
   */

  let agePenalty = 0;

  if (ageHours > 72) {
    agePenalty = 20;
  }

  if (ageHours > 168) {
    agePenalty = 50;
  }

  /*
   * ---------------------------------------------------------
   * SCORE FINAL
   * ---------------------------------------------------------
   */

  return (
    freshness +
    importance +
    categoryBonus +
    viewsBonus +
    imageBonus -
    agePenalty
  );
}

export default async function FeaturedArticle() {
  const articles = await db.article.findMany({
    where: {
      published: true,
    },
    orderBy: [
      {
        pubDate: "desc",
      },
      {
        createdAt: "desc",
      },
    ],
    take: 30,
  });

  if (articles.length === 0) {
    return (
      <section className="flex min-h-[320px] items-center justify-center overflow-hidden rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <div className="max-w-md text-center">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-red-600">
            Tribune Foot
          </p>

          <h2 className="mt-3 text-2xl font-black tracking-tight text-slate-950 md:text-3xl">
            Aucune actualité publiée
          </h2>

          <p className="mt-3 text-sm leading-6 text-slate-500">
            Les prochaines actualités apparaîtront ici.
          </p>
        </div>
      </section>
    );
  }

  /*
   * On classe les articles localement.
   *
   * On ne dépend donc pas uniquement de createdAt.
   */

  const scoredArticles: ScoredArticle[] =
    articles
      .map((article) => ({
        ...article,
        score: calculateScore(article),
      }))
      .sort((a, b) => {
        if (b.score !== a.score) {
          return b.score - a.score;
        }

        const dateA =
          a.pubDate?.getTime() ??
          a.createdAt.getTime();

        const dateB =
          b.pubDate?.getTime() ??
          b.createdAt.getTime();

        return dateB - dateA;
      });

  const article = scoredArticles[0];

  const articleDate =
    article.pubDate ??
    article.createdAt;

  return (
    <Link
      href={`/article/${article.slug}`}
      className="group relative block min-h-[320px] overflow-hidden rounded-2xl bg-slate-950 shadow-lg ring-1 ring-black/5 sm:min-h-[340px] lg:min-h-[360px]"
    >
      <Image
        src={article.image || "/football.jpg"}
        alt={article.title}
        fill
        priority
        sizes="(max-width: 1024px) 100vw, 66vw"
        className="object-cover transition duration-700 ease-out group-hover:scale-105"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-black/5" />

      <div className="absolute inset-x-0 bottom-0 p-5 text-white sm:p-6 lg:p-7">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-red-600 px-3 py-1 text-[11px] font-black uppercase tracking-wide">
            À LA UNE
          </span>

          <span className="rounded-full bg-white/15 px-3 py-1 text-[11px] font-black uppercase tracking-wide backdrop-blur">
            {article.category}
          </span>

          <span className="text-xs font-medium text-white/80">
            {new Date(articleDate).toLocaleDateString(
              "fr-FR"
            )}
          </span>
        </div>

        <h1 className="max-w-4xl text-2xl font-black leading-[1.08] tracking-tight sm:text-3xl lg:text-4xl">
          {article.title}
        </h1>

        {article.summary && (
          <p className="mt-3 line-clamp-2 max-w-3xl text-sm leading-6 text-white/85 sm:text-base">
            {article.summary}
          </p>
        )}

        <div className="mt-4 inline-flex items-center text-xs font-black uppercase tracking-[0.12em] text-white transition group-hover:text-red-400">
          Lire l'article

          <span className="ml-2 text-base transition-transform duration-300 group-hover:translate-x-1">
            →
          </span>
        </div>
      </div>
    </Link>
  );
}
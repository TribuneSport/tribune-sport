import Link from "next/link";
import { db } from "@/lib/db";

export default async function MostRead() {
  const articles = await db.article.findMany({
    where: {
      published: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 5,
  });

  return (
    <aside className="space-y-8">

      <section className="rounded-3xl border bg-white p-6 shadow-sm">

        <h2 className="mb-6 text-2xl font-black">
          🔥 Les plus lus
        </h2>

        <div className="space-y-5">

          {articles.map((article, index) => (
            <Link
              key={article.id}
              href={`/article/${article.slug}`}
              className="group flex items-start gap-4"
            >

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-700 font-black text-white">
                {index + 1}
              </div>

              <div>

                <p className="text-xs font-bold uppercase tracking-wide text-red-700">
                  {article.category}
                </p>

                <h3 className="mt-1 font-semibold leading-6 transition group-hover:text-red-700">
                  {article.title}
                </h3>

              </div>

            </Link>
          ))}

        </div>

      </section>

      <section className="rounded-3xl border bg-white p-6 shadow-sm">

        <h2 className="mb-5 text-2xl font-black">
          📈 Tendances
        </h2>

        <div className="flex flex-wrap gap-3">

          {[
            "Mercato",
            "Ligue 1",
            "Premier League",
            "Liga",
            "Serie A",
            "Bundesliga",
            "PSG",
            "OM",
            "Real Madrid",
            "FC Barcelone",
          ].map((tag) => (
            <Link
              key={tag}
              href={`/recherche?q=${encodeURIComponent(tag)}`}
              className="rounded-full bg-gray-100 px-4 py-2 text-sm font-semibold transition hover:bg-red-700 hover:text-white"
            >
              #{tag}
            </Link>
          ))}

        </div>

      </section>

      <section className="overflow-hidden rounded-3xl bg-gradient-to-br from-red-700 via-red-600 to-red-500 p-8 text-white shadow-xl">

        <h2 className="text-3xl font-black">
          Tribune Foot
        </h2>

        <p className="mt-5 leading-8 text-red-100">
          Le média 100 % football.
          Retrouvez toute l'actualité des grands championnats,
          des compétitions européennes, du mercato et des sélections
          nationales.
        </p>

        <Link
          href="/articles"
          className="mt-8 inline-flex rounded-xl bg-white px-6 py-3 font-bold text-red-700 transition hover:bg-gray-100"
        >
          Voir toutes les actualités
        </Link>

      </section>

    </aside>
  );
}

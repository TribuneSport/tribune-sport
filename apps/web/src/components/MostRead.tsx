import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function MostRead() {
  const articles = await prisma.article.findMany({
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

      <div className="rounded-2xl bg-white p-6 shadow-lg">

        <h2 className="mb-6 text-2xl font-bold">
          🔥 Les plus lus
        </h2>

        <div className="space-y-5">

          {articles.map((article, index) => (
            <Link
              key={article.id}
              href={`/article/${article.id}`}
              className="flex items-start gap-4 group"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-red-700 font-bold text-white">
                {index + 1}
              </div>

              <div>

                <p className="text-xs font-semibold uppercase text-red-700">
                  {article.category}
                </p>

                <h3 className="mt-1 font-semibold transition group-hover:text-red-700">
                  {article.title}
                </h3>

              </div>
            </Link>
          ))}

        </div>

      </div>

      <div className="rounded-2xl bg-white p-6 shadow-lg">

        <h2 className="mb-4 text-2xl font-bold">
          📈 Tendances
        </h2>

        <div className="flex flex-wrap gap-3">

          <span className="rounded-full bg-red-100 px-4 py-2 text-sm font-semibold text-red-700">
            #Mercato
          </span>

          <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
            #PSG
          </span>

          <span className="rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-700">
            #Ligue1
          </span>

          <span className="rounded-full bg-yellow-100 px-4 py-2 text-sm font-semibold text-yellow-700">
            #ChampionsLeague
          </span>

          <span className="rounded-full bg-purple-100 px-4 py-2 text-sm font-semibold text-purple-700">
            #RealMadrid
          </span>

        </div>

      </div>

      <div className="rounded-2xl bg-gradient-to-br from-red-700 to-red-500 p-6 text-white shadow-xl">

        <h2 className="text-2xl font-bold">
          Tribune Sport
        </h2>

        <p className="mt-4 leading-7 text-red-100">
          Toute l'actualité du football français et international,
          les transferts, les résultats et les analyses en continu.
        </p>

      </div>

    </aside>
  );
}
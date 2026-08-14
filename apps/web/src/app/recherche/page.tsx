import Link from "next/link";
import Image from "next/image";
import { db } from "@/lib/db";

type Props = {
  searchParams: Promise<{
    q?: string;
  }>;
};

export default async function RecherchePage({
  searchParams,
}: Props) {
  const { q } = await searchParams;

  const articles = await db.article.findMany({
    where: q
      ? {
          published: true,
          OR: [
            {
              title: {
                contains: q,
                mode: "insensitive",
              },
            },
            {
              summary: {
                contains: q,
                mode: "insensitive",
              },
            },
            {
              content: {
                contains: q,
                mode: "insensitive",
              },
            },
            {
              category: {
                contains: q,
                mode: "insensitive",
              },
            },
          ],
        }
      : {
          published: true,
        },
    orderBy: {
      createdAt: "desc",
    },
    take: 50,
  });

  return (
    <main className="min-h-screen bg-gray-100">

      <div className="mx-auto max-w-7xl px-4 py-8">

        <header className="mb-10">

          <p className="font-bold uppercase tracking-widest text-red-600">
            Tribune Foot
          </p>

          <h1 className="mt-3 text-5xl font-black">
            Recherche
          </h1>

          <p className="mt-4 text-lg text-gray-600">
            Recherchez un club, un joueur, une compétition ou un article.
          </p>

        </header>

        <form
          action="/recherche"
          method="GET"
          className="mb-12 rounded-3xl bg-white p-6 shadow-lg"
        >

          <div className="flex flex-col gap-4 md:flex-row">

            <input
              type="text"
              name="q"
              defaultValue={q}
              placeholder="Ex : Mbappé, Ligue 1, Mercato..."
              className="flex-1 rounded-xl border border-gray-300 px-5 py-4 text-lg outline-none focus:border-red-600"
            />

            <button
              type="submit"
              className="rounded-xl bg-red-700 px-8 py-4 font-bold text-white transition hover:bg-red-800"
            >
              Rechercher
            </button>

          </div>

        </form>

        <div className="mb-8 flex items-center justify-between">

          <h2 className="text-2xl font-black">

            {q
              ? `Résultats pour "${q}"`
              : "Dernières actualités"}

          </h2>

          <span className="rounded-full bg-red-100 px-4 py-2 font-bold text-red-700">
            {articles.length} résultat{articles.length > 1 ? "s" : ""}
          </span>

        </div>

        {articles.length === 0 ? (

          <div className="rounded-3xl bg-white p-16 text-center shadow">

            <h3 className="text-3xl font-black">
              Aucun résultat
            </h3>

            <p className="mt-4 text-gray-600">
              Essayez un autre mot-clé.
            </p>

          </div>

        ) : (

          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">

            {articles.map((article) => (

              <Link
                key={article.id}
                href={`/article/${article.slug}`}
                className="group overflow-hidden rounded-3xl bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
              >

                <div className="relative h-56">

                  <Image
                    src={article.image || "/football.jpg"}
                    alt={article.title}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />

                </div>

                <div className="p-6">

                  <span className="inline-flex rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-700">
                    {article.category}
                  </span>

                  <h3 className="mt-4 text-2xl font-black leading-8">
                    {article.title}
                  </h3>

                  <p className="mt-4 line-clamp-3 text-gray-600">
                    {article.summary}
                  </p>

                  <div className="mt-6 flex items-center justify-between">

                    <span className="text-sm text-gray-500">
                      {new Date(article.createdAt).toLocaleDateString("fr-FR")}
                    </span>

                    <span className="font-bold text-red-700">
                      Lire →
                    </span>

                  </div>

                </div>

              </Link>

            ))}

          </div>

        )}

      </div>

    </main>
  );
}

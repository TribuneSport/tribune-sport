import Link from "next/link";
import { db } from "@/lib/db";
import Header from "@/components/Header";
import MostRead from "@/components/MostRead";

export const dynamic = "force-dynamic";

function ArticleImage({
  src,
  alt,
  className = "",
}: {
  src: string | null;
  alt: string;
  className?: string;
}) {
  const image = src || "/football.jpg";

  return (
    <img
      src={image}
      alt={alt}
      className={`h-full w-full object-cover ${className}`}
    />
  );
}

export default async function ArticlesPage() {
  const articles = await db.article.findMany({
    where: {
      published: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  if (articles.length === 0) {
    return (
      <main className="min-h-screen bg-gray-100">
        <Header />

        <div className="mx-auto max-w-7xl px-4 py-12">
          <p className="font-bold uppercase tracking-widest text-red-600">
            Tribune Foot
          </p>

          <h1 className="mt-3 text-4xl font-black text-gray-900">
            Toutes les actualités
          </h1>

          <p className="mt-4 text-lg text-gray-600">
            Aucun article publié pour le moment.
          </p>
        </div>
      </main>
    );
  }

  const featured = articles[0];
  const latest = articles.slice(1);

  return (
    <main className="min-h-screen bg-gray-100">
      <Header />

      <div className="mx-auto max-w-7xl px-4 py-8">
        {/* Titre */}
        <header className="mb-8">
          <p className="font-bold uppercase tracking-widest text-red-600">
            Tribune Foot
          </p>

          <h1 className="mt-2 text-4xl font-black text-gray-900 md:text-5xl">
            Toutes les actualités
          </h1>

          <p className="mt-3 text-lg text-gray-600">
            Retrouvez toute l'actualité du football français et international.
          </p>
        </header>

        {/* Contenu principal + Les plus lus */}
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
          {/* Colonne principale */}
          <section>
            {/* Article principal */}
            <article className="group relative overflow-hidden rounded-3xl bg-gray-900 shadow-xl">
              <Link href={`/article/${featured.slug}`}>
                <div className="relative h-[460px]">
                  <ArticleImage
                    src={featured.image}
                    alt={featured.title}
                    className="transition duration-700 group-hover:scale-105"
                  />

                  {/* Dégradé */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

                  {/* Contenu */}
                  <div className="absolute inset-x-0 bottom-0 p-7 text-white md:p-10">
                    <span className="inline-flex rounded-full bg-red-600 px-4 py-2 text-xs font-bold uppercase">
                      À la une
                    </span>

                    <p className="mt-4 text-xs font-bold uppercase tracking-widest text-gray-300">
                      {featured.category}
                    </p>

                    <h2 className="mt-3 max-w-4xl text-3xl font-black leading-tight md:text-4xl">
                      {featured.title}
                    </h2>

                    <p className="mt-4 max-w-3xl line-clamp-2 text-sm leading-6 text-gray-200 md:text-base">
                      {featured.summary}
                    </p>

                    <div className="mt-5 flex items-center gap-4 text-xs text-gray-300">
                      <span>
                        {new Date(featured.createdAt).toLocaleDateString(
                          "fr-FR"
                        )}
                      </span>

                      <span className="font-bold text-white">
                        Lire l'article →
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </article>

            {/* Dernières actualités */}
            <section className="mt-10">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-2xl font-black text-gray-900">
                  Dernières actualités
                </h2>

                <Link
                  href="/articles"
                  className="text-sm font-bold text-red-600 transition hover:text-red-800"
                >
                  Voir les actualités →
                </Link>
              </div>

              {latest.length === 0 ? (
                <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
                  <p className="font-bold text-gray-900">
                    Aucune autre actualité disponible.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                  {latest.map((article) => (
                    <Link
                      key={article.id}
                      href={`/article/${article.slug}`}
                      className="group overflow-hidden rounded-2xl bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
                    >
                      <div className="relative h-40 overflow-hidden">
                        <ArticleImage
                          src={article.image}
                          alt={article.title}
                          className="transition duration-500 group-hover:scale-105"
                        />

                        <div className="absolute left-3 top-3">
                          <span className="rounded-full bg-red-600 px-2.5 py-1 text-[10px] font-bold uppercase text-white">
                            {article.category}
                          </span>
                        </div>
                      </div>

                      <div className="p-4">
                        <h3 className="line-clamp-3 text-base font-black leading-5 text-gray-900 transition group-hover:text-red-600">
                          {article.title}
                        </h3>

                        <p className="mt-3 text-[11px] text-gray-400">
                          {new Date(article.createdAt).toLocaleDateString(
                            "fr-FR"
                          )}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </section>
          </section>

          {/* Colonne droite */}
          <MostRead />
        </div>
      </div>
    </main>
  );
}
import Link from "next/link";
import Image from "next/image";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

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
      <main className="bg-gray-100 min-h-screen">
        <div className="mx-auto max-w-7xl px-4 py-12">
          <h1 className="text-5xl font-black">
            Toutes les actualités
          </h1>

          <p className="mt-8 text-xl text-gray-600">
            Aucun article publié pour le moment.
          </p>
        </div>
      </main>
    );
  }

  const featured = articles[0];
  const others = articles.slice(1);

  return (
    <main className="bg-gray-100 min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-8">

        <header className="mb-10">
          <p className="font-bold uppercase tracking-widest text-red-600">
            Tribune Foot
          </p>

          <h1 className="mt-3 text-5xl font-black">
            Toutes les actualités
          </h1>

          <p className="mt-4 text-lg text-gray-600">
            Retrouvez toute l'actualité du football français et international.
          </p>
        </header>

        <section className="overflow-hidden rounded-3xl bg-white shadow-lg">
          <div className="grid lg:grid-cols-2">

            <div className="relative h-[420px]">
              <Image
                src={featured.image || "/football.jpg"}
                alt={featured.title}
                fill
                priority
                className="object-cover"
              />
            </div>

            <div className="flex flex-col justify-center p-10">

              <span className="inline-flex w-fit rounded-full bg-red-100 px-4 py-2 text-sm font-bold text-red-700">
                À la une
              </span>

              <h2 className="mt-6 text-4xl font-black leading-tight">
                {featured.title}
              </h2>

              <p className="mt-6 text-lg leading-8 text-gray-600">
                {featured.summary}
              </p>

              <Link
                href={`/article/${featured.slug}`}
                className="mt-8 inline-flex w-fit rounded-xl bg-red-700 px-8 py-4 font-bold text-white transition hover:bg-red-800"
              >
                Lire l'article
              </Link>

            </div>
          </div>
        </section>

        <section className="mt-14">

          <h2 className="mb-8 text-3xl font-black">
            Les dernières publications
          </h2>

          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">

            {others.map((article) => (

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
        </section>

      </div>
    </main>
  );
}

import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { db } from "@/lib/db";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

function slugToCategory(slug: string) {
  const map: Record<string, string> = {
    france: "France",
    mercato: "Mercato",
    europe: "Europe",
    international: "International",
    "ligue-1": "Ligue 1",
    "premier-league": "Premier League",
    liga: "Liga",
    "serie-a": "Serie A",
    bundesliga: "Bundesliga",
    "champions-league": "Champions League",
  };

  return map[slug] ?? slug.replace(/-/g, " ");
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;

  const category = slugToCategory(slug);

  const articles = await db.article.findMany({
    where: {
      published: true,
      category,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  if (articles.length === 0) {
    notFound();
  }

  const featured = articles[0];
  const others = articles.slice(1);

  return (
    <main className="bg-gray-100 min-h-screen">

      <div className="mx-auto max-w-7xl px-4 py-8">

        <Link
          href="/"
          className="inline-flex rounded-xl border bg-white px-5 py-3 font-semibold shadow-sm transition hover:bg-gray-50"
        >
          ← Retour à l'accueil
        </Link>

        <header className="mt-8 mb-10">

          <p className="text-red-600 font-bold uppercase tracking-widest">
            Catégorie
          </p>

          <h1 className="mt-2 text-5xl font-black">
            {category}
          </h1>

          <p className="mt-4 text-lg text-gray-600">
            {articles.length} article{articles.length > 1 ? "s" : ""} disponible
            {articles.length > 1 ? "s" : ""}.
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
            Tous les articles
          </h2>

          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">

            {others.map((article) => (
              <Link
                key={article.id}
                href={`/article/${article.slug}`}
                className="group overflow-hidden rounded-3xl border bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
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

                  <p className="mt-6 font-bold text-red-700">
                    Lire l'article →
                  </p>

                </div>

              </Link>
            ))}

          </div>

        </section>

      </div>

    </main>
  );
}
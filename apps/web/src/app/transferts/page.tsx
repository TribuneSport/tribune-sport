import Link from "next/link";
import Image from "next/image";
import { db } from "@/lib/db";

export default async function TransfertsPage() {
  const articles = await db.article.findMany({
    where: {
      published: true,
      OR: [
        { category: "Mercato" },
        {
          title: {
            contains: "mercato",
            mode: "insensitive",
          },
        },
        {
          summary: {
            contains: "mercato",
            mode: "insensitive",
          },
        },
      ],
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 30,
  });

  return (
    <main className="min-h-screen bg-gray-100">

      <div className="mx-auto max-w-7xl px-4 py-8">

        <header className="mb-10">

          <span className="rounded-full bg-red-100 px-4 py-2 font-bold text-red-700">
            💰 Mercato
          </span>

          <h1 className="mt-5 text-5xl font-black">
            Actualité des transferts
          </h1>

          <p className="mt-5 max-w-3xl text-lg text-gray-600">
            Retrouvez toutes les rumeurs, signatures officielles,
            prolongations de contrat et informations du marché des transferts.
          </p>

        </header>

        {articles.length === 0 ? (

          <div className="rounded-3xl bg-white p-16 text-center shadow">

            <h2 className="text-3xl font-black">
              Aucun article mercato
            </h2>

            <p className="mt-4 text-gray-600">
              Les prochains transferts apparaîtront ici.
            </p>

          </div>

        ) : (

          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">

            {articles.map((article) => (

              <Link
                key={article.id}
                href={`/article/${article.slug}`}
                className="group overflow-hidden rounded-3xl bg-white shadow transition hover:-translate-y-1 hover:shadow-xl"
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

                  <h2 className="mt-4 text-2xl font-black">
                    {article.title}
                  </h2>

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
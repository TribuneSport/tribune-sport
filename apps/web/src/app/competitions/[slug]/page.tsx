import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { footballDb } from "@/lib/football/database";

export const dynamic = "force-dynamic";

export default async function CompetitionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const competition = await footballDb.getCompetitionBySlug(slug);

  if (!competition) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-gray-100">

      <div className="mx-auto max-w-7xl px-4 py-8">

        <Link
          href="/competitions"
          className="inline-flex items-center rounded-xl bg-white px-5 py-3 shadow hover:bg-gray-50"
        >
          ← Retour aux compétitions
        </Link>

        <div className="mt-8 overflow-hidden rounded-3xl bg-white shadow-lg">

          <div className="bg-gradient-to-r from-blue-700 to-indigo-600 p-10">

            <div className="flex flex-col items-center gap-8 md:flex-row">

              <Image
                src={competition.logo || "/competition.png"}
                alt={competition.name}
                width={150}
                height={150}
                className="rounded-2xl bg-white p-4 object-contain shadow-lg"
              />

              <div className="text-white">

                <h1 className="text-5xl font-black">
                  {competition.name}
                </h1>

                <p className="mt-4 text-2xl">
                  {competition.country || "International"}
                </p>

                {competition.season && (
                  <p className="mt-2 text-blue-100">
                    Saison {competition.season}
                  </p>
                )}

              </div>

            </div>

          </div>

          <div className="grid gap-8 p-10 md:grid-cols-2">

            <div className="rounded-2xl border p-8">

              <h2 className="mb-6 text-2xl font-black">
                Informations
              </h2>

              <div className="space-y-4">

                <p>
                  <strong>Nom :</strong> {competition.name}
                </p>

                <p>
                  <strong>Pays :</strong>{" "}
                  {competition.country || "International"}
                </p>

                <p>
                  <strong>Saison :</strong>{" "}
                  {competition.season || "-"}
                </p>

              </div>

            </div>

            <div className="rounded-2xl border p-8">

              <h2 className="mb-6 text-2xl font-black">
                Statistiques
              </h2>

              <div className="grid grid-cols-2 gap-6">

                <div className="rounded-xl bg-blue-50 p-5 text-center">

                  <div className="text-3xl font-black text-blue-700">
                    {competition.articles.length}
                  </div>

                  <div className="mt-2 text-sm text-gray-600">
                    Articles
                  </div>

                </div>

                <div className="rounded-xl bg-indigo-50 p-5 text-center">

                  <div className="text-3xl font-black text-indigo-700">
                    {competition.country ? 1 : "-"}
                  </div>

                  <div className="mt-2 text-sm text-gray-600">
                    Pays
                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

        <section className="mt-12">

          <h2 className="mb-8 text-3xl font-black">
            Derniers articles
          </h2>

          {competition.articles.length === 0 ? (

            <div className="rounded-2xl bg-white p-10 text-center shadow">

              Aucun article disponible pour cette compétition.

            </div>

          ) : (

            <div className="grid gap-6 md:grid-cols-2">

              {competition.articles.map((article) => (

                <Link
                  key={article.id}
                  href={`/article/${article.slug}`}
                  className="rounded-2xl bg-white p-6 shadow transition hover:-translate-y-1 hover:shadow-xl"
                >

                  <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700">
                    {article.category}
                  </span>

                  <h3 className="mt-4 text-2xl font-bold">
                    {article.title}
                  </h3>

                  <p className="mt-4 text-gray-600">
                    {article.summary}
                  </p>

                  <div className="mt-6 font-bold text-blue-700">
                    Lire l'article →
                  </div>

                </Link>

              ))}

            </div>

          )}

        </section>

      </div>

    </main>
  );
}
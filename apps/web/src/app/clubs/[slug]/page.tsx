import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { footballDb } from "@/lib/football/database";

export const dynamic = "force-dynamic";

export default async function ClubPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const club = await footballDb.getClubBySlug(slug);

  if (!club) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-gray-100">

      <div className="mx-auto max-w-7xl px-4 py-8">

        <Link
          href="/clubs"
          className="inline-flex items-center rounded-xl bg-white px-5 py-3 shadow hover:bg-gray-50"
        >
          ← Retour aux clubs
        </Link>

        <div className="mt-8 overflow-hidden rounded-3xl bg-white shadow-lg">

          <div className="bg-gradient-to-r from-green-700 to-green-500 p-10 text-white">

            <div className="flex flex-col items-center gap-8 md:flex-row">

              <Image
                src={club.logo || "/club.png"}
                alt={club.name}
                width={150}
                height={150}
                className="rounded-2xl bg-white p-4 object-contain"
              />

              <div>

                <h1 className="text-5xl font-black">
                  {club.name}
                </h1>

                <p className="mt-4 text-xl text-green-100">
                  {club.country}
                </p>

              </div>

            </div>

          </div>

          <div className="grid gap-8 p-10 lg:grid-cols-2">

            <div className="rounded-2xl border p-8">

              <h2 className="mb-6 text-2xl font-black">
                Informations
              </h2>

              <div className="space-y-4">

                <p>
                  <strong>Pays :</strong> {club.country}
                </p>

                <p>
                  <strong>Ville :</strong> {club.city ?? "-"}
                </p>

                <p>
                  <strong>Fondation :</strong> {club.founded ?? "-"}
                </p>

                <p>
                  <strong>Stade :</strong> {club.stadium ?? "-"}
                </p>

              </div>

            </div>

            <div className="rounded-2xl border p-8">

              <h2 className="mb-6 text-2xl font-black">
                Effectif
              </h2>

              <p className="text-5xl font-black text-green-700">
                {club.players.length}
              </p>

              <p className="mt-2 text-gray-600">
                joueur(s)
              </p>

            </div>

          </div>

        </div>

        <section className="mt-12">

          <h2 className="mb-8 text-3xl font-black">
            Derniers articles
          </h2>

          {club.articles.length === 0 ? (

            <div className="rounded-2xl bg-white p-10 text-center shadow">

              Aucun article disponible.

            </div>

          ) : (

            <div className="grid gap-6 md:grid-cols-2">

              {club.articles.map((article) => (

                <Link
                  key={article.id}
                  href={`/article/${article.slug}`}
                  className="rounded-2xl bg-white p-6 shadow transition hover:-translate-y-1 hover:shadow-xl"
                >

                  <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
                    {article.category}
                  </span>

                  <h3 className="mt-4 text-2xl font-bold">
                    {article.title}
                  </h3>

                  <p className="mt-4 text-gray-600">
                    {article.summary}
                  </p>

                  <div className="mt-6 font-bold text-green-700">
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
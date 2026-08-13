import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { footballDb } from "@/lib/football/database";

export const dynamic = "force-dynamic";

export default async function PlayerPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const player = await footballDb.getPlayerBySlug(slug);

  if (!player) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-gray-100">

      <div className="mx-auto max-w-7xl px-4 py-8">

        <Link
          href="/joueurs"
          className="inline-flex items-center rounded-xl bg-white px-5 py-3 shadow hover:bg-gray-50"
        >
          ← Retour aux joueurs
        </Link>

        <div className="mt-8 overflow-hidden rounded-3xl bg-white shadow-lg">

          <div className="bg-gradient-to-r from-yellow-600 to-yellow-400 p-10">

            <div className="flex flex-col items-center gap-8 md:flex-row">

              <Image
                src={player.photo || "/player.png"}
                alt={`${player.firstname} ${player.lastname}`}
                width={180}
                height={180}
                className="rounded-full border-4 border-white bg-white object-cover shadow-lg"
              />

              <div className="text-white">

                <h1 className="text-5xl font-black">
                  {player.firstname} {player.lastname}
                </h1>

                <p className="mt-4 text-2xl font-semibold">
                  {player.position || "Poste inconnu"}
                </p>

                <p className="mt-2 text-yellow-100">
                  {player.club?.name ?? "Sans club"}
                </p>

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
                  <strong>Nationalité :</strong>{" "}
                  {player.nationality || "-"}
                </p>

                <p>
                  <strong>Poste :</strong>{" "}
                  {player.position || "-"}
                </p>

                <p>
                  <strong>Numéro :</strong>{" "}
                  {player.number ?? "-"}
                </p>

                <p>
                  <strong>Club :</strong>{" "}
                  {player.club?.name ?? "-"}
                </p>

                {player.birthDate && (
                  <p>
                    <strong>Date de naissance :</strong>{" "}
                    {new Date(player.birthDate).toLocaleDateString("fr-FR")}
                  </p>
                )}

              </div>

            </div>

            <div className="rounded-2xl border p-8">

              <h2 className="mb-6 text-2xl font-black">
                Statistiques
              </h2>

              <div className="grid grid-cols-2 gap-6">

                <div className="rounded-xl bg-yellow-50 p-5 text-center">
                  <div className="text-3xl font-black text-yellow-700">
                    {player.number ?? "-"}
                  </div>
                  <div className="mt-2 text-sm text-gray-600">
                    Numéro
                  </div>
                </div>

                <div className="rounded-xl bg-blue-50 p-5 text-center">
                  <div className="text-3xl font-black text-blue-700">
                    {player.articles.length}
                  </div>
                  <div className="mt-2 text-sm text-gray-600">
                    Articles
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

          {player.articles.length === 0 ? (

            <div className="rounded-2xl bg-white p-10 text-center shadow">

              Aucun article concernant ce joueur.

            </div>

          ) : (

            <div className="grid gap-6 md:grid-cols-2">

              {player.articles.map((article) => (

                <Link
                  key={article.id}
                  href={`/article/${article.slug}`}
                  className="rounded-2xl bg-white p-6 shadow transition hover:-translate-y-1 hover:shadow-xl"
                >

                  <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-bold text-yellow-700">
                    {article.category}
                  </span>

                  <h3 className="mt-4 text-2xl font-bold">
                    {article.title}
                  </h3>

                  <p className="mt-4 text-gray-600">
                    {article.summary}
                  </p>

                  <div className="mt-6 font-bold text-yellow-700">
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
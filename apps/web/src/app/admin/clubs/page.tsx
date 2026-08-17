import Link from "next/link";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function ClubsPage() {
  const clubs = await db.club.findMany({
    orderBy: {
      name: "asc",
    },
    include: {
      _count: {
        select: {
          articles: true,
          players: true,
          homeMatches: true,
          awayMatches: true,
        },
      },
    },
  });

  return (
    <main className="min-h-screen bg-slate-100">
      <div className="mx-auto max-w-7xl px-6 py-10">

        {/* En-tête */}
        <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-5xl font-black text-slate-900">
              Clubs
            </h1>

            <p className="mt-3 text-lg text-gray-500">
              Gestion des clubs de football
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/admin"
              className="rounded-xl bg-slate-700 px-6 py-3 font-bold text-white transition hover:bg-slate-800"
            >
              ← Administration
            </Link>

            <Link
              href="/"
              className="rounded-xl bg-red-600 px-6 py-3 font-bold text-white transition hover:bg-red-700"
            >
              🌐 Voir le site
            </Link>
          </div>
        </div>

        {/* Statistiques */}
        <div className="mb-10 grid grid-cols-1 gap-5 md:grid-cols-3">

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-gray-500">
              Clubs
            </p>

            <p className="mt-2 text-4xl font-black text-blue-600">
              {clubs.length}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-gray-500">
              Joueurs référencés
            </p>

            <p className="mt-2 text-4xl font-black text-purple-600">
              {clubs.reduce(
                (total, club) => total + club._count.players,
                0
              )}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-gray-500">
              Articles liés
            </p>

            <p className="mt-2 text-4xl font-black text-red-600">
              {clubs.reduce(
                (total, club) => total + club._count.articles,
                0
              )}
            </p>
          </div>

        </div>

        {/* Liste */}
        <div className="overflow-hidden rounded-2xl bg-white shadow-sm">

          <div className="border-b border-gray-200 px-6 py-5">
            <h2 className="text-2xl font-black text-slate-900">
              Tous les clubs
            </h2>

            <p className="mt-1 text-gray-500">
              Clubs actuellement présents dans la base Football.
            </p>
          </div>

          {clubs.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <div className="text-5xl">
                ⚽
              </div>

              <h3 className="mt-4 text-2xl font-black">
                Aucun club
              </h3>

              <p className="mt-2 text-gray-500">
                Initialise la base Football depuis le tableau de bord.
              </p>

              <Link
                href="/admin"
                className="mt-6 inline-block rounded-xl bg-green-600 px-6 py-3 font-bold text-white transition hover:bg-green-700"
              >
                Retour à l'administration
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">

              {clubs.map((club) => {

                const matches =
                  club._count.homeMatches +
                  club._count.awayMatches;

                return (
                  <div
                    key={club.id}
                    className="flex flex-col gap-5 px-6 py-6 transition hover:bg-slate-50 lg:flex-row lg:items-center lg:justify-between"
                  >

                    {/* Club */}
                    <div className="flex items-center gap-5">

                      <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-slate-100 p-3">
                        {club.logo ? (
                          <img
                            src={club.logo}
                            alt={`Logo ${club.name}`}
                            className="h-full w-full object-contain"
                          />
                        ) : (
                          <span className="text-4xl">
                            ⚽
                          </span>
                        )}
                      </div>

                      <div>
                        <h3 className="text-2xl font-black text-slate-900">
                          {club.name}
                        </h3>

                        <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500">
                          <span>
                            🌍 {club.country}
                          </span>

                          {club.city && (
                            <span>
                              📍 {club.city}
                            </span>
                          )}

                          {club.stadium && (
                            <span>
                              🏟️ {club.stadium}
                            </span>
                          )}

                          {club.founded && (
                            <span>
                              📅 {club.founded}
                            </span>
                          )}
                        </div>
                      </div>

                    </div>

                    {/* Statistiques */}
                    <div className="flex flex-wrap gap-3">

                      <div className="rounded-xl bg-slate-100 px-4 py-3 text-center">
                        <div className="text-xl font-black text-slate-900">
                          {club._count.players}
                        </div>

                        <div className="text-xs text-gray-500">
                          Joueurs
                        </div>
                      </div>

                      <div className="rounded-xl bg-slate-100 px-4 py-3 text-center">
                        <div className="text-xl font-black text-slate-900">
                          {club._count.articles}
                        </div>

                        <div className="text-xs text-gray-500">
                          Articles
                        </div>
                      </div>

                      <div className="rounded-xl bg-slate-100 px-4 py-3 text-center">
                        <div className="text-xl font-black text-slate-900">
                          {matches}
                        </div>

                        <div className="text-xs text-gray-500">
                          Matchs
                        </div>
                      </div>

                      <Link
                        href={`/admin/clubs/${club.slug}`}
                        className="rounded-xl bg-blue-600 px-5 py-3 font-bold text-white transition hover:bg-blue-700"
                      >
                        Voir →
                      </Link>

                    </div>

                  </div>
                );
              })}

            </div>
          )}

        </div>

      </div>
    </main>
  );
}
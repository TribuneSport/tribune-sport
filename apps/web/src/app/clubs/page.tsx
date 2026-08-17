import Link from "next/link";
import Image from "next/image";
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
          players: true,
          articles: true,
          homeMatches: true,
          awayMatches: true,
        },
      },
    },
  });

  return (
    <main className="min-h-screen bg-gray-100">
      <div className="mx-auto max-w-7xl px-4 py-8">
        {/* HEADER */}
        <header className="mb-12">
          <span className="inline-flex rounded-full bg-green-100 px-4 py-2 font-bold text-green-700">
            ⚽ Clubs
          </span>

          <h1 className="mt-5 text-5xl font-black text-gray-900">
            Tous les clubs
          </h1>

          <p className="mt-5 max-w-3xl text-lg text-gray-600">
            Découvrez les clubs suivis par Tribune Foot, avec leurs joueurs,
            leurs matchs et leurs actualités.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl bg-white p-5 shadow-sm">
              <p className="text-sm font-medium text-gray-500">
                Clubs disponibles
              </p>

              <p className="mt-2 text-3xl font-black text-green-700">
                {clubs.length}
              </p>
            </div>

            <div className="rounded-2xl bg-white p-5 shadow-sm">
              <p className="text-sm font-medium text-gray-500">
                Joueurs associés
              </p>

              <p className="mt-2 text-3xl font-black text-blue-700">
                {clubs.reduce(
                  (total, club) => total + club._count.players,
                  0
                )}
              </p>
            </div>

            <div className="rounded-2xl bg-white p-5 shadow-sm">
              <p className="text-sm font-medium text-gray-500">
                Matchs associés
              </p>

              <p className="mt-2 text-3xl font-black text-red-600">
                {clubs.reduce(
                  (total, club) =>
                    total +
                    club._count.homeMatches +
                    club._count.awayMatches,
                  0
                ) / 2}
              </p>
            </div>
          </div>
        </header>

        {/* EMPTY STATE */}
        {clubs.length === 0 ? (
          <div className="rounded-3xl bg-white p-16 text-center shadow">
            <h2 className="text-3xl font-black text-gray-900">
              Aucun club disponible
            </h2>

            <p className="mt-4 text-gray-600">
              Les clubs seront affichés ici après l'import des données
              Football.
            </p>
          </div>
        ) : (
          /* CLUB GRID */
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {clubs.map((club) => {
              const matches =
                club._count.homeMatches + club._count.awayMatches;

              return (
                <Link
                  key={club.id}
                  href={`/clubs/${club.slug}`}
                  className="group overflow-hidden rounded-3xl bg-white shadow transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  {/* LOGO */}
                  <div className="flex h-56 items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200 p-8">
                    <Image
                      src={club.logo || "/club.png"}
                      alt={`Logo ${club.name}`}
                      width={120}
                      height={120}
                      className="object-contain transition duration-300 group-hover:scale-110"
                    />
                  </div>

                  {/* CONTENT */}
                  <div className="p-6">
                    <h2 className="text-2xl font-black text-gray-900">
                      {club.name}
                    </h2>

                    <p className="mt-2 text-gray-600">
                      {club.country}
                    </p>

                    {club.city && (
                      <p className="mt-1 text-sm text-gray-500">
                        📍 {club.city}
                      </p>
                    )}

                    {club.stadium && (
                      <p className="mt-2 line-clamp-1 text-sm text-gray-500">
                        🏟️ {club.stadium}
                      </p>
                    )}

                    {/* STATS */}
                    <div className="mt-6 grid grid-cols-3 gap-2 border-t pt-5">
                      <div className="text-center">
                        <p className="text-xl font-black text-blue-700">
                          {club._count.players}
                        </p>

                        <p className="text-xs text-gray-500">
                          Joueurs
                        </p>
                      </div>

                      <div className="border-x text-center">
                        <p className="text-xl font-black text-red-600">
                          {matches}
                        </p>

                        <p className="text-xs text-gray-500">
                          Matchs
                        </p>
                      </div>

                      <div className="text-center">
                        <p className="text-xl font-black text-green-700">
                          {club._count.articles}
                        </p>

                        <p className="text-xs text-gray-500">
                          Articles
                        </p>
                      </div>
                    </div>

                    {/* LINK */}
                    <div className="mt-6 flex items-center justify-between">
                      <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
                        Club
                      </span>

                      <span className="font-bold text-green-700 transition group-hover:translate-x-1">
                        Découvrir →
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
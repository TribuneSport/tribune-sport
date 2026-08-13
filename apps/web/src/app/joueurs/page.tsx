import Link from "next/link";
import Image from "next/image";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function PlayersPage() {
  const players = await db.player.findMany({
    include: {
      club: true,
    },
    orderBy: [
      {
        lastname: "asc",
      },
      {
        firstname: "asc",
      },
    ],
  });

  return (
    <main className="min-h-screen bg-gray-100">

      <div className="mx-auto max-w-7xl px-4 py-8">

        <header className="mb-12">

          <span className="rounded-full bg-yellow-100 px-4 py-2 font-bold text-yellow-700">
            ⭐ Joueurs
          </span>

          <h1 className="mt-5 text-5xl font-black">
            Tous les joueurs
          </h1>

          <p className="mt-5 max-w-3xl text-lg text-gray-600">
            Retrouvez les fiches des joueurs suivis par Tribune Sport avec
            leur club, leur poste et leurs actualités.
          </p>

        </header>

        {players.length === 0 ? (

          <div className="rounded-3xl bg-white p-16 text-center shadow">

            <h2 className="text-3xl font-black">
              Aucun joueur disponible
            </h2>

            <p className="mt-4 text-gray-600">
              Les joueurs apparaîtront ici après l'import des données.
            </p>

          </div>

        ) : (

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

            {players.map((player) => (

              <Link
                key={player.id}
                href={`/joueurs/${player.slug}`}
                className="group overflow-hidden rounded-3xl bg-white shadow transition hover:-translate-y-1 hover:shadow-xl"
              >

                <div className="flex h-64 items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200 p-8">

                  <Image
                    src={player.photo || "/player.png"}
                    alt={`${player.firstname} ${player.lastname}`}
                    width={160}
                    height={160}
                    className="h-40 w-40 rounded-full object-cover transition duration-300 group-hover:scale-105"
                  />

                </div>

                <div className="p-6">

                  <h2 className="text-2xl font-black">
                    {player.firstname} {player.lastname}
                  </h2>

                  <p className="mt-3 font-semibold text-yellow-700">
                    {player.position || "Poste inconnu"}
                  </p>

                  <p className="mt-2 text-gray-600">
                    {player.club?.name ?? "Sans club"}
                  </p>

                  {player.nationality && (
                    <p className="mt-2 text-sm text-gray-500">
                      🌍 {player.nationality}
                    </p>
                  )}

                  <div className="mt-6 flex items-center justify-between">

                    <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-bold text-yellow-700">
                      Joueur
                    </span>

                    <span className="font-bold text-yellow-700">
                      Voir la fiche →
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
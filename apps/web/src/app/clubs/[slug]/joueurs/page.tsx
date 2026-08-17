import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { footballDb } from "@/lib/football/database";

export const dynamic = "force-dynamic";

export default async function ClubPlayersPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const club = await footballDb.getClubBySlug(slug);

  if (!club) {
    notFound();
  }

  const sortedPlayers = [...club.players].sort((a, b) => {
    if (a.number == null && b.number == null) {
      return `${a.lastname} ${a.firstname}`.localeCompare(
        `${b.lastname} ${b.firstname}`,
        "fr"
      );
    }

    if (a.number == null) return 1;
    if (b.number == null) return -1;

    return a.number - b.number;
  });

  return (
    <main className="min-h-screen bg-gray-100">
      <div className="mx-auto max-w-7xl px-4 py-8">

        <Link
          href={`/clubs/${club.slug}`}
          className="inline-flex items-center rounded-xl bg-white px-5 py-3 font-semibold shadow transition hover:bg-gray-50"
        >
          ← Retour à {club.name}
        </Link>

        <section className="mt-8 overflow-hidden rounded-3xl bg-white shadow-lg">

          <div className="bg-gradient-to-r from-green-800 to-green-500 p-8 text-white md:p-10">
            <div className="flex flex-col items-center gap-8 md:flex-row">

              <div className="flex h-36 w-36 items-center justify-center rounded-3xl bg-white p-5 shadow-lg">
                <Image
                  src={club.logo || "/club.png"}
                  alt={`Logo ${club.name}`}
                  width={120}
                  height={120}
                  className="h-full w-full object-contain"
                />
              </div>

              <div>
                <p className="text-sm font-bold uppercase tracking-widest text-green-200">
                  Effectif
                </p>

                <h1 className="mt-2 text-4xl font-black md:text-5xl">
                  {club.name}
                </h1>

                <p className="mt-3 text-xl text-green-100">
                  Effectif complet
                </p>
              </div>

            </div>
          </div>

          <div className="border-b p-6 text-center">
            <p className="text-4xl font-black text-green-700">
              {sortedPlayers.length}
            </p>

            <p className="mt-1 text-gray-500">
              joueurs dans l'effectif
            </p>
          </div>

        </section>

        <section className="mt-10 rounded-3xl bg-white p-8 shadow">

          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">

            <div>
              <h2 className="text-3xl font-black">
                Tous les joueurs
              </h2>

              <p className="mt-2 text-gray-500">
                Effectif actuellement associé à {club.name}.
              </p>
            </div>

            <span className="w-fit rounded-full bg-green-100 px-4 py-2 text-sm font-bold text-green-700">
              {sortedPlayers.length} joueurs
            </span>

          </div>

          {sortedPlayers.length === 0 ? (

            <div className="mt-8 rounded-2xl bg-gray-50 p-10 text-center text-gray-500">
              Aucun joueur disponible pour ce club.
            </div>

          ) : (

            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

              {sortedPlayers.map((player) => (

                <Link
                  key={player.id}
                  href={`/joueurs/${player.slug}`}
                  className="group overflow-hidden rounded-2xl border bg-white transition hover:-translate-y-1 hover:border-green-300 hover:bg-green-50 hover:shadow-lg"
                >

                  <div className="flex h-48 items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">

                    {player.photo ? (

                      <Image
                        src={player.photo}
                        alt={`${player.firstname} ${player.lastname}`}
                        width={150}
                        height={150}
                        className="h-32 w-32 rounded-full object-cover transition duration-300 group-hover:scale-105"
                      />

                    ) : (

                      <div className="flex h-32 w-32 items-center justify-center rounded-full bg-green-100 text-4xl font-black text-green-700">
                        {player.firstname?.[0] ?? ""}
                        {player.lastname?.[0] ?? ""}
                      </div>

                    )}

                  </div>

                  <div className="p-5">

                    <div className="flex items-start justify-between gap-3">

                      <div className="min-w-0">

                        <p className="text-sm font-semibold text-gray-500">
                          {player.position ?? "Poste non renseigné"}
                        </p>

                        <h3 className="mt-1 truncate text-xl font-black text-gray-900">
                          {player.firstname} {player.lastname}
                        </h3>

                      </div>

                      {player.number != null && (
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-100 font-black text-green-700">
                          {player.number}
                        </span>
                      )}

                    </div>

                    {player.nationality && (
                      <p className="mt-4 text-sm text-gray-500">
                        🌍 {player.nationality}
                      </p>
                    )}

                    <div className="mt-5 font-bold text-green-700">
                      Voir le joueur →
                    </div>

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
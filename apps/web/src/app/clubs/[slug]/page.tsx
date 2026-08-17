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

  const sortedPlayers = [...club.players].sort((a, b) => {
    if (a.number == null) return 1;
    if (b.number == null) return -1;

    return a.number - b.number;
  });

  const sortedMatches = [
    ...club.homeMatches.map((match) => ({
      ...match,
      isHome: true,
      opponent: match.awayClub,
    })),

    ...club.awayMatches.map((match) => ({
      ...match,
      isHome: false,
      opponent: match.homeClub,
    })),
  ]
    .sort(
      (a, b) =>
        new Date(b.matchDate).getTime() -
        new Date(a.matchDate).getTime()
    )
    .slice(0, 10);

  return (
    <main className="min-h-screen bg-gray-100">
      <div className="mx-auto max-w-7xl px-4 py-8">
        {/* RETOUR */}
        <Link
          href="/clubs"
          className="inline-flex items-center rounded-xl bg-white px-5 py-3 font-semibold shadow hover:bg-gray-50"
        >
          ← Retour aux clubs
        </Link>

        {/* HEADER CLUB */}
        <section className="mt-8 overflow-hidden rounded-3xl bg-white shadow-lg">
          <div className="bg-gradient-to-r from-green-800 to-green-500 p-8 text-white md:p-10">
            <div className="flex flex-col items-center gap-8 md:flex-row">
              <div className="flex h-40 w-40 items-center justify-center rounded-3xl bg-white p-5 shadow-lg">
                <Image
                  src={club.logo || "/club.png"}
                  alt={`Logo ${club.name}`}
                  width={130}
                  height={130}
                  className="h-full w-full object-contain"
                />
              </div>

              <div>
                <p className="text-sm font-bold uppercase tracking-widest text-green-200">
                  Club
                </p>

                <h1 className="mt-2 text-4xl font-black md:text-5xl">
                  {club.name}
                </h1>

                <p className="mt-3 text-xl text-green-100">
                  {club.country}
                </p>

                {club.city && (
                  <p className="mt-2 text-green-100">
                    📍 {club.city}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* STATISTIQUES */}
          <div className="grid grid-cols-2 divide-x border-b md:grid-cols-4">
            <div className="p-6 text-center">
              <p className="text-3xl font-black text-green-700">
                {club.players.length}
              </p>

              <p className="mt-1 text-sm text-gray-500">
                Joueurs
              </p>
            </div>

            <div className="p-6 text-center">
              <p className="text-3xl font-black text-blue-700">
                {club.homeMatches.length +
                  club.awayMatches.length}
              </p>

              <p className="mt-1 text-sm text-gray-500">
                Matchs
              </p>
            </div>

            <div className="p-6 text-center">
              <p className="text-3xl font-black text-orange-600">
                {club.articles.length}
              </p>

              <p className="mt-1 text-sm text-gray-500">
                Articles
              </p>
            </div>

            <div className="p-6 text-center">
              <p className="text-3xl font-black text-gray-800">
                {club.founded ?? "-"}
              </p>

              <p className="mt-1 text-sm text-gray-500">
                Fondation
              </p>
            </div>
          </div>
        </section>

        {/* INFORMATIONS + EFFECTIF */}
        <section className="mt-10 grid gap-8 lg:grid-cols-3">
          {/* INFORMATIONS */}
          <div className="rounded-3xl bg-white p-8 shadow lg:col-span-1">
            <h2 className="text-2xl font-black">
              Informations
            </h2>

            <div className="mt-6 space-y-5">
              <div>
                <p className="text-sm font-semibold text-gray-500">
                  Pays
                </p>

                <p className="mt-1 font-bold text-gray-900">
                  {club.country}
                </p>
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-500">
                  Ville
                </p>

                <p className="mt-1 font-bold text-gray-900">
                  {club.city ?? "-"}
                </p>
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-500">
                  Stade
                </p>

                <p className="mt-1 font-bold text-gray-900">
                  {club.stadium ?? "-"}
                </p>
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-500">
                  Fondation
                </p>

                <p className="mt-1 font-bold text-gray-900">
                  {club.founded ?? "-"}
                </p>
              </div>
            </div>
          </div>

          {/* EFFECTIF */}
          <div className="rounded-3xl bg-white p-8 shadow lg:col-span-2">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black">
                  Effectif
                </h2>

                <p className="mt-1 text-gray-500">
                  Joueurs associés à ce club
                </p>
              </div>

              <span className="rounded-full bg-green-100 px-4 py-2 text-sm font-bold text-green-700">
                {sortedPlayers.length} joueurs
              </span>
            </div>

            {sortedPlayers.length === 0 ? (
              <div className="mt-8 rounded-2xl bg-gray-50 p-8 text-center text-gray-500">
                Aucun joueur disponible pour ce club.
              </div>
            ) : (
              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {sortedPlayers.slice(0, 12).map((player) => (
                  <Link
                    key={player.id}
                    href={`/joueurs/${player.slug}`}
                    className="flex items-center gap-4 rounded-2xl border p-4 transition hover:border-green-300 hover:bg-green-50"
                  >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gray-100">
                      {player.photo ? (
                        <Image
                          src={player.photo}
                          alt={`${player.firstname} ${player.lastname}`}
                          width={48}
                          height={48}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="text-lg font-black text-gray-400">
                          {player.firstname?.[0] ?? ""}
                          {player.lastname?.[0] ?? ""}
                        </span>
                      )}
                    </div>

                    <div className="min-w-0">
                      <p className="truncate font-bold text-gray-900">
                        {player.firstname} {player.lastname}
                      </p>

                      <p className="text-sm text-gray-500">
                        {player.position ??
                          "Poste non renseigné"}

                        {player.number != null &&
                          ` • N°${player.number}`}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {sortedPlayers.length > 12 && (
              <div className="mt-6 text-center">
                <Link
                  href={`/clubs/${club.slug}/joueurs`}
                  className="font-bold text-green-700 hover:underline"
                >
                  Voir tout l'effectif →
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* MATCHS */}
        <section className="mt-10 rounded-3xl bg-white p-8 shadow">
          <div>
            <h2 className="text-2xl font-black">
              Derniers matchs
            </h2>

            <p className="mt-1 text-gray-500">
              Les rencontres associées à {club.name}
            </p>
          </div>

          {sortedMatches.length === 0 ? (
            <div className="mt-8 rounded-2xl bg-gray-50 p-8 text-center text-gray-500">
              Aucun match disponible pour ce club.
            </div>
          ) : (
            <div className="mt-8 space-y-3">
              {sortedMatches.map((match) => {
                const isHome = match.isHome;
                const opponent = match.opponent;

                const clubScore = isHome
                  ? match.homeScore
                  : match.awayScore;

                const opponentScore = isHome
                  ? match.awayScore
                  : match.homeScore;

                return (
                  <div
                    key={match.id}
                    className="flex flex-col gap-4 rounded-2xl border p-5 md:flex-row md:items-center md:justify-between"
                  >
                    {/* DATE */}
                    <div>
                      <p className="text-sm text-gray-500">
                        {new Date(
                          match.matchDate
                        ).toLocaleDateString("fr-FR", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })}
                      </p>

                      <p className="mt-1 font-bold text-gray-900">
                        {isHome
                          ? "Domicile"
                          : "Extérieur"}
                      </p>

                      {match.competition && (
                        <p className="mt-1 text-xs text-gray-500">
                          {match.competition.name}
                        </p>
                      )}
                    </div>

                    {/* RENCONTRE */}
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-bold">
                          {club.name}
                        </p>

                        <p className="text-sm text-gray-500">
                          {isHome
                            ? "Domicile"
                            : "Extérieur"}
                        </p>
                      </div>

                      <div className="min-w-20 rounded-xl bg-gray-100 px-4 py-2 text-center">
                        <span className="text-xl font-black">
                          {clubScore ?? "-"}
                        </span>

                        <span className="mx-2 text-gray-400">
                          -
                        </span>

                        <span className="text-xl font-black">
                          {opponentScore ?? "-"}
                        </span>
                      </div>

                      <div>
                        <p className="font-bold">
                          {opponent.name}
                        </p>

                        <p className="text-sm text-gray-500">
                          {match.status}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* ARTICLES */}
        <section className="mt-10">
          <div className="mb-8">
            <h2 className="text-3xl font-black">
              Derniers articles
            </h2>

            <p className="mt-2 text-gray-500">
              Actualités liées à {club.name}
            </p>
          </div>

          {club.articles.length === 0 ? (
            <div className="rounded-3xl bg-white p-10 text-center shadow">
              Aucun article disponible.
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {club.articles
                .slice(0, 6)
                .map((article) => (
                  <Link
                    key={article.id}
                    href={`/article/${article.slug}`}
                    className="rounded-3xl bg-white p-6 shadow transition hover:-translate-y-1 hover:shadow-xl"
                  >
                    <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
                      {article.category}
                    </span>

                    <h3 className="mt-4 text-2xl font-bold text-gray-900">
                      {article.title}
                    </h3>

                    <p className="mt-4 line-clamp-3 text-gray-600">
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
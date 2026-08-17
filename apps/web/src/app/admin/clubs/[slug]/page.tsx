import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function ClubDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const club = await db.club.findUnique({
    where: {
      slug,
    },
    include: {
      players: {
        orderBy: {
          lastname: "asc",
        },
      },
      articles: {
        orderBy: {
          createdAt: "desc",
        },
      },
      homeMatches: {
        include: {
          awayClub: true,
          competition: true,
        },
        orderBy: {
          matchDate: "desc",
        },
      },
      awayMatches: {
        include: {
          homeClub: true,
          competition: true,
        },
        orderBy: {
          matchDate: "desc",
        },
      },
    },
  });

  if (!club) {
    notFound();
  }

  const matches = [
    ...club.homeMatches.map((match) => ({
      ...match,
      opponent: match.awayClub,
      venueType: "Domicile",
    })),
    ...club.awayMatches.map((match) => ({
      ...match,
      opponent: match.homeClub,
      venueType: "Extérieur",
    })),
  ].sort(
    (a, b) =>
      new Date(b.matchDate).getTime() -
      new Date(a.matchDate).getTime()
  );

  return (
    <main className="min-h-screen bg-slate-100">
      <div className="mx-auto max-w-7xl px-6 py-10">

        {/* HEADER */}
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="mb-2 text-sm font-bold uppercase tracking-wide text-blue-600">
              Administration Football
            </p>

            <h1 className="text-5xl font-black text-slate-900">
              {club.name}
            </h1>

            <p className="mt-2 text-lg text-slate-500">
              Fiche complète du club
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/admin/clubs"
              className="rounded-xl bg-slate-700 px-6 py-3 font-bold text-white hover:bg-slate-800"
            >
              ← Tous les clubs
            </Link>

            <Link
              href="/admin"
              className="rounded-xl bg-blue-600 px-6 py-3 font-bold text-white hover:bg-blue-700"
            >
              Administration
            </Link>
          </div>
        </div>

        {/* CLUB INFO */}
        <section className="mb-8 rounded-3xl bg-white p-8 shadow-sm">
          <div className="flex flex-col gap-8 md:flex-row md:items-center">

            <div className="flex h-32 w-32 items-center justify-center rounded-3xl bg-slate-100 text-6xl">
              ⚽
            </div>

            <div className="flex-1">
              <h2 className="text-3xl font-black text-slate-900">
                {club.name}
              </h2>

              <div className="mt-4 flex flex-wrap gap-4 text-slate-600">
                <span>🌍 {club.country}</span>

                {club.city && (
                  <span>📍 {club.city}</span>
                )}

                {club.founded && (
                  <span>📅 {club.founded}</span>
                )}

                {club.stadium && (
                  <span>🏟️ {club.stadium}</span>
                )}
              </div>

              {club.description && (
                <p className="mt-5 max-w-3xl text-slate-600">
                  {club.description}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* STATS */}
        <section className="mb-8 grid gap-6 md:grid-cols-4">

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">
              Joueurs
            </p>

            <p className="mt-2 text-4xl font-black text-blue-600">
              {club.players.length}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">
              Articles
            </p>

            <p className="mt-2 text-4xl font-black text-purple-600">
              {club.articles.length}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">
              Matchs
            </p>

            <p className="mt-2 text-4xl font-black text-red-600">
              {matches.length}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">
              Matchs à domicile
            </p>

            <p className="mt-2 text-4xl font-black text-green-600">
              {club.homeMatches.length}
            </p>
          </div>

        </section>

        {/* JOUEURS */}
        <section className="mb-8 rounded-3xl bg-white shadow-sm">

          <div className="border-b border-slate-200 p-6">
            <h2 className="text-2xl font-black text-slate-900">
              Joueurs
            </h2>

            <p className="mt-1 text-slate-500">
              Effectif actuellement enregistré
            </p>
          </div>

          {club.players.length === 0 ? (
            <div className="p-8 text-center text-slate-500">
              Aucun joueur enregistré pour ce club.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {club.players.map((player) => (
                <div
                  key={player.id}
                  className="flex items-center justify-between p-5"
                >
                  <div>
                    <p className="font-bold text-slate-900">
                      {player.firstname} {player.lastname}
                    </p>

                    <p className="text-sm text-slate-500">
                      {player.position || "Position inconnue"}
                      {player.nationality
                        ? ` • ${player.nationality}`
                        : ""}
                    </p>
                  </div>

                  {player.number && (
                    <span className="rounded-lg bg-slate-100 px-4 py-2 font-black">
                      #{player.number}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}

        </section>

        {/* ARTICLES */}
        <section className="mb-8 rounded-3xl bg-white shadow-sm">

          <div className="border-b border-slate-200 p-6">
            <h2 className="text-2xl font-black text-slate-900">
              Articles liés
            </h2>

            <p className="mt-1 text-slate-500">
              Actualités associées à ce club
            </p>
          </div>

          {club.articles.length === 0 ? (
            <div className="p-8 text-center text-slate-500">
              Aucun article lié à ce club.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {club.articles.map((article) => (
                <div key={article.id} className="p-5">
                  <p className="font-bold text-slate-900">
                    {article.title}
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    {article.category}
                  </p>
                </div>
              ))}
            </div>
          )}

        </section>

        {/* MATCHS */}
        <section className="rounded-3xl bg-white shadow-sm">

          <div className="border-b border-slate-200 p-6">
            <h2 className="text-2xl font-black text-slate-900">
              Matchs
            </h2>

            <p className="mt-1 text-slate-500">
              Rencontres enregistrées dans la base Football
            </p>
          </div>

          {matches.length === 0 ? (
            <div className="p-8 text-center text-slate-500">
              Aucun match enregistré pour ce club.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {matches.map((match) => (
                <div
                  key={match.id}
                  className="flex flex-col gap-3 p-5 md:flex-row md:items-center md:justify-between"
                >
                  <div>
                    <p className="font-bold text-slate-900">
                      {club.name} vs {match.opponent.name}
                    </p>

                    <p className="text-sm text-slate-500">
                      {match.competition.name}
                      {" • "}
                      {match.venueType}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="font-bold text-slate-900">
                      {match.homeScore ?? "-"} -{" "}
                      {match.awayScore ?? "-"}
                    </p>

                    <p className="text-sm text-slate-500">
                      {new Date(match.matchDate).toLocaleDateString(
                        "fr-FR"
                      )}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

        </section>

      </div>
    </main>
  );
}
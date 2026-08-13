import Link from "next/link";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function ClassementsPage() {
  const standings = await db.standing.findMany({
    orderBy: [
      {
        competitionId: "asc",
      },
      {
        position: "asc",
      },
    ],
  });

  const clubs = await db.club.findMany({
    orderBy: {
      name: "asc",
    },
  });

  const competitions = await db.competition.findMany({
    orderBy: {
      name: "asc",
    },
  });

  const clubMap = new Map(clubs.map((club) => [club.id, club]));

  const competitionMap = new Map(
    competitions.map((competition) => [competition.id, competition])
  );

  const grouped = standings.reduce((acc, standing) => {
    const competition =
      competitionMap.get(standing.competitionId)?.name ??
      `Compétition ${standing.competitionId}`;

    if (!acc[competition]) {
      acc[competition] = [];
    }

    acc[competition].push(standing);

    return acc;
  }, {} as Record<string, typeof standings>);

  return (
    <main className="min-h-screen bg-gray-100">

      <div className="mx-auto max-w-7xl px-4 py-8">

        <header className="mb-12">

          <span className="rounded-full bg-indigo-100 px-4 py-2 font-bold text-indigo-700">
            📊 Classements
          </span>

          <h1 className="mt-5 text-5xl font-black">
            Classements
          </h1>

          <p className="mt-5 max-w-3xl text-lg text-gray-600">
            Retrouvez les classements des différentes compétitions suivies
            par Tribune Sport.
          </p>

        </header>

        {Object.keys(grouped).length === 0 ? (

          <div className="rounded-3xl bg-white p-16 text-center shadow">

            <h2 className="text-3xl font-black">
              Aucun classement disponible
            </h2>

            <p className="mt-4 text-gray-600">
              Les classements apparaîtront après l'import des données.
            </p>

          </div>

        ) : (

          <div className="space-y-12">

            {Object.entries(grouped).map(([competitionName, rows]) => (

              <section
                key={competitionName}
                className="overflow-hidden rounded-3xl bg-white shadow-lg"
              >

                <div className="border-b bg-slate-50 px-8 py-6">

                  <h2 className="text-3xl font-black">
                    {competitionName}
                  </h2>

                </div>

                <div className="overflow-x-auto">

                  <table className="w-full">

                    <thead>

                      <tr className="border-b bg-gray-50">

                        <th className="p-4 text-center">#</th>
                        <th className="p-4 text-left">Club</th>
                        <th className="p-4 text-center">Pts</th>
                        <th className="p-4 text-center">J</th>
                        <th className="p-4 text-center">G</th>
                        <th className="p-4 text-center">N</th>
                        <th className="p-4 text-center">P</th>
                        <th className="p-4 text-center">Diff</th>

                      </tr>

                    </thead>

                    <tbody>

                      {rows.map((standing) => {
                        const club = clubMap.get(standing.clubId);

                        return (
                          <tr
                            key={standing.id}
                            className="border-b hover:bg-gray-50"
                          >

                            <td className="p-4 text-center font-bold">
                              {standing.position}
                            </td>

                            <td className="p-4">

                              {club ? (
                                <Link
                                  href={`/clubs/${club.slug}`}
                                  className="font-semibold hover:text-blue-700"
                                >
                                  {club.name}
                                </Link>
                              ) : (
                                <span>
                                  Club #{standing.clubId}
                                </span>
                              )}

                            </td>

                            <td className="p-4 text-center font-bold">
                              {standing.points}
                            </td>

                            <td className="p-4 text-center">
                              {standing.played}
                            </td>

                            <td className="p-4 text-center">
                              {standing.won}
                            </td>

                            <td className="p-4 text-center">
                              {standing.drawn}
                            </td>

                            <td className="p-4 text-center">
                              {standing.lost}
                            </td>

                            <td className="p-4 text-center">
                              {standing.goalDifference}
                            </td>

                          </tr>
                        );
                      })}

                    </tbody>

                  </table>

                </div>

              </section>

            ))}

          </div>

        )}

      </div>

    </main>
  );
}
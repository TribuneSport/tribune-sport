import Link from "next/link";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function MatchsPage() {
  const matchs = await db.match.findMany({
    include: {
      competition: true,
      homeClub: true,
      awayClub: true,
    },
    orderBy: {
      matchDate: "desc",
    },
  });

  return (
    <main className="min-h-screen bg-slate-100">
      <div className="mx-auto max-w-7xl px-6 py-10">

        <div className="mb-10">
          <h1 className="text-5xl font-black">
            Matchs
          </h1>

          <p className="mt-3 text-lg text-gray-600">
            Retrouvez tous les matchs suivis par Tribune Foot.
          </p>
        </div>

        {matchs.length === 0 ? (

          <div className="rounded-3xl bg-white p-16 text-center shadow">

            <div className="text-6xl">
              ⚽
            </div>

            <h2 className="mt-6 text-3xl font-black">
              Aucun match disponible
            </h2>

            <p className="mt-4 text-gray-600">
              Les matchs apparaîtront après l'import des données.
            </p>

          </div>

        ) : (

          <div className="space-y-6">

            {matchs.map((match) => (

              <Link
                key={match.id}
                href={`/matchs/${match.id}`}
                className="block rounded-3xl bg-white p-8 shadow transition hover:-translate-y-1 hover:shadow-xl"
              >

                <div className="mb-4 flex items-center justify-between">

                  <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-bold text-blue-700">
                    {match.competition.name}
                  </span>

                  <span className="text-sm text-gray-500">
                    {new Date(match.matchDate).toLocaleDateString("fr-FR")}
                  </span>

                </div>

                <div className="grid items-center gap-6 md:grid-cols-3">

                  <div className="text-right">
                    <h2 className="text-2xl font-black">
                      {match.homeClub.name}
                    </h2>
                  </div>

                  <div className="text-center">

                    <div className="text-4xl font-black text-red-700">
                      {match.homeScore ?? "-"} - {match.awayScore ?? "-"}
                    </div>

                    <p className="mt-2 text-sm text-gray-500">
                      {match.status}
                    </p>

                  </div>

                  <div>
                    <h2 className="text-2xl font-black">
                      {match.awayClub.name}
                    </h2>
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

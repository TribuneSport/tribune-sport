import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function MatchPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const match = await db.match.findUnique({
    where: {
      id: Number(id),
    },
    include: {
      competition: true,
      homeClub: true,
      awayClub: true,
    },
  });

  if (!match) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-slate-100">
      <div className="mx-auto max-w-6xl px-6 py-10">

        <Link
          href="/matchs"
          className="mb-8 inline-block rounded-lg bg-slate-700 px-5 py-3 font-semibold text-white hover:bg-slate-800"
        >
          ← Retour aux matchs
        </Link>

        <div className="rounded-3xl bg-white p-10 shadow-xl">

          <p className="mb-4 text-sm font-bold uppercase tracking-widest text-blue-700">
            {match.competition.name}
          </p>

          <h1 className="text-center text-5xl font-black">
            {match.homeClub.name}
          </h1>

          <div className="my-8 text-center text-6xl font-black text-red-700">
            {match.homeScore ?? "-"} - {match.awayScore ?? "-"}
          </div>

          <h2 className="text-center text-5xl font-black">
            {match.awayClub.name}
          </h2>

          <div className="mt-10 grid gap-6 md:grid-cols-2">

            <div className="rounded-2xl border p-6">

              <h3 className="mb-4 text-2xl font-bold">
                Informations
              </h3>

              <p className="mb-3">
                <strong>Date :</strong>{" "}
                {new Date(match.matchDate).toLocaleDateString("fr-FR")}
              </p>

              <p className="mb-3">
                <strong>Heure :</strong>{" "}
                {new Date(match.matchDate).toLocaleTimeString("fr-FR", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>

              <p>
                <strong>Statut :</strong> {match.status}
              </p>

            </div>

            <div className="rounded-2xl border p-6">

              <h3 className="mb-4 text-2xl font-bold">
                Compétition
              </h3>

              <p className="text-lg">
                {match.competition.name}
              </p>

            </div>

          </div>

        </div>

      </div>
    </main>
  );
}
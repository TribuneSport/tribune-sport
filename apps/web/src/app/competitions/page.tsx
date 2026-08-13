import Link from "next/link";
import Image from "next/image";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function CompetitionsPage() {
  const competitions = await db.competition.findMany({
    orderBy: {
      name: "asc",
    },
  });

  return (
    <main className="min-h-screen bg-gray-100">

      <div className="mx-auto max-w-7xl px-4 py-8">

        <header className="mb-12">

          <span className="rounded-full bg-blue-100 px-4 py-2 font-bold text-blue-700">
            🏆 Football
          </span>

          <h1 className="mt-5 text-5xl font-black">
            Compétitions
          </h1>

          <p className="mt-5 max-w-3xl text-lg text-gray-600">
            Retrouvez toutes les compétitions suivies par Tribune Sport :
            championnats nationaux, coupes européennes et compétitions
            internationales.
          </p>

        </header>

        {competitions.length === 0 ? (

          <div className="rounded-3xl bg-white p-16 text-center shadow">

            <h2 className="text-3xl font-black">
              Aucune compétition disponible
            </h2>

            <p className="mt-4 text-gray-600">
              Les compétitions apparaîtront ici après l'import des données.
            </p>

          </div>

        ) : (

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

            {competitions.map((competition) => (

              <Link
                key={competition.id}
                href={`/competitions/${competition.slug}`}
                className="group overflow-hidden rounded-3xl bg-white shadow transition hover:-translate-y-1 hover:shadow-xl"
              >

                <div className="flex h-56 items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200 p-8">

                  <Image
                    src={competition.logo || "/competition.png"}
                    alt={competition.name}
                    width={120}
                    height={120}
                    className="object-contain transition duration-300 group-hover:scale-110"
                  />

                </div>

                <div className="p-6">

                  <h2 className="text-2xl font-black">
                    {competition.name}
                  </h2>

                  <p className="mt-3 text-gray-600">
                    {competition.country || "International"}
                  </p>

                  <div className="mt-6 flex items-center justify-between">

                    <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700">
                      Compétition
                    </span>

                    <span className="font-bold text-blue-700">
                      Ouvrir →
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
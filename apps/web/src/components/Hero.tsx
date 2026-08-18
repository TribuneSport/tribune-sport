import Link from "next/link";
import { db } from "@/lib/db";

export default async function Hero() {
  const publishedCount = await db.article.count({
    where: {
      published: true,
    },
  });

  const categories = await db.article.groupBy({
    by: ["category"],
    where: {
      published: true,
    },
  });

  const sources = await db.article.groupBy({
    by: ["sourceUrl"],
    where: {
      published: true,
    },
  });

  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-red-700 via-red-600 to-red-500 px-8 py-16 text-white shadow-2xl lg:px-16">

      {/* Effets décoratifs */}
      <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
      <div className="absolute -bottom-20 left-0 h-60 w-60 rounded-full bg-black/10 blur-3xl" />

      <div className="relative z-10 max-w-4xl">

        {/* Badge */}
        <span className="inline-flex items-center rounded-full bg-white/20 px-4 py-2 text-sm font-semibold backdrop-blur">
          ⚽ Le média 100 % Football
        </span>

        {/* Titre */}
        <h1 className="mt-6 text-5xl font-black leading-tight lg:text-6xl">
          Toute l'actualité du
          <br />
          football,
          <br />
          en continu.
        </h1>

        {/* Description */}
        <p className="mt-6 max-w-3xl text-lg leading-8 text-red-100">
          Ligue 1, Premier League, Liga, Serie A, Bundesliga,
          Ligue des Champions, Mercato, sélections nationales,
          analyses, interviews et résultats en direct.
        </p>

        {/* Boutons */}
        <div className="mt-10 flex flex-wrap gap-4">

          <Link
            href="/articles"
            className="inline-flex items-center justify-center rounded-xl bg-white px-8 py-4 font-bold text-red-700 transition hover:scale-105 hover:bg-gray-100"
          >
            Voir les actualités →
          </Link>

          <Link
            href="/categorie/mercato"
            className="inline-flex items-center justify-center rounded-xl border border-white px-8 py-4 font-bold text-white transition hover:bg-white hover:text-red-700"
          >
            Mercato
          </Link>

        </div>

        {/* Statistiques dynamiques */}
        <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-4">

          <div className="rounded-2xl bg-white/10 p-4 backdrop-blur">
            <p className="text-3xl font-black">
              24h/24
            </p>

            <p className="text-sm text-red-100">
              Actualité football
            </p>
          </div>

          <div className="rounded-2xl bg-white/10 p-4 backdrop-blur">
            <p className="text-3xl font-black">
              {publishedCount}
            </p>

            <p className="text-sm text-red-100">
              Actualités publiées
            </p>
          </div>

          <div className="rounded-2xl bg-white/10 p-4 backdrop-blur">
            <p className="text-3xl font-black">
              {categories.length}
            </p>

            <p className="text-sm text-red-100">
              Catégories
            </p>
          </div>

          <div className="rounded-2xl bg-white/10 p-4 backdrop-blur">
            <p className="text-3xl font-black">
              Live
            </p>

            <p className="text-sm text-red-100">
              Mercato & résultats
            </p>
          </div>

        </div>

      </div>

    </section>
  );
}
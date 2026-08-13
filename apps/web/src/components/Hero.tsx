import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-red-700 via-red-600 to-red-500 px-8 py-16 text-white shadow-2xl lg:px-16">

      <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
      <div className="absolute -bottom-20 left-0 h-60 w-60 rounded-full bg-black/10 blur-3xl" />

      <div className="relative z-10 max-w-3xl">

        <span className="inline-flex items-center rounded-full bg-white/20 px-4 py-2 text-sm font-semibold backdrop-blur">
          ⚽ Le média 100 % Football
        </span>

        <h1 className="mt-6 text-5xl font-black leading-tight lg:text-6xl">
          Toute l'actualité du football,
          <br />
          en continu.
        </h1>

        <p className="mt-6 max-w-2xl text-lg leading-8 text-red-100">
          Ligue 1, Premier League, Liga, Serie A, Bundesliga,
          Ligue des Champions, Mercato, sélections nationales,
          analyses, interviews et résultats en direct.
        </p>

        <div className="mt-10 flex flex-wrap gap-4">

          <Link
            href="/articles"
            className="rounded-xl bg-white px-8 py-4 font-bold text-red-700 transition hover:scale-105 hover:bg-gray-100"
          >
            Voir les actualités
          </Link>

          <Link
            href="/categorie/mercato"
            className="rounded-xl border border-white px-8 py-4 font-bold transition hover:bg-white hover:text-red-700"
          >
            Mercato
          </Link>

        </div>

        <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-4">

          <div className="rounded-2xl bg-white/10 p-4 backdrop-blur">
            <p className="text-3xl font-black">24h/24</p>
            <p className="text-sm text-red-100">
              Actualité
            </p>
          </div>

          <div className="rounded-2xl bg-white/10 p-4 backdrop-blur">
            <p className="text-3xl font-black">100+</p>
            <p className="text-sm text-red-100">
              Sources
            </p>
          </div>

          <div className="rounded-2xl bg-white/10 p-4 backdrop-blur">
            <p className="text-3xl font-black">Europe</p>
            <p className="text-sm text-red-100">
              Tous les championnats
            </p>
          </div>

          <div className="rounded-2xl bg-white/10 p-4 backdrop-blur">
            <p className="text-3xl font-black">Live</p>
            <p className="text-sm text-red-100">
              Mercato
            </p>
          </div>

        </div>

      </div>

    </section>
  );
}
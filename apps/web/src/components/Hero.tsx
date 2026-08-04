import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative mb-10 overflow-hidden rounded-3xl bg-gradient-to-r from-red-700 via-red-600 to-red-500 p-12 text-white shadow-xl">

      <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/10 blur-3xl"></div>
      <div className="absolute -bottom-20 left-0 h-60 w-60 rounded-full bg-black/10 blur-3xl"></div>

      <div className="relative max-w-3xl">

        <span className="mb-4 inline-block rounded-full bg-white/20 px-4 py-2 text-sm font-semibold backdrop-blur">
          ⚽ Le média 100% Football
        </span>

        <h1 className="mt-4 text-5xl font-extrabold leading-tight lg:text-6xl">
          Toute l'actualité du football en temps réel
        </h1>

        <p className="mt-6 text-lg leading-8 text-red-100">
          Retrouvez les dernières informations sur la Ligue 1,
          les grands championnats européens, le mercato,
          les compétitions internationales et les analyses des plus grands matchs.
        </p>

        <div className="mt-10 flex flex-wrap gap-4">

          <Link
            href="/"
            className="rounded-xl bg-white px-8 py-4 font-bold text-red-700 transition hover:scale-105 hover:bg-gray-100"
          >
            📰 Voir les actualités
          </Link>

          <Link
            href="/categorie/mercato"
            className="rounded-xl border border-white px-8 py-4 font-bold transition hover:bg-white hover:text-red-700"
          >
            💰 Mercato
          </Link>

        </div>

      </div>

    </section>
  );
}
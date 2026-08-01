import Link from "next/link";

export default function Hero() {
  return (
    <section className="mb-10 overflow-hidden rounded-3xl bg-gradient-to-r from-red-700 to-red-900 p-10 text-white shadow-xl">
      <div className="max-w-3xl">
        <span className="rounded-full bg-white/20 px-4 py-2 text-sm font-semibold">
          ⚽ Toute l'actualité football
        </span>

        <h1 className="mt-6 text-5xl font-bold leading-tight">
          Bienvenue sur Tribune Sport
        </h1>

        <p className="mt-6 text-xl leading-8 text-red-100">
          Retrouvez chaque jour toute l'actualité du FC Metz, de la Ligue 1
          et des plus grands championnats européens.
        </p>

        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            href="/article/1"
            className="rounded-xl bg-white px-6 py-3 font-bold text-red-700 transition hover:bg-gray-100"
          >
            Lire l'article à la une
          </Link>

          <Link
            href="/"
            className="rounded-xl border border-white px-6 py-3 font-bold transition hover:bg-white hover:text-red-700"
          >
            Voir les actualités
          </Link>
        </div>
      </div>
    </section>
  );
}
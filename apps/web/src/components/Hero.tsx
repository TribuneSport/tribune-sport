import Link from "next/link";

export default function Hero() {
  return (
    <section className="mb-10 rounded-2xl bg-gradient-to-r from-red-700 to-red-900 p-10 text-white shadow-lg">

      <h1 className="text-5xl font-extrabold">
        Tribune Sport
      </h1>

      <p className="mt-5 max-w-3xl text-lg leading-8 text-red-100">
        Toute l'actualité du football, des clubs français et européens.
        Retrouvez les dernières informations, les analyses, les transferts
        et les résultats, mis à jour quotidiennement.
      </p>

      <div className="mt-8 flex flex-wrap gap-4">

        <Link
          href="/"
          className="rounded-lg bg-white px-6 py-3 font-semibold text-red-700 transition hover:bg-gray-100"
        >
          Dernières actualités
        </Link>

        <Link
          href="/admin"
          className="rounded-lg border border-white px-6 py-3 font-semibold transition hover:bg-white hover:text-red-700"
        >
          Administration
        </Link>

      </div>

    </section>
  );
}
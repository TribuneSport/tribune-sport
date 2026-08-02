import Link from "next/link";

export default function Sidebar() {
  return (
    <aside className="sticky top-0 flex h-screen w-72 flex-col bg-slate-900 text-white shadow-xl">

      <div className="border-b border-slate-800 p-6">

        <h1 className="text-3xl font-extrabold text-red-500">
          Tribune Sport
        </h1>

        <p className="mt-2 text-sm text-slate-400">
          L'actualité du football en continu
        </p>

      </div>

      <nav className="flex-1 p-6">

        <p className="mb-4 text-xs font-bold uppercase tracking-widest text-slate-500">
          Navigation
        </p>

        <ul className="space-y-2">

          <li>
            <Link
              href="/"
              className="block rounded-lg px-4 py-3 transition hover:bg-slate-800"
            >
              🏠 Accueil
            </Link>
          </li>

          <li>
            <Link
              href="/"
              className="block rounded-lg px-4 py-3 transition hover:bg-slate-800"
            >
              🟡 FC Metz
            </Link>
          </li>

          <li>
            <Link
              href="/"
              className="block rounded-lg px-4 py-3 transition hover:bg-slate-800"
            >
              🔵🔴 PSG
            </Link>
          </li>

          <li>
            <Link
              href="/"
              className="block rounded-lg px-4 py-3 transition hover:bg-slate-800"
            >
              🇫🇷 Ligue 1
            </Link>
          </li>

          <li>
            <Link
              href="/"
              className="block rounded-lg px-4 py-3 transition hover:bg-slate-800"
            >
              🌍 Europe
            </Link>
          </li>

          <li>
            <Link
              href="/"
              className="block rounded-lg px-4 py-3 transition hover:bg-slate-800"
            >
              ⚽ Transferts
            </Link>
          </li>

          <li>
            <Link
              href="/"
              className="block rounded-lg px-4 py-3 transition hover:bg-slate-800"
            >
              📊 Classements
            </Link>
          </li>

        </ul>

      </nav>

      <div className="border-t border-slate-800 p-6">

        <Link
          href="/admin"
          className="block rounded-lg bg-red-700 px-4 py-3 text-center font-semibold transition hover:bg-red-800"
        >
          ⚙️ Administration
        </Link>

      </div>

    </aside>
  );
}
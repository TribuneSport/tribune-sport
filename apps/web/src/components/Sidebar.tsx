import Link from "next/link";

export default function Sidebar() {
  return (
    <aside className="hidden min-h-screen w-64 bg-slate-900 p-6 text-white lg:block">
      <h2 className="mb-8 text-2xl font-bold">
        Navigation
      </h2>

      <nav>
        <ul className="space-y-4">
          <li>
            <Link href="/" className="block rounded-lg p-2 hover:bg-slate-800">
              🏠 Accueil
            </Link>
          </li>

          <li>
            <Link href="/" className="block rounded-lg p-2 hover:bg-slate-800">
              🔵🔴 PSG
            </Link>
          </li>

          <li>
            <Link href="/" className="block rounded-lg p-2 hover:bg-slate-800">
              🇫🇷 Ligue 1
            </Link>
          </li>

          <li>
            <Link href="/" className="block rounded-lg p-2 hover:bg-slate-800">
              🌍 Europe
            </Link>
          </li>

          <li>
            <Link href="/" className="block rounded-lg p-2 hover:bg-slate-800">
              👤 Joueurs
            </Link>
          </li>

          <li>
            <Link href="/" className="block rounded-lg p-2 hover:bg-slate-800">
              📊 Classements
            </Link>
          </li>

          <li>
            <Link href="/" className="block rounded-lg p-2 hover:bg-slate-800">
              ⚙️ Administration
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
}
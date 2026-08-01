import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b bg-white shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-4">
        <Link href="/" className="text-3xl font-bold text-red-700">
          Tribune Sport
        </Link>

        <nav className="flex items-center gap-8">
          <Link href="/" className="hover:text-red-700">
            Accueil
          </Link>

          <Link href="/" className="hover:text-red-700">
            FC Metz
          </Link>

          <Link href="/" className="hover:text-red-700">
            Ligue 1
          </Link>

          <Link href="/" className="hover:text-red-700">
            Europe
          </Link>
        </nav>
      </div>
    </header>
  );
}
import Link from "next/link";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-16 border-t border-slate-800 bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2 lg:col-span-1">
            <Link
              href="/"
              className="inline-block text-2xl font-black tracking-tight"
              aria-label="Tribune Foot - Accueil"
            >
              <span className="text-red-500">TRIBUNE</span>{" "}
              <span className="text-white">FOOT</span>
            </Link>

            <p className="mt-4 max-w-sm text-sm leading-6 text-slate-400">
              Toute l'actualité du football français et international,
              les transferts, les analyses et les grands rendez-vous du
              ballon rond.
            </p>
          </div>

          <div>
            <h3 className="mb-4 text-xs font-black uppercase tracking-[0.14em] text-white">
              Rubriques
            </h3>

            <ul className="space-y-3 text-sm text-slate-400">
              <li>
                <Link
                  href="/categorie/france"
                  className="transition-colors hover:text-white"
                >
                  France
                </Link>
              </li>

              <li>
                <Link
                  href="/categorie/europe"
                  className="transition-colors hover:text-white"
                >
                  Europe
                </Link>
              </li>

              <li>
                <Link
                  href="/categorie/international"
                  className="transition-colors hover:text-white"
                >
                  International
                </Link>
              </li>

              <li>
                <Link
                  href="/categorie/mercato"
                  className="transition-colors hover:text-white"
                >
                  Mercato
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-xs font-black uppercase tracking-[0.14em] text-white">
              Tribune Foot
            </h3>

            <ul className="space-y-3 text-sm text-slate-400">
              <li>
                <Link
                  href="/articles"
                  className="transition-colors hover:text-white"
                >
                  Tous les articles
                </Link>
              </li>

              <li>
                <Link
                  href="/recherche"
                  className="transition-colors hover:text-white"
                >
                  Recherche
                </Link>
              </li>

              <li>
                <Link
                  href="/login"
                  className="transition-colors hover:text-white"
                >
                  Administration
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-xs font-black uppercase tracking-[0.14em] text-white">
              Informations
            </h3>

            <ul className="space-y-3 text-sm text-slate-400">
              <li>
                <Link
                  href="/mentions-legales"
                  className="transition-colors hover:text-white"
                >
                  Mentions légales
                </Link>
              </li>

              <li>
                <Link
                  href="/politique-confidentialite"
                  className="transition-colors hover:text-white"
                >
                  Confidentialité
                </Link>
              </li>

              <li>
                <Link
                  href="/contact"
                  className="transition-colors hover:text-white"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-slate-800 pt-6 text-center text-xs text-slate-500">
          © {year} Tribune Foot — Tous droits réservés.
        </div>
      </div>
    </footer>
  );
}
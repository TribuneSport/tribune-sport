import Link from "next/link";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-20 border-t bg-neutral-900 text-white">
      <div className="mx-auto max-w-7xl px-4 py-14">

        <div className="grid gap-10 md:grid-cols-4">

          <div>
            <h2 className="text-2xl font-black">
              <span className="text-red-600">TRIBUNE</span> SPORT
            </h2>

            <p className="mt-4 text-sm leading-7 text-gray-400">
              Toute l'actualité du football français et international,
              les transferts, les analyses, les interviews et les grands
              rendez-vous du ballon rond.
            </p>
          </div>

          <div>
            <h3 className="mb-4 font-bold uppercase tracking-wide">
              Rubriques
            </h3>

            <ul className="space-y-3 text-sm text-gray-400">
              <li><Link href="/categorie/france">France</Link></li>
              <li><Link href="/categorie/europe">Europe</Link></li>
              <li><Link href="/categorie/international">International</Link></li>
              <li><Link href="/categorie/mercato">Mercato</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-bold uppercase tracking-wide">
              Tribune Foot
            </h3>

            <ul className="space-y-3 text-sm text-gray-400">
              <li><Link href="/articles">Tous les articles</Link></li>
              <li><Link href="/recherche">Recherche</Link></li>
              <li><Link href="/login">Administration</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-bold uppercase tracking-wide">
              Informations
            </h3>

            <ul className="space-y-3 text-sm text-gray-400">
              <li><Link href="/mentions-legales">Mentions légales</Link></li>
              <li><Link href="/politique-confidentialite">Confidentialité</Link></li>
              <li><Link href="/contact">Contact</Link></li>
            </ul>
          </div>

        </div>

        <div className="mt-12 border-t border-neutral-800 pt-6 text-center text-sm text-gray-500">
          © {year} Tribune Foot — Tous droits réservés.
        </div>

      </div>
    </footer>
  );
}

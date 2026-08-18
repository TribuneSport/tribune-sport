import Link from "next/link";

const links = [
  ["Accueil", "/"],
  ["France", "/categorie/france"],
  ["Mercato", "/categorie/mercato"],
  ["Europe", "/categorie/europe"],
  ["International", "/categorie/international"],
  ["Transferts", "/transferts"],
  ["Classements", "/classements"],
];

export default function Navbar() {
  return (
    <nav className="border-b bg-white">

      <div className="mx-auto flex max-w-7xl items-center gap-7 overflow-x-auto px-4 py-3">

        {links.map(([label, href]) => (
          <Link
            key={href}
            href={href}
            className="whitespace-nowrap text-sm font-bold text-gray-900 transition hover:text-red-600"
          >
            {label}
          </Link>
        ))}

      </div>

    </nav>
  );
}
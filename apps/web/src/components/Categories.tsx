"use client";

import Link from "next/link";

const categories = [
  { name: "Tous", href: "/" },
  { name: "PSG", href: "/categorie/psg" },
  { name: "OM", href: "/categorie/om" },
  { name: "Ligue 1", href: "/categorie/ligue-1" },
  { name: "Premier League", href: "/categorie/premier-league" },
  { name: "Liga", href: "/categorie/liga" },
  { name: "Bundesliga", href: "/categorie/bundesliga" },
  { name: "Serie A", href: "/categorie/serie-a" },
  { name: "Mercato", href: "/categorie/mercato" },
];

export default function Categories() {
  return (
    <div className="mb-8 flex flex-wrap gap-3">
      {categories.map((category) => (
        <Link
          key={category.name}
          href={category.href}
          className="rounded-lg border px-4 py-2 hover:bg-gray-100"
        >
          {category.name}
        </Link>
      ))}
    </div>
  );
}
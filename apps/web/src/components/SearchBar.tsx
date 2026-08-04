"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SearchBar() {
  const router = useRouter();
  const [search, setSearch] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!search.trim()) return;

    router.push(`/recherche?q=${encodeURIComponent(search)}`);
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="🔍 Rechercher un club, un joueur ou un article..."
        className="w-full rounded-xl border border-gray-300 bg-gray-50 px-5 py-3 text-sm outline-none transition focus:border-red-600 focus:bg-white focus:ring-2 focus:ring-red-200"
      />
    </form>
  );
}
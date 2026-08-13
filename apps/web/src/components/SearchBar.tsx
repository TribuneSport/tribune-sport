"use client";

import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SearchBar() {
  const [value, setValue] = useState("");
  const router = useRouter();

  function submit(e: React.FormEvent) {
    e.preventDefault();

    if (!value.trim()) return;

    router.push(`/recherche?q=${encodeURIComponent(value)}`);
  }

  return (
    <form
      onSubmit={submit}
      className="relative w-full"
    >
      <Search
        size={20}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
      />

      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Rechercher un club, un joueur, une compétition..."
        className="w-full rounded-full border border-gray-300 bg-white py-3 pl-12 pr-4 outline-none transition focus:border-red-600"
      />
    </form>
  );
}
"use client";

import Link from "next/link";
import { Search, Menu } from "lucide-react";
import Navbar from "./Navbar";
import SearchBar from "./SearchBar";

export default function Header() {
  return (
    <>
      <header className="sticky top-0 z-50 border-b bg-white shadow-sm">

        <div className="mx-auto flex max-w-7xl items-center gap-6 px-4 py-4">

          <Link
            href="/"
            className="shrink-0 text-3xl font-black tracking-tight"
          >
            <span className="text-red-600">TRIBUNE</span>{" "}
            <span className="text-gray-900">SPORT</span>
          </Link>

          <div className="hidden flex-1 lg:block">
            <SearchBar />
          </div>

          <div className="flex items-center gap-3">

            <Link
              href="/recherche"
              className="rounded-full p-2 transition hover:bg-gray-100 lg:hidden"
              aria-label="Recherche"
            >
              <Search size={22} />
            </Link>

            <button
              className="rounded-full p-2 transition hover:bg-gray-100 lg:hidden"
              aria-label="Menu"
            >
              <Menu size={24} />
            </button>

          </div>

        </div>

      </header>

      <Navbar />
    </>
  );
}
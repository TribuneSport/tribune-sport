"use client";

import Link from "next/link";
import { Search, Menu } from "lucide-react";
import Navbar from "./Navbar";
import SearchBar from "./SearchBar";

export default function Header() {
  return (
    <>
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-[68px] max-w-7xl items-center gap-4 px-4 sm:px-6 lg:gap-8">
          <Link
            href="/"
            className="shrink-0 text-[22px] font-black leading-none tracking-[-0.04em] sm:text-2xl md:text-[27px]"
            aria-label="Tribune Foot - Accueil"
          >
            <span className="text-red-600">TRIBUNE</span>{" "}
            <span className="text-slate-950">FOOT</span>
          </Link>

          <div className="hidden min-w-0 flex-1 lg:block">
            <SearchBar />
          </div>

          <div className="ml-auto flex items-center gap-1">
            <Link
              href="/recherche"
              className="rounded-full p-2.5 text-slate-700 transition-colors hover:bg-slate-100 hover:text-red-600 lg:hidden"
              aria-label="Rechercher"
            >
              <Search size={21} strokeWidth={2.5} />
            </Link>

            <button
              type="button"
              className="rounded-full p-2.5 text-slate-700 transition-colors hover:bg-slate-100 hover:text-red-600 lg:hidden"
              aria-label="Ouvrir le menu"
            >
              <Menu size={23} strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </header>

      <Navbar />
    </>
  );
}
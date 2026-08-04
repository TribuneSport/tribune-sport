import Link from "next/link";
import Navbar from "./Navbar";
import SearchBar from "./SearchBar";

export default function Header() {
  return (
    <>
      <header className="sticky top-0 z-50 border-b bg-white shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <Link
            href="/"
            className="flex items-center gap-3 text-3xl font-extrabold text-red-700"
          >
            ⚽
            <span>Tribune Sport</span>
          </Link>

          <div className="hidden w-[420px] lg:block">
            <SearchBar />
          </div>

          <div className="flex items-center gap-3">
            <button className="rounded-xl border border-red-700 px-5 py-2 font-semibold text-red-700 transition hover:bg-red-700 hover:text-white">
              Connexion
            </button>
          </div>
        </div>

        <Navbar />
      </header>
    </>
  );
}
import Link from "next/link";
import { NAVIGATION } from "@/lib/navigation";

export default function Navbar() {
  return (
    <nav className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center gap-8 overflow-x-auto px-6 py-3">

        {NAVIGATION.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="whitespace-nowrap border-b-2 border-transparent pb-2 text-sm font-semibold uppercase tracking-wide text-slate-700 transition-all duration-200 hover:border-red-600 hover:text-red-600"
          >
            {item.label}
          </Link>
        ))}

      </div>
    </nav>
  );
}
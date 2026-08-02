import Link from "next/link";

export default function AdminMenu() {

  return (

    <aside className="mb-10 flex gap-4">

      <Link
        href="/admin"
        className="rounded bg-gray-900 px-5 py-3 text-white"
      >
        Articles
      </Link>

      <Link
        href="/admin/rss"
        className="rounded bg-gray-900 px-5 py-3 text-white"
      >
        RSS
      </Link>

      <Link
        href="/admin/settings"
        className="rounded bg-gray-900 px-5 py-3 text-white"
      >
        Paramètres
      </Link>

    </aside>

  );

}
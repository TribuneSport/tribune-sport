import Link from "next/link";
import { news } from "../data/news";

export default function MostRead() {
  return (
    <aside className="rounded-2xl bg-white p-6 shadow-lg">
      <h2 className="mb-6 border-b pb-3 text-2xl font-bold">
        🔥 Les plus lus
      </h2>

      <div className="space-y-5">
        {news.map((article) => (
          <Link
            key={article.id}
            href={`/article/${article.id}`}
            className="block border-b pb-4 transition hover:text-red-700 last:border-b-0"
          >
            <p className="text-sm font-bold text-red-700">
              {article.category}
            </p>

            <h3 className="mt-2 font-semibold">
              {article.title}
            </h3>
          </Link>
        ))}
      </div>
    </aside>
  );
}
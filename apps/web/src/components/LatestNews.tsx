import Image from "next/image";
import Link from "next/link";
import { news } from "../data/news";

export default function LatestNews() {
  return (
    <section>
      <h2 className="mb-6 text-2xl font-bold">
        📰 Derniers articles
      </h2>

      <div className="space-y-6">
        {news.map((article) => (
          <div
            key={article.id}
            className="flex gap-4 border-b pb-6 last:border-b-0"
          >
            <Image
              src={article.image}
              alt={article.title}
              width={180}
              height={100}
              className="h-24 w-40 rounded-lg object-cover"
            />

            <div className="flex-1">
              <p className="text-sm font-bold text-red-700">
                {article.category}
              </p>

              <h3 className="mt-1 text-lg font-bold">
                {article.title}
              </h3>

              <p className="mt-2 text-sm text-gray-600">
                {article.summary}
              </p>

              <Link
                href={`/article/${article.id}`}
                className="mt-3 inline-block font-semibold text-red-700 hover:underline"
              >
                Lire l'article →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
import Image from "next/image";
import Link from "next/link";
import { news } from "../data/news";

export default function FeaturedArticle() {
  const article = news[0];

  return (
    <section className="mb-10 overflow-hidden rounded-2xl bg-white shadow-lg">
      <Image
        src={article.image}
        alt={article.title}
        width={1200}
        height={500}
        className="h-96 w-full object-cover"
      />

      <div className="p-8">
        <span className="rounded-full bg-red-100 px-3 py-1 text-sm font-bold text-red-700">
          {article.category}
        </span>

        <h2 className="mt-4 text-4xl font-bold">
          {article.title}
        </h2>

        <p className="mt-4 text-lg text-gray-600">
          {article.summary}
        </p>

        <Link
          href={`/article/${article.id}`}
          className="mt-6 inline-block rounded-lg bg-red-700 px-6 py-3 text-white transition hover:bg-red-800"
        >
          Lire l'article →
        </Link>
      </div>
    </section>
  );
}
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

type Article = {
  id: number;
  slug: string;
  title: string;
  summary: string;
  category: string;
  image: string | null;
  createdAt: string;
};

export default function LatestNews() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/articles/latest")
      .then((res) => res.json())
      .then((data) => {
        setArticles(data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="mt-12">

        <div className="mb-8 flex items-center justify-between">

          <h2 className="text-3xl font-black">
            Dernières actualités
          </h2>

          <div className="h-5 w-20 animate-pulse rounded bg-gray-200" />

        </div>

        <div className="space-y-6">

          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="h-52 animate-pulse rounded-3xl bg-gray-200"
            />
          ))}

        </div>

      </section>
    );
  }

  return (
    <section className="mt-12">

      <div className="mb-8 flex items-center justify-between">

        <h2 className="text-3xl font-black">
          Dernières actualités
        </h2>

        <Link
          href="/articles"
          className="font-bold text-red-700 hover:underline"
        >
          Voir tout →
        </Link>

      </div>

      <div className="space-y-6">

        {articles.map((article) => (
          <Link
            key={article.id}
            href={`/article/${article.slug}`}
            className="group block overflow-hidden rounded-3xl border bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
          >

            <div className="grid md:grid-cols-[300px_1fr]">

              <div className="relative h-64 md:h-full">

                <Image
                  src={article.image || "/football.jpg"}
                  alt={article.title}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-105"
                />

              </div>

              <div className="flex flex-col justify-between p-8">

                <div>

                  <span className="inline-flex rounded-full bg-red-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-red-700">
                    {article.category}
                  </span>

                  <h3 className="mt-5 text-3xl font-black leading-tight transition group-hover:text-red-700">
                    {article.title}
                  </h3>

                  <p className="mt-5 line-clamp-3 text-gray-600">
                    {article.summary}
                  </p>

                </div>

                <div className="mt-8 flex items-center justify-between">

                  <span className="text-sm text-gray-500">
                    {new Date(article.createdAt).toLocaleDateString("fr-FR")}
                  </span>

                  <span className="font-bold text-red-700">
                    Lire l'article →
                  </span>

                </div>

              </div>

            </div>

          </Link>
        ))}

      </div>

    </section>
  );
}
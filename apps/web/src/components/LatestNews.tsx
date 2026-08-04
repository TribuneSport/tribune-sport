"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

type Article = {
  id: number;
  title: string;
  summary: string;
  category: string;
  image: string;
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
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <section className="mt-12">
        <h2 className="mb-6 text-3xl font-bold">
          📰 Dernières actualités
        </h2>

        <div className="space-y-6">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="h-44 animate-pulse rounded-2xl bg-gray-200"
            />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="mt-12">
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-3xl font-bold">
          📰 Dernières actualités
        </h2>

        <Link
          href="/actualites"
          className="font-semibold text-red-700 hover:underline"
        >
          Voir tout →
        </Link>
      </div>

      <div className="space-y-6">
        {articles.map((article) => (
          <Link
            key={article.id}
            href={`/article/${article.id}`}
            className="group block overflow-hidden rounded-2xl bg-white shadow transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="grid md:grid-cols-[260px_1fr]">
              <div className="relative h-56 md:h-full">
                <Image
                  src={article.image || "/placeholder.jpg"}
                  alt={article.title}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
              </div>

              <div className="flex flex-col justify-between p-6">
                <div>
                  <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-700">
                    {article.category}
                  </span>

                  <h3 className="mt-4 text-2xl font-bold transition group-hover:text-red-700">
                    {article.title}
                  </h3>

                  <p className="mt-4 line-clamp-3 text-gray-600">
                    {article.summary}
                  </p>
                </div>

                <div className="mt-6 flex items-center justify-between">
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
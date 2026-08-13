import Link from "next/link";
import Image from "next/image";
import { db } from "@/lib/db";

type Props = {
  title: string;
  category: string;
};

export default async function CategorySection({
  title,
  category,
}: Props) {
  const articles = await db.article.findMany({
    where: {
      published: true,
      category,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 4,
  });

  if (articles.length === 0) return null;

  return (
    <section className="mt-16">

      <div className="mb-8 flex items-center justify-between">

        <h2 className="text-3xl font-black">
          {title}
        </h2>

        <Link
          href={`/categorie/${category.toLowerCase().replace(/\s+/g, "-")}`}
          className="font-bold text-red-700 hover:underline"
        >
          Voir tout →
        </Link>

      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

        {articles.map((article) => (
          <Link
            key={article.id}
            href={`/article/${article.slug}`}
            className="group overflow-hidden rounded-3xl border bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
          >

            <div className="relative h-56 overflow-hidden">

              <Image
                src={article.image || "/football.jpg"}
                alt={article.title}
                fill
                className="object-cover transition duration-500 group-hover:scale-105"
              />

            </div>

            <div className="p-6">

              <span className="inline-flex rounded-full bg-red-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-red-700">
                {article.category}
              </span>

              <h3 className="mt-4 line-clamp-2 text-xl font-black leading-7 transition group-hover:text-red-700">
                {article.title}
              </h3>

              <p className="mt-4 line-clamp-3 text-gray-600">
                {article.summary}
              </p>

              <div className="mt-6 font-bold text-red-700">
                Lire l'article →
              </div>

            </div>

          </Link>
        ))}

      </div>

    </section>
  );
}
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

  if (articles.length === 0) {
    return null;
  }

  const categorySlug = category
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\s+/g, "-");

  return (
    <section className="border-t border-slate-200 pt-8">
      <div className="mb-5 flex items-end justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="h-8 w-1 rounded-full bg-red-600" />

          <h2 className="text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
            {title}
          </h2>
        </div>

        <Link
          href={`/categorie/${categorySlug}`}
          className="shrink-0 text-sm font-bold text-red-600 transition-colors hover:text-red-800"
        >
          Voir tout →
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {articles.map((article) => (
          <Link
            key={article.id}
            href={`/article/${article.slug}`}
            className="group overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 transition duration-300 hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="relative h-48 overflow-hidden bg-slate-100">
              <Image
                src={article.image || "/football.jpg"}
                alt={article.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
                className="object-cover transition duration-500 group-hover:scale-105"
              />
            </div>

            <div className="p-4">
              <span className="text-[10px] font-black uppercase tracking-wide text-red-600">
                {article.category}
              </span>

              <h3 className="mt-1.5 line-clamp-2 text-base font-black leading-6 text-slate-950 transition-colors group-hover:text-red-600">
                {article.title}
              </h3>

              {article.summary && (
                <p className="mt-2 line-clamp-2 text-sm leading-5 text-slate-500">
                  {article.summary}
                </p>
              )}

              <div className="mt-4 text-xs font-black uppercase tracking-wide text-red-600">
                Lire l'article →
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";

type Props = {
  title: string;
  category: string;
};

export default async function CategorySection({
  title,
  category,
}: Props) {
  const articles = await prisma.article.findMany({
    where: {
      category,
      published: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 4,
  });

  if (articles.length === 0) return null;

  return (
    <section className="mt-12">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-3xl font-bold">{title}</h2>

        <Link
          href={`/categorie/${category.toLowerCase().replace(/ /g, "-")}`}
          className="font-semibold text-red-700 hover:underline"
        >
          Voir tout →
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {articles.map((article) => (
          <Link
            key={article.id}
            href={`/article/${article.id}`}
            className="overflow-hidden rounded-2xl border bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
          >
            <Image
              src={article.image || "/placeholder.jpg"}
              alt={article.title}
              width={500}
              height={300}
              className="h-48 w-full object-cover"
            />

            <div className="p-5">
              <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-700">
                {article.category}
              </span>

              <h3 className="mt-4 line-clamp-2 text-xl font-bold">
                {article.title}
              </h3>

              <p className="mt-3 line-clamp-3 text-gray-600">
                {article.summary}
              </p>

              <div className="mt-5 font-semibold text-red-700">
                Lire →
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
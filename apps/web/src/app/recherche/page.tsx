import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";

type Props = {
  searchParams: Promise<{
    q?: string;
  }>;
};

export default async function RecherchePage({
  searchParams,
}: Props) {
  const { q } = await searchParams;

  const articles = await prisma.article.findMany({
    where: q
      ? {
          OR: [
            {
              title: {
                contains: q,
                mode: "insensitive",
              },
            },
            {
              summary: {
                contains: q,
                mode: "insensitive",
              },
            },
            {
              category: {
                contains: q,
                mode: "insensitive",
              },
            },
          ],
          published: true,
        }
      : {
          published: true,
        },
    orderBy: {
      createdAt: "desc",
    },
    take: 50,
  });

  return (
    <main className="min-h-screen bg-slate-100">

      <div className="mx-auto max-w-7xl py-10">

        <h1 className="mb-10 text-5xl font-extrabold">
          Recherche
        </h1>

        <p className="mb-10 text-gray-600">
          {articles.length} résultat(s)
          {q && <> pour <strong>"{q}"</strong></>}
        </p>

        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">

          {articles.map((article) => (

            <Link
              key={article.id}
              href={`/article/${article.slug}`}
              className="overflow-hidden rounded-2xl bg-white shadow transition hover:-translate-y-1 hover:shadow-xl"
            >

              <Image
                src={article.image || "/placeholder.jpg"}
                alt={article.title}
                width={600}
                height={350}
                className="h-56 w-full object-cover"
              />

              <div className="p-6">

                <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-700">
                  {article.category}
                </span>

                <h2 className="mt-4 text-2xl font-bold">
                  {article.title}
                </h2>

                <p className="mt-4 line-clamp-3 text-gray-600">
                  {article.summary}
                </p>

              </div>

            </Link>

          ))}

        </div>

      </div>

    </main>
  );
}
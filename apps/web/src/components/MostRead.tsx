import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function MostRead() {

  const articles = await prisma.article.findMany({
    take: 5,
    orderBy: {
      createdAt: "desc",
    },
  });

  return (

    <aside className="rounded-xl bg-white p-6 shadow">

      <h2 className="mb-6 text-2xl font-bold">
        🔥 Les dernières infos
      </h2>

      <div className="space-y-5">

        {articles.map((article) => (

          <div key={article.id}>

            <p className="text-sm font-bold text-red-700">
              {article.category}
            </p>

            <Link
              href={`/article/${article.id}`}
              className="font-semibold hover:text-red-700"
            >
              {article.title}
            </Link>

          </div>

        ))}

      </div>

    </aside>

  );

}
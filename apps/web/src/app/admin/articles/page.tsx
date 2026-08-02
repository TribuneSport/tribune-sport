import { prisma } from "@/lib/prisma";
import ArticleCard from "@/components/admin/ArticleCard";

export default async function Page() {

  const articles = await prisma.article.findMany({

    orderBy: {
      createdAt: "desc",
    },

  });

  return (

    <main className="min-h-screen bg-gray-100 p-8">

      <h1 className="mb-8 text-4xl font-bold">

        Gestion des articles

      </h1>

      <div className="space-y-6">

        {articles.map((article) => (

          <ArticleCard

            key={article.id}

            article={article}

          />

        ))}

      </div>

    </main>

  );

}
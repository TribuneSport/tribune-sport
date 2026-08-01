import Sidebar from "../../components/Sidebar";
import { prisma } from "@/lib/prisma";
import NewsCard from "../../components/NewsCard";

export default async function ArticlesPage() {
  const articles = await prisma.article.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <main>
      <div className="flex">
        <Sidebar />

        <section className="flex-1 p-8">
          <h1 className="mb-8 text-4xl font-bold">
            Tous les articles
          </h1>

          {articles.length === 0 ? (
            <p className="text-gray-500">
              Aucun article disponible.
            </p>
          ) : (
            <div className="grid gap-6 lg:grid-cols-3">
              {articles.map((article) => (
                <NewsCard
                  key={article.id}
                  id={article.id}
                  title={article.title}
                  category={article.category}
                  summary={article.summary}
                  date={new Date(article.createdAt).toLocaleDateString(
                    "fr-FR"
                  )}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
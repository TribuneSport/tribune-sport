import Header from "../../../components/Header";
import Sidebar from "../../../components/Sidebar";
import Footer from "../../../components/Footer";
import NewsCard from "../../../components/NewsCard";
import { news } from "../../../data/news";
import { notFound } from "next/navigation";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const category = slug
    .replace(/-/g, " ")
    .toLowerCase();

  const articles = news.filter(
    (article) =>
      article.category.toLowerCase() === category
  );

  if (articles.length === 0) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-slate-100">
      <Header />

      <div className="flex">
        <Sidebar />

        <section className="flex-1 p-8">
          <h1 className="mb-8 text-4xl font-bold">
            {articles[0].category}
          </h1>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {articles.map((article) => (
              <NewsCard
                key={article.id}
                id={article.id}
                title={article.title}
                category={article.category}
                summary={article.summary}
                date={article.date}
                image={article.image}
              />
            ))}
          </div>

          <Footer />
        </section>
      </div>
    </main>
  );
}
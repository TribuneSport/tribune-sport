import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import Footer from "../../components/Footer";
import NewsCard from "../../components/NewsCard";
import { news } from "../../data/news";

export default function PSGPage() {
  const psgNews = news.filter(
    (article) => article.category === "PSG"
  );

  return (
    <main className="min-h-screen bg-slate-100">
      <Header />

      <div className="flex">
        <Sidebar />

        <section className="flex-1 p-8">
          <h1 className="text-4xl font-bold mb-2">
            🔵🔴 Paris Saint-Germain
          </h1>

          <p className="mb-8 text-gray-600">
            Toute l'actualité du Paris Saint-Germain :
            transferts, matchs, analyses, conférences de presse
            et mercato.
          </p>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {psgNews.map((article) => (
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
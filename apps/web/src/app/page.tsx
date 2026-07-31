import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import NewsCard from "../components/NewsCard";
import StatCard from "../components/StatCard";
import { news } from "../data/news";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-100">
      <Header />

      <div className="flex">
        <Sidebar />

        <section className="flex-1 p-8">
          <div className="grid gap-6 mb-8 md:grid-cols-2 xl:grid-cols-4">
            <StatCard title="Articles" value="248" />
            <StatCard title="Matchs" value="42" />
            <StatCard title="Joueurs" value="125" />
            <StatCard title="Clubs suivis" value="18" />
          </div>

          <h2 className="text-3xl font-bold mb-6">
            À la une
          </h2>

          <div className="grid gap-6 lg:grid-cols-3">
            {news.map((article) => (
              <NewsCard
                key={article.id}
                title={article.title}
                category={article.category}
                summary={article.summary}
                date={article.date}
              />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
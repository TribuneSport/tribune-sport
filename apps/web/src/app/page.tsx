import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import Hero from "@/components/Hero";
import FeaturedArticle from "@/components/FeaturedArticle";
import LatestNews from "@/components/LatestNews";
import MostRead from "@/components/MostRead";
import Footer from "@/components/Footer";

import { ArticleService } from "@/services/article.service";

export default async function Home() {

  const service = new ArticleService();

  const articles = await service.getLatestArticles(20);

  return (

    <main className="flex">

      <Sidebar />

      <section className="flex-1 p-8">

        <Header />

        <Hero />

        <FeaturedArticle />

        <div className="mb-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">

          <div className="rounded-xl bg-white p-6 shadow">
            <h3 className="text-gray-500">
              Articles
            </h3>

            <p className="text-3xl font-bold">
              {articles.length}
            </p>
          </div>

          <div className="rounded-xl bg-white p-6 shadow">
            <h3 className="text-gray-500">
              Brouillons
            </h3>

            <p className="text-3xl font-bold">
              {articles.filter(a => !a.published).length}
            </p>
          </div>

          <div className="rounded-xl bg-white p-6 shadow">
            <h3 className="text-gray-500">
              Publiés
            </h3>

            <p className="text-3xl font-bold">
              {articles.filter(a => a.published).length}
            </p>
          </div>

          <div className="rounded-xl bg-white p-6 shadow">
            <h3 className="text-gray-500">
              Clubs
            </h3>

            <p className="text-3xl font-bold">
              {
                [...new Set(articles.map(a => a.category))].length
              }
            </p>
          </div>

        </div>

        <div className="grid gap-8 lg:grid-cols-3">

          <div className="lg:col-span-2">

            <LatestNews />

          </div>

          <MostRead />

        </div>

        <Footer />

      </section>

    </main>

  );

}
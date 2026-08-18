import Header from "@/components/Header";
import FeaturedArticle from "@/components/FeaturedArticle";
import LatestNews from "@/components/LatestNews";
import MostRead from "@/components/MostRead";
import CategorySection from "@/components/CategorySection";
import Footer from "@/components/Footer";

export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-100">

      <Header />

      <div className="mx-auto max-w-7xl px-4 py-6">

        {/* ARTICLE PRINCIPAL + LES PLUS LUS */}
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">

          <FeaturedArticle />

          <MostRead />

        </div>

        {/* DERNIÈRES ACTUALITÉS */}
        <div className="mt-8">
          <LatestNews />
        </div>

        {/* SECTIONS */}
        <div className="mt-10 space-y-10">

          <CategorySection
            title="🇫🇷 France"
            category="France"
          />

          <CategorySection
            title="💰 Mercato"
            category="Mercato"
          />

          <CategorySection
            title="🌍 Europe"
            category="Europe"
          />

          <CategorySection
            title="🌎 International"
            category="International"
          />

        </div>

      </div>

      <Footer />

    </main>
  );
}
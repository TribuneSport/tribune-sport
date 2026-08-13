import Header from "@/components/Header";
import Hero from "@/components/Hero";
import FeaturedArticle from "@/components/FeaturedArticle";
import LatestNews from "@/components/LatestNews";
import MostRead from "@/components/MostRead";
import CategorySection from "@/components/CategorySection";
import Footer from "@/components/Footer";

export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-100">

      <Header />

      <div className="mx-auto max-w-7xl px-4 py-8">

        <Hero />

        <div className="mt-10 grid gap-10 lg:grid-cols-[2fr_380px]">

          <section className="space-y-14">

            <FeaturedArticle />

            <LatestNews />

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

          </section>

          <MostRead />

        </div>

      </div>

      <Footer />

    </main>
  );
}
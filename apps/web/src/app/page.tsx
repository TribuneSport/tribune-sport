"use client";

import { useState } from "react";

import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Hero from "../components/Hero";
import FeaturedArticle from "../components/FeaturedArticle";
import LatestNews from "../components/LatestNews";
import MostRead from "../components/MostRead";
import SearchBar from "../components/SearchBar";
import Categories from "../components/Categories";
import StatCard from "../components/StatCard";
import Footer from "../components/Footer";

import { news } from "../data/news";

export default function Home() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tous");

  const filteredNews = news.filter((article) => {
    const matchesSearch = (
      article.title +
      article.summary +
      article.category
    )
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesCategory =
      selectedCategory === "Tous" ||
      article.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <main className="min-h-screen bg-slate-100">
      <Header />

      <div className="flex">
        <Sidebar />

        <section className="flex-1 p-8">
          <Hero />

          <FeaturedArticle />

          <div className="mb-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            <StatCard
              title="Articles affichés"
              value={filteredNews.length.toString()}
            />

            <StatCard
              title="Total articles"
              value={news.length.toString()}
            />

            <StatCard
              title="Joueurs"
              value="125"
            />

            <StatCard
              title="Clubs suivis"
              value="18"
            />
          </div>

          <SearchBar
            value={search}
            onChange={setSearch}
          />

          <Categories
            selected={selectedCategory}
            onSelect={setSelectedCategory}
          />

          <div className="grid gap-8 lg:grid-cols-3 mb-12">
            <div className="lg:col-span-2">
              <LatestNews />
            </div>

            <MostRead />
          </div>

          <Footer />
        </section>
      </div>
    </main>
  );
}
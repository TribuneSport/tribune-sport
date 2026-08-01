"use client";

import { useState } from "react";

export default function NouveauArticlePage() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("PSG");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);

    const response = await fetch("/api/articles", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        category,
        summary,
        content,
        image,
      }),
    });

    setLoading(false);

    if (!response.ok) {
      alert("Erreur lors de la création de l'article");
      return;
    }

    alert("Article publié avec succès !");

    setTitle("");
    setCategory("PSG");
    setSummary("");
    setContent("");
    setImage("");
  }

  return (
    <main className="p-8">
      <h1 className="mb-8 text-3xl font-bold">
        Nouvel article
      </h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-lg bg-white p-8 shadow"
      >
        <div>
          <label className="mb-2 block font-semibold">
            Titre
          </label>

          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-lg border p-3"
          />
        </div>

        <div>
          <label className="mb-2 block font-semibold">
            Catégorie
          </label>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full rounded-lg border p-3"
          >
            <option>PSG</option>
            <option>OM</option>
            <option>Ligue 1</option>
            <option>Premier League</option>
            <option>Liga</option>
            <option>Bundesliga</option>
            <option>Serie A</option>
            <option>Mercato</option>
          </select>
        </div>

        <div>
          <label className="mb-2 block font-semibold">
            Résumé
          </label>

          <textarea
            rows={3}
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            className="w-full rounded-lg border p-3"
          />
        </div>

        <div>
          <label className="mb-2 block font-semibold">
            Contenu
          </label>

          <textarea
            rows={10}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full rounded-lg border p-3"
          />
        </div>

        <div>
          <label className="mb-2 block font-semibold">
            Image
          </label>

          <input
            type="text"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            placeholder="/psg.png"
            className="w-full rounded-lg border p-3"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-red-700 px-6 py-3 text-white hover:bg-red-800 disabled:bg-gray-400"
        >
          {loading ? "Publication..." : "Publier l'article"}
        </button>
      </form>
    </main>
  );
}
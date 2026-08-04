"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function NewArticlePage() {
  const router = useRouter();

  const [form, setForm] = useState({
    title: "",
    summary: "",
    content: "",
    category: "Football",
    image: "",
  });

  function update(name: string, value: string) {
    setForm({
      ...form,
      [name]: value,
    });
  }

  async function create(e: React.FormEvent) {
    e.preventDefault();

    const res = await fetch("/api/admin/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    router.push(`/admin/article/${data.slug}`);
  }

  return (
    <main className="min-h-screen bg-slate-100 py-10">

      <div className="mx-auto max-w-5xl rounded-2xl bg-white p-10 shadow">

        <h1 className="mb-10 text-4xl font-extrabold">
          Nouvel article
        </h1>

        <form
          onSubmit={create}
          className="space-y-8"
        >

          <input
            placeholder="Titre"
            value={form.title}
            onChange={(e) => update("title", e.target.value)}
            className="w-full rounded-xl border p-4"
          />

          <textarea
            rows={4}
            placeholder="Résumé"
            value={form.summary}
            onChange={(e) => update("summary", e.target.value)}
            className="w-full rounded-xl border p-4"
          />

          <textarea
            rows={16}
            placeholder="Contenu"
            value={form.content}
            onChange={(e) => update("content", e.target.value)}
            className="w-full rounded-xl border p-4"
          />

          <input
            placeholder="Catégorie"
            value={form.category}
            onChange={(e) => update("category", e.target.value)}
            className="w-full rounded-xl border p-4"
          />

          <input
            placeholder="URL de l'image"
            value={form.image}
            onChange={(e) => update("image", e.target.value)}
            className="w-full rounded-xl border p-4"
          />

          <button
            className="rounded-xl bg-green-600 px-8 py-4 font-bold text-white hover:bg-green-700"
          >
            Créer l'article
          </button>

        </form>

      </div>

    </main>
  );
}
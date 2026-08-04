"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import DeleteArticleButton from "./DeleteArticleButton";
import RichEditor from "./RichEditor";

type Props = {
  article: any;
};

export default function EditArticleForm({ article }: Props) {
  const router = useRouter();

  const [form, setForm] = useState(article);

  function change(name: string, value: string) {
    setForm({
      ...form,
      [name]: value,
    });
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();

    await fetch("/api/admin/update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    alert("Article enregistré.");

    router.refresh();
  }

  return (
    <form onSubmit={save} className="space-y-8">

      <div>
        <label className="mb-2 block font-semibold">
          Titre
        </label>

        <input
          value={form.title}
          onChange={(e) => change("title", e.target.value)}
          className="w-full rounded-xl border p-4"
        />
      </div>

      <div>
        <label className="mb-2 block font-semibold">
          Résumé
        </label>

        <textarea
          rows={4}
          value={form.summary}
          onChange={(e) => change("summary", e.target.value)}
          className="w-full rounded-xl border p-4"
        />
      </div>

      <div>
        <label className="mb-2 block font-semibold">
          Contenu
        </label>

        <RichEditor
          value={form.content}
          onChange={(value) => change("content", value)}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">

        <div>
          <label className="mb-2 block font-semibold">
            Catégorie
          </label>

          <input
            value={form.category}
            onChange={(e) => change("category", e.target.value)}
            className="w-full rounded-xl border p-4"
          />
        </div>

        <div>
          <label className="mb-2 block font-semibold">
            Image
          </label>

          <input
            value={form.image}
            onChange={(e) => change("image", e.target.value)}
            className="w-full rounded-xl border p-4"
          />
        </div>

      </div>

      <div>
        <label className="mb-2 block font-semibold">
          SEO Title
        </label>

        <input
          value={form.seoTitle ?? ""}
          onChange={(e) => change("seoTitle", e.target.value)}
          className="w-full rounded-xl border p-4"
        />
      </div>

      <div>
        <label className="mb-2 block font-semibold">
          SEO Description
        </label>

        <textarea
          rows={4}
          value={form.seoDescription ?? ""}
          onChange={(e) => change("seoDescription", e.target.value)}
          className="w-full rounded-xl border p-4"
        />
      </div>

      <div className="flex gap-4">

        <button
          type="submit"
          className="rounded-xl bg-green-600 px-8 py-4 font-bold text-white transition hover:bg-green-700"
        >
          💾 Enregistrer
        </button>

        <DeleteArticleButton id={article.id} />

      </div>

    </form>
  );
}
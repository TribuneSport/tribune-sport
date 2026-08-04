"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

interface Props {
  article?: any;
}

export default function ArticleForm({
  article,
}: Props) {
  const router = useRouter();

  const [form, setForm] = useState({
    title: article?.title ?? "",
    summary: article?.summary ?? "",
    content: article?.content ?? "",
    category: article?.category ?? "",
    image: article?.image ?? "",
    sourceUrl: article?.sourceUrl ?? "",
    seoTitle: article?.seoTitle ?? "",
    seoDescription: article?.seoDescription ?? "",
    published: article?.published ?? false,
  });

  async function save(e: React.FormEvent) {
    e.preventDefault();

    const url = article
      ? `/api/articles/${article.id}`
      : "/api/articles";

    const method = article ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      router.push("/admin/articles");
      router.refresh();
    }
  }

  return (
    <form
      onSubmit={save}
      className="space-y-5"
    >
      <input
        className="w-full rounded border p-3"
        placeholder="Titre"
        value={form.title}
        onChange={(e) =>
          setForm({
            ...form,
            title: e.target.value,
          })
        }
      />

      <input
        className="w-full rounded border p-3"
        placeholder="Résumé"
        value={form.summary}
        onChange={(e) =>
          setForm({
            ...form,
            summary: e.target.value,
          })
        }
      />

      <input
        className="w-full rounded border p-3"
        placeholder="Catégorie"
        value={form.category}
        onChange={(e) =>
          setForm({
            ...form,
            category: e.target.value,
          })
        }
      />

      <input
        className="w-full rounded border p-3"
        placeholder="Image"
        value={form.image}
        onChange={(e) =>
          setForm({
            ...form,
            image: e.target.value,
          })
        }
      />

      <input
        className="w-full rounded border p-3"
        placeholder="Source"
        value={form.sourceUrl}
        onChange={(e) =>
          setForm({
            ...form,
            sourceUrl: e.target.value,
          })
        }
      />

      <textarea
        rows={15}
        className="w-full rounded border p-3"
        placeholder="Contenu"
        value={form.content}
        onChange={(e) =>
          setForm({
            ...form,
            content: e.target.value,
          })
        }
      />

      <input
        className="w-full rounded border p-3"
        placeholder="SEO Title"
        value={form.seoTitle}
        onChange={(e) =>
          setForm({
            ...form,
            seoTitle: e.target.value,
          })
        }
      />

      <textarea
        rows={4}
        className="w-full rounded border p-3"
        placeholder="SEO Description"
        value={form.seoDescription}
        onChange={(e) =>
          setForm({
            ...form,
            seoDescription: e.target.value,
          })
        }
      />

      <label className="flex items-center gap-3">
        <input
          type="checkbox"
          checked={form.published}
          onChange={(e) =>
            setForm({
              ...form,
              published: e.target.checked,
            })
          }
        />

        Publier immédiatement
      </label>

      <button
        className="rounded-lg bg-blue-600 px-6 py-3 text-white"
        type="submit"
      >
        {article ? "Mettre à jour" : "Créer"}
      </button>
    </form>
  );
}
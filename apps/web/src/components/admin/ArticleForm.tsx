"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import RichTextEditor from "@/components/admin/RichTextEditor";
import ImageUploader from "@/components/admin/ImageUploader";

interface Article {
  id?: number;

  title: string;
  summary: string;
  content: string;

  category: string;
  image: string;
  sourceUrl: string;

  seoTitle: string | null;
  seoDescription: string | null;
  slug: string | null;

  published: boolean;
}

interface Props {
  article?: Article;
}

export default function ArticleForm({ article }: Props) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState<Article>({
    title: article?.title ?? "",
    summary: article?.summary ?? "",
    content: article?.content ?? "",
    category: article?.category ?? "",
    image: article?.image ?? "",
    sourceUrl: article?.sourceUrl ?? "",
    seoTitle: article?.seoTitle ?? "",
    seoDescription: article?.seoDescription ?? "",
    slug: article?.slug ?? "",
    published: article?.published ?? false,
  });

  function slugify(text: string) {
    return text
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  }

  function update<K extends keyof Article>(
    field: K,
    value: Article[K]
  ) {
    setForm((prev) => ({
      ...prev,
      [field]: value,
      ...(field === "title"
        ? { slug: slugify(value as string) }
        : {}),
    }));
  }

  async function save(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setLoading(true);

    try {
      const url = article
        ? `/api/articles/${article.id}`
        : "/api/articles";

      const method = article ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        throw new Error();
      }

      router.push("/admin/articles");
      router.refresh();
    } catch {
      alert("Erreur lors de l'enregistrement.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={save} className="space-y-8">

      <div>
        <label className="mb-2 block font-medium">
          Titre
        </label>

        <input
          className="w-full rounded-lg border p-3"
          value={form.title}
          onChange={(e) => update("title", e.target.value)}
          required
        />
      </div>

      <div>
        <label className="mb-2 block font-medium">
          Slug
        </label>

        <input
          className="w-full rounded-lg border bg-gray-100 p-3"
          value={form.slug ?? ""}
          readOnly
        />
      </div>

      <div>
        <label className="mb-2 block font-medium">
          Résumé
        </label>

        <textarea
          rows={4}
          className="w-full rounded-lg border p-3"
          value={form.summary}
          onChange={(e) => update("summary", e.target.value)}
        />
      </div>

      <div>
        <label className="mb-2 block font-medium">
          Catégorie
        </label>

        <input
          className="w-full rounded-lg border p-3"
          value={form.category}
          onChange={(e) => update("category", e.target.value)}
        />
      </div>

      <div>
        <label className="mb-2 block font-medium">
          Image
        </label>

        <ImageUploader
          value={form.image}
          onChange={(url) => update("image", url)}
        />
      </div>

      <div>
        <label className="mb-2 block font-medium">
          Source
        </label>

        <input
          className="w-full rounded-lg border p-3"
          value={form.sourceUrl}
          onChange={(e) => update("sourceUrl", e.target.value)}
        />
      </div>

      <div>
        <label className="mb-2 block font-medium">
          Contenu
        </label>

        <RichTextEditor
          value={form.content}
          onChange={(content) => update("content", content)}
        />
      </div>

      <div>
        <label className="mb-2 block font-medium">
          SEO Title
        </label>

        <input
          className="w-full rounded-lg border p-3"
          value={form.seoTitle ?? ""}
          onChange={(e) => update("seoTitle", e.target.value)}
        />
      </div>

      <div>
        <label className="mb-2 block font-medium">
          SEO Description
        </label>

        <textarea
          rows={4}
          className="w-full rounded-lg border p-3"
          value={form.seoDescription ?? ""}
          onChange={(e) =>
            update("seoDescription", e.target.value)
          }
        />
      </div>

      <div className="rounded-lg border bg-gray-50 p-5">

        <h2 className="mb-3 text-lg font-semibold">
          Aperçu Google
        </h2>

        <p className="text-xl text-blue-700">
          {form.seoTitle || form.title || "Titre"}
        </p>

        <p className="text-sm text-green-700">
          https://tribunesport.fr/article/{form.slug ?? ""}
        </p>

        <p className="mt-2 text-gray-700">
          {form.seoDescription ||
            form.summary ||
            "Description de l'article"}
        </p>

      </div>

      <div className="flex items-center gap-3 rounded-lg border p-4">

        <input
          id="published"
          type="checkbox"
          checked={form.published}
          onChange={(e) =>
            update("published", e.target.checked)
          }
        />

        <label htmlFor="published">
          Publier immédiatement
        </label>

      </div>

      <div className="flex justify-end gap-4">

        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-lg border px-6 py-3"
        >
          Annuler
        </button>

        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-blue-600 px-8 py-3 font-medium text-white"
        >
          {loading
            ? "Enregistrement..."
            : article
            ? "Mettre à jour"
            : "Créer l'article"}
        </button>

      </div>

    </form>
  );
}
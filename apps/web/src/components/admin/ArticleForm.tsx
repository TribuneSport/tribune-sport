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
  sourceUrl: string | null;

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
  const [publishing, setPublishing] = useState(false);

  const [form, setForm] = useState<Article>({
    id: article?.id,

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
        ? {
            slug: slugify(value as string),
          }
        : {}),
    }));
  }

  async function save(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    if (!form.title.trim()) {
      alert("Le titre est obligatoire.");
      return;
    }

    if (!form.summary.trim()) {
      alert("Le résumé est obligatoire.");
      return;
    }

    if (!form.content.trim()) {
      alert("Le contenu est obligatoire.");
      return;
    }

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

        body: JSON.stringify({
          title: form.title,
          summary: form.summary,
          content: form.content,

          category: form.category,
          image: form.image,
          sourceUrl: form.sourceUrl,

          seoTitle: form.seoTitle,
          seoDescription: form.seoDescription,
          slug: form.slug,

          published: form.published,
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        console.error("Erreur API :", data);

        throw new Error(
          data?.error || "Erreur lors de l'enregistrement."
        );
      }

      router.push("/admin/articles");
      router.refresh();
    } catch (error) {
      console.error(error);

      alert(
        error instanceof Error
          ? error.message
          : "Erreur lors de l'enregistrement."
      );
    } finally {
      setLoading(false);
    }
  }

  async function publishArticle() {
    if (!article?.id) {
      alert(
        "Enregistrez d'abord l'article avant de le publier."
      );
      return;
    }

    if (!form.title.trim()) {
      alert("Le titre est obligatoire.");
      return;
    }

    if (!form.summary.trim()) {
      alert("Le résumé est obligatoire.");
      return;
    }

    if (!form.content.trim()) {
      alert("Le contenu est obligatoire.");
      return;
    }

    setPublishing(true);

    try {
      /*
       * On sauvegarde d'abord les éventuelles modifications.
       */
      const updateResponse = await fetch(
        `/api/articles/${article.id}`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            title: form.title,
            summary: form.summary,
            content: form.content,

            category: form.category,
            image: form.image,
            sourceUrl: form.sourceUrl,

            seoTitle: form.seoTitle,
            seoDescription: form.seoDescription,
            slug: form.slug,

            published: false,
          }),
        }
      );

      const updateData = await updateResponse
        .json()
        .catch(() => null);

      if (!updateResponse.ok) {
        throw new Error(
          updateData?.error ||
            "Impossible d'enregistrer l'article."
        );
      }

      /*
       * Puis on publie.
       */
      const publishResponse = await fetch(
        "/api/articles/publish",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            id: article.id,
          }),
        }
      );

      const publishData = await publishResponse
        .json()
        .catch(() => null);

      if (!publishResponse.ok) {
        throw new Error(
          publishData?.error ||
            "Impossible de publier l'article."
        );
      }

      setForm((prev) => ({
        ...prev,
        published: true,
      }));

      alert("Article publié avec succès.");

      router.push("/admin/articles");
      router.refresh();
    } catch (error) {
      console.error(error);

      alert(
        error instanceof Error
          ? error.message
          : "Erreur lors de la publication."
      );
    } finally {
      setPublishing(false);
    }
  }

  return (
    <form
      onSubmit={save}
      className="space-y-8"
    >
      {/* TITRE */}
      <div>
        <label className="mb-2 block font-medium">
          Titre
        </label>

        <input
          className="w-full rounded-lg border p-3"
          value={form.title}
          onChange={(e) =>
            update("title", e.target.value)
          }
          required
        />
      </div>

      {/* SLUG */}
      <div>
        <label className="mb-2 block font-medium">
          Slug
        </label>

        <input
          className="w-full rounded-lg border bg-gray-100 p-3"
          value={form.slug ?? ""}
          readOnly
        />

        <p className="mt-1 text-sm text-gray-500">
          Généré automatiquement à partir du titre.
        </p>
      </div>

      {/* RESUME */}
      <div>
        <label className="mb-2 block font-medium">
          Résumé
        </label>

        <textarea
          rows={4}
          className="w-full rounded-lg border p-3"
          value={form.summary}
          onChange={(e) =>
            update("summary", e.target.value)
          }
          required
        />
      </div>

      {/* CATEGORIE */}
      <div>
        <label className="mb-2 block font-medium">
          Catégorie
        </label>

        <input
          className="w-full rounded-lg border p-3"
          value={form.category}
          onChange={(e) =>
            update("category", e.target.value)
          }
          placeholder="Ex : FC Metz"
          required
        />
      </div>

      {/* IMAGE */}
      <div>
        <label className="mb-2 block font-medium">
          Image
        </label>

        <ImageUploader
          value={form.image}
          onChange={(url) =>
            update("image", url)
          }
        />
      </div>

      {/* SOURCE */}
      <div>
        <label className="mb-2 block font-medium">
          Source
        </label>

        <input
          type="url"
          className="w-full rounded-lg border p-3"
          value={form.sourceUrl ?? ""}
          onChange={(e) =>
            update("sourceUrl", e.target.value)
          }
          placeholder="https://..."
        />
      </div>

      {/* CONTENU */}
      <div>
        <label className="mb-2 block font-medium">
          Contenu
        </label>

        <RichTextEditor
          value={form.content}
          onChange={(content) =>
            update("content", content)
          }
        />
      </div>

      {/* SEO TITLE */}
      <div>
        <label className="mb-2 block font-medium">
          SEO Title
        </label>

        <input
          className="w-full rounded-lg border p-3"
          value={form.seoTitle ?? ""}
          onChange={(e) =>
            update("seoTitle", e.target.value)
          }
        />
      </div>

      {/* SEO DESCRIPTION */}
      <div>
        <label className="mb-2 block font-medium">
          SEO Description
        </label>

        <textarea
          rows={4}
          className="w-full rounded-lg border p-3"
          value={form.seoDescription ?? ""}
          onChange={(e) =>
            update(
              "seoDescription",
              e.target.value
            )
          }
        />
      </div>

      {/* APERCU GOOGLE */}
      <div className="rounded-lg border bg-gray-50 p-5">
        <h2 className="mb-3 text-lg font-semibold">
          Aperçu Google
        </h2>

        <p className="text-xl text-blue-700">
          {form.seoTitle ||
            form.title ||
            "Titre"}
        </p>

        <p className="text-sm text-green-700">
          https://tribunesport.fr/article/
          {form.slug ?? ""}
        </p>

        <p className="mt-2 text-gray-700">
          {form.seoDescription ||
            form.summary ||
            "Description de l'article"}
        </p>
      </div>

      {/* STATUT */}
      <div className="rounded-lg border p-5">
        <div className="flex items-center gap-3">
          <div
            className={`h-3 w-3 rounded-full ${
              form.published
                ? "bg-green-500"
                : "bg-orange-500"
            }`}
          />

          <div>
            <p className="font-semibold">
              {form.published
                ? "Article publié"
                : "Article en brouillon"}
            </p>

            <p className="text-sm text-gray-500">
              {form.published
                ? "Cet article est actuellement visible sur le site."
                : "Cet article n'est pas encore visible publiquement."}
            </p>
          </div>
        </div>
      </div>

      {/* BOUTONS */}
      <div className="flex flex-wrap justify-end gap-4">
        <button
          type="button"
          onClick={() => router.back()}
          disabled={loading || publishing}
          className="rounded-lg border px-6 py-3"
        >
          Annuler
        </button>

        <button
          type="submit"
          disabled={loading || publishing}
          className="rounded-lg bg-blue-600 px-8 py-3 font-medium text-white"
        >
          {loading
            ? "Enregistrement..."
            : article
            ? "Enregistrer les modifications"
            : "Créer le brouillon"}
        </button>

        {article && (
          <button
            type="button"
            onClick={publishArticle}
            disabled={loading || publishing}
            className="rounded-lg bg-green-600 px-8 py-3 font-medium text-white"
          >
            {publishing
              ? "Publication..."
              : "✓ Publier l'article"}
          </button>
        )}
      </div>
    </form>
  );
}
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import DeleteArticleButton from "@/components/DeleteArticleButton";

type Article = {
  id: number;
  title: string;
  category: string;
  published: boolean;
  createdAt: Date | string;
  slug: string | null;
  sourceUrl: string | null;
  aiRewritten: boolean;
};

type Props = {
  articles: Article[];
};

export default function ArticlesTable({ articles }: Props) {
  const router = useRouter();

  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [processingId, setProcessingId] = useState<number | null>(null);
  const [processingBulk, setProcessingBulk] = useState(false);

  const allSelected =
    articles.length > 0 &&
    articles.every((article) =>
      selectedIds.includes(article.id)
    );

  function toggleArticle(id: number) {
    setSelectedIds((current) =>
      current.includes(id)
        ? current.filter((selectedId) => selectedId !== id)
        : [...current, id]
    );
  }

  function toggleAll() {
    if (allSelected) {
      setSelectedIds([]);
      return;
    }

    setSelectedIds(articles.map((article) => article.id));
  }

  async function publishArticle(id: number) {
    try {
      setProcessingId(id);

      const response = await fetch("/api/articles/publish", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.error || "Erreur lors de la publication."
        );
      }

      setSelectedIds((current) =>
        current.filter((selectedId) => selectedId !== id)
      );

      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Impossible de publier cet article.");
    } finally {
      setProcessingId(null);
    }
  }

  async function unpublishArticle(id: number) {
    const confirmed = window.confirm(
      "Voulez-vous dépublier cet article ?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setProcessingId(id);

      const response = await fetch(
        "/api/articles/unpublish",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.error || "Erreur lors de la dépublication."
        );
      }

      setSelectedIds((current) =>
        current.filter((selectedId) => selectedId !== id)
      );

      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Impossible de dépublier cet article.");
    } finally {
      setProcessingId(null);
    }
  }

  async function publishSelected() {
    if (selectedIds.length === 0) {
      return;
    }

    const confirmed = window.confirm(
      `Voulez-vous publier ${selectedIds.length} article${
        selectedIds.length > 1 ? "s" : ""
      } ?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setProcessingBulk(true);

      const response = await fetch(
        "/api/articles/publish-bulk",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ids: selectedIds,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.error || "Erreur lors de la publication."
        );
      }

      alert(
        `${data.count} article${
          data.count > 1 ? "s" : ""
        } publié${data.count > 1 ? "s" : ""}.`
      );

      setSelectedIds([]);
      router.refresh();
    } catch (error) {
      console.error(error);
      alert(
        "Impossible de publier les articles sélectionnés."
      );
    } finally {
      setProcessingBulk(false);
    }
  }

  async function unpublishSelected() {
    if (selectedIds.length === 0) {
      return;
    }

    const confirmed = window.confirm(
      `Voulez-vous dépublier ${selectedIds.length} article${
        selectedIds.length > 1 ? "s" : ""
      } ?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setProcessingBulk(true);

      const response = await fetch(
        "/api/articles/unpublish-bulk",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ids: selectedIds,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.error || "Erreur lors de la dépublication."
        );
      }

      alert(
        `${data.count} article${
          data.count > 1 ? "s" : ""
        } dépublié${data.count > 1 ? "s" : ""}.`
      );

      setSelectedIds([]);
      router.refresh();
    } catch (error) {
      console.error(error);
      alert(
        "Impossible de dépublier les articles sélectionnés."
      );
    } finally {
      setProcessingBulk(false);
    }
  }

  async function deleteSelected() {
    if (selectedIds.length === 0) {
      return;
    }

    const confirmed = window.confirm(
      `ATTENTION : voulez-vous supprimer définitivement ${
        selectedIds.length
      } article${selectedIds.length > 1 ? "s" : ""} ?\n\nCette action est irréversible.`
    );

    if (!confirmed) {
      return;
    }

    try {
      setProcessingBulk(true);

      const response = await fetch(
        "/api/articles/delete-bulk",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ids: selectedIds,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.error ||
            "Erreur lors de la suppression des articles."
        );
      }

      alert(
        `${data.count} article${
          data.count > 1 ? "s" : ""
        } supprimé${data.count > 1 ? "s" : ""}.`
      );

      setSelectedIds([]);
      router.refresh();
    } catch (error) {
      console.error(error);
      alert(
        "Impossible de supprimer les articles sélectionnés."
      );
    } finally {
      setProcessingBulk(false);
    }
  }

  return (
    <div className="overflow-hidden rounded-3xl bg-white shadow-xl">
      <div className="border-b p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

          <div>
            <h2 className="text-3xl font-black">
              Liste des articles
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {articles.length} article
              {articles.length > 1 ? "s" : ""} au total
            </p>
          </div>

          {selectedIds.length > 0 && (
            <div className="flex flex-wrap items-center gap-3">

              <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-bold text-blue-700">
                {selectedIds.length} sélectionné
                {selectedIds.length > 1 ? "s" : ""}
              </span>

              <button
                type="button"
                onClick={publishSelected}
                disabled={processingBulk}
                className="rounded-xl bg-green-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {processingBulk
                  ? "Traitement..."
                  : "✓ Publier la sélection"}
              </button>

              <button
                type="button"
                onClick={unpublishSelected}
                disabled={processingBulk}
                className="rounded-xl bg-orange-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {processingBulk
                  ? "Traitement..."
                  : "↩ Dépublier la sélection"}
              </button>

              <button
                type="button"
                onClick={deleteSelected}
                disabled={processingBulk}
                className="rounded-xl bg-red-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {processingBulk
                  ? "Traitement..."
                  : "🗑 Supprimer la sélection"}
              </button>

              <button
                type="button"
                onClick={() => setSelectedIds([])}
                disabled={processingBulk}
                className="rounded-xl bg-slate-200 px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-300"
              >
                Annuler
              </button>

            </div>
          )}

        </div>
      </div>

      {articles.length > 0 && (
        <div className="border-b bg-slate-50 px-4 py-3 sm:px-6">

          <label className="flex cursor-pointer items-center gap-3 text-sm font-bold text-slate-700">

            <input
              type="checkbox"
              checked={allSelected}
              onChange={toggleAll}
              disabled={processingBulk}
              className="h-5 w-5 rounded border-slate-300"
            />

            Sélectionner tous les articles

            <span className="font-normal text-slate-500">
              ({articles.length})
            </span>

          </label>

        </div>
      )}

      <div className="overflow-x-auto">

        <table className="w-full min-w-[1200px]">

          <thead className="bg-slate-100">

            <tr>

              <th className="w-14 p-4 text-center">
                ✓
              </th>

              <th className="p-4 text-left">
                Titre
              </th>

              <th className="p-4 text-left">
                Catégorie
              </th>

              <th className="p-4 text-left">
                Origine
              </th>

              <th className="p-4 text-left">
                Statut
              </th>

              <th className="p-4 text-left">
                Date
              </th>

              <th className="p-4 text-right">
                Actions
              </th>

            </tr>

          </thead>

          <tbody>

            {articles.map((article) => (

              <tr
                key={article.id}
                className="border-t transition hover:bg-slate-50"
              >

                <td className="p-4 text-center">

                  <input
                    type="checkbox"
                    checked={selectedIds.includes(article.id)}
                    onChange={() =>
                      toggleArticle(article.id)
                    }
                    disabled={processingBulk}
                    className="h-5 w-5 rounded border-slate-300"
                    aria-label={`Sélectionner ${article.title}`}
                  />

                </td>

                <td className="max-w-md p-4 font-semibold">

                  <div className="line-clamp-2">
                    {article.title}
                  </div>

                </td>

                <td className="p-4">

                  <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium">
                    {article.category}
                  </span>

                </td>

                <td className="p-4">

                  {article.aiRewritten ? (

                    <span
                      title="Article réécrit par l'agent éditorial Ollama"
                      className="inline-flex items-center gap-2 rounded-full bg-purple-100 px-3 py-1 text-sm font-semibold text-purple-700"
                    >
                      🤖 Ollama
                    </span>

                  ) : article.sourceUrl ? (

                    <span
                      title="Article importé depuis un flux RSS"
                      className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-700"
                    >
                      📡 RSS
                    </span>

                  ) : (

                    <span
                      title="Article créé manuellement"
                      className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700"
                    >
                      ✍️ Manuel
                    </span>

                  )}

                </td>

                <td className="p-4">

                  {article.published ? (

                    <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">
                      Publié
                    </span>

                  ) : (

                    <span className="rounded-full bg-orange-100 px-3 py-1 text-sm font-semibold text-orange-700">
                      Brouillon
                    </span>

                  )}

                </td>

                <td className="whitespace-nowrap p-4">

                  {new Date(
                    article.createdAt
                  ).toLocaleDateString("fr-FR")}

                </td>

                <td className="p-4">

                  <div className="flex flex-wrap justify-end gap-2">

                    {article.published && article.slug && (

                      <Link
                        href={`/article/${article.slug}`}
                        target="_blank"
                        className="rounded-lg bg-slate-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
                      >
                        Voir
                      </Link>

                    )}

                    {article.published ? (

                      <button
                        type="button"
                        onClick={() =>
                          unpublishArticle(article.id)
                        }
                        disabled={
                          processingId === article.id ||
                          processingBulk
                        }
                        className="rounded-lg bg-orange-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {processingId === article.id
                          ? "..."
                          : "Dépublier"}
                      </button>

                    ) : (

                      <button
                        type="button"
                        onClick={() =>
                          publishArticle(article.id)
                        }
                        disabled={
                          processingId === article.id ||
                          processingBulk
                        }
                        className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {processingId === article.id
                          ? "..."
                          : "Publier"}
                      </button>

                    )}

                    <Link
                      href={`/admin/articles/${article.id}/edit`}
                      className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
                    >
                      Modifier
                    </Link>

                    <DeleteArticleButton
                      id={article.id}
                    />

                  </div>

                </td>

              </tr>

            ))}

            {articles.length === 0 && (

              <tr>

                <td
                  colSpan={7}
                  className="p-16 text-center text-gray-500"
                >

                  <div className="text-6xl">
                    📰
                  </div>

                  <h3 className="mt-6 text-2xl font-bold">
                    Aucun article
                  </h3>

                  <p className="mt-3">
                    Commencez par créer votre premier article.
                  </p>

                </td>

              </tr>

            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}
import Link from "next/link";
import { db } from "@/lib/db";
import DeleteArticleButton from "@/components/admin/DeleteArticleButton";

export const dynamic = "force-dynamic";

export default async function ArticlesPage() {
  const articles = await db.article.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <main className="mx-auto max-w-7xl p-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">
          Gestion des articles
        </h1>

        <Link
          href="/admin/articles/new"
          className="rounded-lg bg-blue-600 px-5 py-3 text-white hover:bg-blue-700 transition"
        >
          Nouvel article
        </Link>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4 text-left">Titre</th>
              <th className="p-4 text-left">Catégorie</th>
              <th className="p-4 text-left">Statut</th>
              <th className="p-4 text-left">Date</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {articles.length > 0 ? (
              articles.map((article) => (
                <tr
                  key={article.id}
                  className="border-t hover:bg-gray-50"
                >
                  <td className="p-4 font-medium">
                    {article.title}
                  </td>

                  <td className="p-4">
                    {article.category}
                  </td>

                  <td className="p-4">
                    {article.published ? (
                      <span className="rounded bg-green-100 px-3 py-1 text-sm font-medium text-green-700">
                        Publié
                      </span>
                    ) : (
                      <span className="rounded bg-yellow-100 px-3 py-1 text-sm font-medium text-yellow-700">
                        Brouillon
                      </span>
                    )}
                  </td>

                  <td className="p-4">
                    {new Date(article.createdAt).toLocaleDateString(
                      "fr-FR"
                    )}
                  </td>

                  <td className="p-4">
                    <div className="flex justify-end gap-4">
                      <Link
                        href={`/admin/articles/${article.id}/edit`}
                        className="text-blue-600 hover:underline"
                      >
                        Modifier
                      </Link>

                      <DeleteArticleButton
                        id={article.id}
                      />

                      {article.slug && (
                        <Link
                          href={`/article/${article.slug}`}
                          className="text-gray-600 hover:underline"
                          target="_blank"
                        >
                          Voir
                        </Link>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={5}
                  className="p-10 text-center text-gray-500"
                >
                  Aucun article disponible.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
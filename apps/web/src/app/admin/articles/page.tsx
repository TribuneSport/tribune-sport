import Link from "next/link";
import { db } from "@/lib/db";
import DeleteArticleButton from "@/components/DeleteArticleButton";

export const dynamic = "force-dynamic";

export default async function ArticlesPage() {
  const articles = await db.article.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  const total = articles.length;
  const published = articles.filter((a) => a.published).length;
  const drafts = total - published;
  const categories = new Set(articles.map((a) => a.category)).size;

  return (
    <main className="min-h-screen bg-slate-100">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-5xl font-black">
              Gestion des articles
            </h1>

            <p className="mt-3 text-lg text-gray-500">
              Administration des contenus de Tribune Sport
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/admin"
              className="rounded-xl bg-slate-700 px-6 py-3 font-bold text-white transition hover:bg-slate-800"
            >
              ← Dashboard
            </Link>

            <Link
              href="/admin/articles/new"
              className="rounded-xl bg-green-600 px-6 py-3 font-bold text-white transition hover:bg-green-700"
            >
              ➕ Nouvel article
            </Link>
          </div>
        </div>

        <div className="mb-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-3xl bg-white p-6 shadow">
            <p className="text-gray-500">Articles</p>

            <h2 className="mt-3 text-5xl font-black">
              {total}
            </h2>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow">
            <p className="text-gray-500">Publiés</p>

            <h2 className="mt-3 text-5xl font-black text-green-600">
              {published}
            </h2>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow">
            <p className="text-gray-500">Brouillons</p>

            <h2 className="mt-3 text-5xl font-black text-orange-600">
              {drafts}
            </h2>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow">
            <p className="text-gray-500">Catégories</p>

            <h2 className="mt-3 text-5xl font-black text-blue-700">
              {categories}
            </h2>
          </div>
        </div>

        <div className="overflow-hidden rounded-3xl bg-white shadow-xl">
          <div className="border-b p-6">
            <h2 className="text-3xl font-black">
              Liste des articles
            </h2>
          </div>

          <table className="w-full">
            <thead className="bg-slate-100">
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
                    className="border-t transition hover:bg-slate-50"
                  >
                    <td className="p-4 font-semibold">
                      {article.title}
                    </td>

                    <td className="p-4">
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium">
                        {article.category}
                      </span>
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

                    <td className="p-4">
                      {new Date(article.createdAt).toLocaleDateString("fr-FR")}
                    </td>

                    <td className="p-4">
                      <div className="flex justify-end gap-2">
                        {article.slug && (
                          <Link
                            href={`/article/${article.slug}`}
                            target="_blank"
                            className="rounded-lg bg-slate-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
                          >
                            Voir
                          </Link>
                        )}

                        <Link
                          href={`/admin/articles/${article.id}/edit`}
                          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
                        >
                          Modifier
                        </Link>

                        <DeleteArticleButton id={article.id} />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="p-16 text-center text-gray-500"
                  >
                    <div className="text-6xl">📰</div>

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
    </main>
  );
}
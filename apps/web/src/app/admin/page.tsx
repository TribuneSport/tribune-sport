import Link from "next/link";
import { prisma } from "@/lib/prisma";

import PublishButton from "@/components/PublishButton";
import EditArticleButton from "@/components/EditArticleButton";

export default async function AdminPage() {
  const articles = await prisma.article.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  const total = articles.length;
  const published = articles.filter((a) => a.published).length;
  const drafts = total - published;
  const categories = [...new Set(articles.map((a) => a.category))].length;

  return (
    <main className="min-h-screen bg-slate-100 p-10">

      <div className="mx-auto max-w-7xl">

        <div className="mb-10 flex items-center justify-between">

          <h1 className="text-5xl font-extrabold">
            Administration
          </h1>

          <div className="flex gap-3">

            <Link
              href="/admin/nouveau"
              className="rounded-xl bg-green-600 px-6 py-3 font-semibold text-white transition hover:bg-green-700"
            >
              ➕ Nouvel article
            </Link>

            <Link
              href="/"
              className="rounded-xl bg-red-700 px-6 py-3 font-semibold text-white transition hover:bg-red-800"
            >
              Retour au site
            </Link>

          </div>

        </div>

        <div className="mb-10 grid gap-6 md:grid-cols-4">

          <div className="rounded-2xl bg-white p-6 shadow">

            <h2 className="text-gray-500">
              Articles
            </h2>

            <p className="mt-2 text-4xl font-bold">
              {total}
            </p>

          </div>

          <div className="rounded-2xl bg-white p-6 shadow">

            <h2 className="text-gray-500">
              Publiés
            </h2>

            <p className="mt-2 text-4xl font-bold text-green-600">
              {published}
            </p>

          </div>

          <div className="rounded-2xl bg-white p-6 shadow">

            <h2 className="text-gray-500">
              Brouillons
            </h2>

            <p className="mt-2 text-4xl font-bold text-orange-600">
              {drafts}
            </p>

          </div>

          <div className="rounded-2xl bg-white p-6 shadow">

            <h2 className="text-gray-500">
              Catégories
            </h2>

            <p className="mt-2 text-4xl font-bold">
              {categories}
            </p>

          </div>

        </div>

        <div className="overflow-hidden rounded-2xl bg-white shadow">

          <table className="w-full">

            <thead className="bg-slate-100">

              <tr>

                <th className="p-4 text-left">
                  Titre
                </th>

                <th className="p-4 text-left">
                  Catégorie
                </th>

                <th className="p-4 text-left">
                  Statut
                </th>

                <th className="p-4 text-left">
                  Date
                </th>

                <th className="p-4 text-left">
                  Actions
                </th>

              </tr>

            </thead>

            <tbody>

              {articles.map((article) => (

                <tr
                  key={article.id}
                  className="border-t hover:bg-slate-50"
                >

                  <td className="p-4 font-semibold">
                    {article.title}
                  </td>

                  <td className="p-4">
                    {article.category}
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

                    <div className="flex flex-wrap gap-2">

                      <PublishButton
                        id={article.id}
                        published={article.published}
                      />

                      <EditArticleButton
                        slug={article.slug ?? ""}
                      />

                      <Link
                        href={`/article/${article.slug}`}
                        className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white transition hover:bg-blue-700"
                      >
                        Voir
                      </Link>

                    </div>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

    </main>
  );
}
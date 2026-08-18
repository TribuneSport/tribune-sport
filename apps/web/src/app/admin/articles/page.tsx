import Link from "next/link";
import { db } from "@/lib/db";
import ArticlesTable from "@/components/admin/ArticlesTable";

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
  const categories = new Set(
    articles.map((a) => a.category)
  ).size;

  return (
    <main className="min-h-screen bg-slate-100">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-5xl font-black">
              Gestion des articles
            </h1>

            <p className="mt-3 text-lg text-gray-500">
              Administration des contenus de Tribune Foot
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
            <p className="text-gray-500">
              Articles
            </p>

            <h2 className="mt-3 text-5xl font-black">
              {total}
            </h2>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow">
            <p className="text-gray-500">
              Publiés
            </p>

            <h2 className="mt-3 text-5xl font-black text-green-600">
              {published}
            </h2>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow">
            <p className="text-gray-500">
              Brouillons
            </p>

            <h2 className="mt-3 text-5xl font-black text-orange-600">
              {drafts}
            </h2>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow">
            <p className="text-gray-500">
              Catégories
            </p>

            <h2 className="mt-3 text-5xl font-black text-blue-700">
              {categories}
            </h2>
          </div>
        </div>

        <ArticlesTable
          articles={articles.map((article) => ({
            id: article.id,
            title: article.title,
            category: article.category,
            published: article.published,
            createdAt: article.createdAt,
            slug: article.slug,
          }))}
        />
      </div>
    </main>
  );
}
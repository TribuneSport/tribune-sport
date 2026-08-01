import Link from "next/link";
import { news } from "../../../data/news";

export default function AdminArticlesPage() {
  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-4xl font-bold">
          Gestion des articles
        </h1>

        <Link
          href="/admin/articles/nouveau"
          className="rounded-lg bg-red-700 px-5 py-3 text-white hover:bg-red-800"
        >
          + Nouvel article
        </Link>
      </div>

      <div className="overflow-hidden rounded-lg bg-white shadow">
        <table className="w-full">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-4 text-left">ID</th>
              <th className="p-4 text-left">Titre</th>
              <th className="p-4 text-left">Catégorie</th>
              <th className="p-4 text-left">Date</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {news.map((article) => (
              <tr
                key={article.id}
                className="border-t"
              >
                <td className="p-4">{article.id}</td>

                <td className="p-4">
                  {article.title}
                </td>

                <td className="p-4">
                  {article.category}
                </td>

                <td className="p-4">
                  {article.date}
                </td>

                <td className="space-x-2 p-4 text-center">
                  <button className="rounded bg-blue-600 px-3 py-1 text-white">
                    Modifier
                  </button>

                  <button className="rounded bg-red-600 px-3 py-1 text-white">
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
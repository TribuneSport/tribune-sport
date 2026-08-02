import { prisma } from "@/lib/prisma";
import AdminMenu from "@/components/admin/AdminMenu";
import ArticleActions from "@/components/admin/ArticleActions";

export default async function AdminPage() {

  const articles = await prisma.article.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return (

    <main className="mx-auto max-w-7xl p-10">

      <h1 className="mb-8 text-4xl font-bold">
        Administration Tribune Sport
      </h1>

      <AdminMenu />

      <table className="w-full border">

        <thead>

          <tr className="bg-gray-100">

            <th className="p-4 text-left">Titre</th>

            <th className="p-4 text-left">Club</th>

            <th className="p-4 text-left">Statut</th>

            <th className="p-4 text-left">Actions</th>

          </tr>

        </thead>

        <tbody>

          {articles.map((article) => (

            <tr
              key={article.id}
              className="border-t"
            >

              <td className="p-4">
                {article.title}
              </td>

              <td className="p-4">
                {article.category}
              </td>

              <td className="p-4">

                {article.published
                  ? "✅ Publié"
                  : "🟠 Brouillon"}

              </td>

              <td className="p-4">

                <ArticleActions
                  id={article.id}
                  published={article.published}
                />

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </main>

  );

}
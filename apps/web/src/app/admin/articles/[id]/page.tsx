import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditArticle({ params }: Props) {
  const { id } = await params;

  const article = await prisma.article.findUnique({
    where: {
      id: Number(id),
    },
  });

  if (!article) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-5xl p-10">

      <h1 className="mb-8 text-4xl font-bold">
        Modifier un article
      </h1>

      <form
        action={`/api/articles/update`}
        method="POST"
        className="space-y-6"
      >

        <input
          type="hidden"
          name="id"
          defaultValue={article.id}
        />

        <div>

          <label className="block mb-2 font-bold">
            Titre
          </label>

          <input
            name="title"
            defaultValue={article.title}
            className="w-full rounded border p-3"
          />

        </div>

        <div>

          <label className="block mb-2 font-bold">
            Résumé
          </label>

          <textarea
            name="summary"
            rows={5}
            defaultValue={article.summary}
            className="w-full rounded border p-3"
          />

        </div>

        <div>

          <label className="block mb-2 font-bold">
            Contenu
          </label>

          <textarea
            name="content"
            rows={18}
            defaultValue={article.content}
            className="w-full rounded border p-3"
          />

        </div>

        <button
          className="rounded bg-red-700 px-8 py-3 text-white"
        >
          Enregistrer
        </button>

      </form>

    </main>
  );
}
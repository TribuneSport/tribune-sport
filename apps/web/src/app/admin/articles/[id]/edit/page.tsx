import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import ArticleForm from "@/components/admin/ArticleForm";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditArticlePage({
  params,
}: Props) {
  const { id } = await params;

  const article = await db.article.findUnique({
    where: {
      id: Number(id),
    },
  });

  if (!article) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-5xl p-8">
      <h1 className="mb-8 text-3xl font-bold">
        Modifier l'article
      </h1>

      <ArticleForm article={article} />
    </main>
  );
}
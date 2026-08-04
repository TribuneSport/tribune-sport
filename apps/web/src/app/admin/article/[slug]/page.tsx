import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import EditArticleForm from "@/components/EditArticleForm";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function Page({
  params,
}: Props) {
  const { slug } = await params;

  const article = await prisma.article.findUnique({
    where: {
      slug,
    },
  });

  if (!article) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-slate-100 py-10">
      <div className="mx-auto max-w-5xl rounded-2xl bg-white p-10 shadow">

        <h1 className="mb-10 text-4xl font-extrabold">
          Modifier un article
        </h1>

        <EditArticleForm article={article} />

      </div>
    </main>
  );
}
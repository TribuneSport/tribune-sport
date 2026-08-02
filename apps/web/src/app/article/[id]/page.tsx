import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ArticlePage({ params }: Props) {

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

      <Link
        href="/"
        className="mb-8 inline-block rounded-lg bg-gray-200 px-4 py-2 hover:bg-gray-300"
      >
        ← Retour aux articles
      </Link>

      <span className="inline-block rounded-full bg-red-100 px-4 py-2 text-sm font-bold text-red-700">
        {article.category}
      </span>

      <h1 className="mt-6 text-5xl font-bold">
        {article.title}
      </h1>

      <p className="mt-6 text-xl text-gray-600">
        {article.summary}
      </p>

      <article className="prose mt-10 max-w-none whitespace-pre-wrap">
        {article.content}
      </article>

      <div className="mt-10 border-t pt-6">

        <strong>Source :</strong>

        <br />

        <a
          href={article.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline"
        >
          {article.sourceUrl}
        </a>

      </div>

    </main>

  );

}
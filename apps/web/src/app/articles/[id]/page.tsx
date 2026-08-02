import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

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

      <p className="text-red-700 font-bold">

        {article.category}

      </p>

      <h1 className="mt-4 text-5xl font-bold">

        {article.title}

      </h1>

      <p className="mt-6 text-gray-600">

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

          className="text-blue-600 underline"

        >

          {article.sourceUrl}

        </a>

      </div>

    </main>

  );

}
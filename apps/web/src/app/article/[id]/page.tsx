import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { news } from "@/data/news";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ArticlePage({ params }: Props) {
  const { id } = await params;

  const article = news.find((a) => a.id === Number(id));

  if (!article) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-5xl p-8">

      <Link
        href="/"
        className="mb-8 inline-block rounded-lg bg-gray-200 px-4 py-2 hover:bg-gray-300"
      >
        ← Retour aux articles
      </Link>

      <Image
        src={article.image}
        alt={article.title}
        width={1200}
        height={600}
        className="rounded-2xl w-full object-cover"
      />

      <span className="mt-6 inline-block rounded-full bg-red-100 px-4 py-2 text-sm font-bold text-red-700">
        {article.category}
      </span>

      <h1 className="mt-6 text-5xl font-bold">
        {article.title}
      </h1>

      <p className="mt-3 text-gray-500">
        {article.date}
      </p>

      <article className="prose mt-10 max-w-none text-lg leading-8">
        <p>{article.content}</p>
      </article>

    </main>
  );
}
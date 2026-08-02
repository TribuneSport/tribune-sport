import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function FeaturedArticle() {
  const article = await prisma.article.findFirst({
    where: {
      published: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  if (!article) {
    return (
      <section className="rounded-xl bg-white p-10 shadow">
        <h2 className="text-3xl font-bold">
          Tribune Sport
        </h2>

        <p className="mt-4 text-gray-600">
          Aucun article publié pour le moment.
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-xl bg-white p-10 shadow">

      <span className="rounded bg-red-700 px-3 py-1 text-sm font-bold text-white">
        À la une
      </span>

      <p className="mt-6 text-sm font-semibold uppercase tracking-wide text-red-700">
        {article.category}
      </p>

      <h2 className="mt-3 text-4xl font-bold leading-tight">
        {article.title}
      </h2>

      <p className="mt-6 text-lg leading-8 text-gray-600">
        {article.summary}
      </p>

      <Link
        href={`/article/${article.id}`}
        className="mt-8 inline-block rounded-lg bg-red-700 px-6 py-3 font-semibold text-white transition hover:bg-red-800"
      >
        Lire l'article
      </Link>

    </section>
  );
}
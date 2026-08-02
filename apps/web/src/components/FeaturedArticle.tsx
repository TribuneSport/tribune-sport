import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function FeaturedArticle() {

  const article = await prisma.article.findFirst({
    orderBy: {
      createdAt: "desc",
    },
  });

  if (!article) {
    return null;
  }

  return (
    <section className="mb-10 rounded-xl bg-white p-8 shadow">

      <span className="rounded bg-red-700 px-3 py-1 text-white">
        À la une
      </span>

      <h2 className="mt-4 text-4xl font-bold">
        {article.title}
      </h2>

      <p className="mt-4 text-gray-600">
        {article.summary}
      </p>

      <Link
        href={`/article/${article.id}`}
        className="mt-6 inline-block rounded-lg bg-red-700 px-6 py-3 text-white"
      >
        Lire l'article
      </Link>

    </section>
  );
}
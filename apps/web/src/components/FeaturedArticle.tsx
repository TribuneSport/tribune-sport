import Image from "next/image";
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
      <section className="mb-12 rounded-3xl bg-white p-10 shadow-lg">
        <span className="rounded-full bg-red-100 px-4 py-2 text-sm font-bold text-red-700">
          📰 À la une
        </span>

        <h2 className="mt-6 text-4xl font-bold">
          Tribune Sport est prêt !
        </h2>

        <p className="mt-4 text-lg text-gray-600">
          Aucun article publié pour le moment.
        </p>
      </section>
    );
  }

  return (
    <section className="my-12 overflow-hidden rounded-3xl bg-white shadow-xl">
      <div className="grid lg:grid-cols-2">
        <div className="relative h-72 lg:h-full">
          <Image
            src={article.image || "/placeholder.jpg"}
            alt={article.title}
            fill
            className="object-cover"
            priority
          />
        </div>

        <div className="flex flex-col justify-center p-10">
          <span className="mb-4 inline-block w-fit rounded-full bg-red-100 px-4 py-2 text-sm font-bold text-red-700">
            🔥 À LA UNE
          </span>

          <span className="text-sm font-bold uppercase tracking-wider text-gray-500">
            {article.category}
          </span>

          <h2 className="mt-4 text-4xl font-extrabold leading-tight">
            {article.title}
          </h2>

          <p className="mt-6 text-lg leading-8 text-gray-600">
            {article.summary}
          </p>

          <div className="mt-8 flex items-center gap-4">
            <Link
              href={`/article/${article.id}`}
              className="rounded-xl bg-red-700 px-8 py-4 font-bold text-white transition hover:bg-red-800"
            >
              Lire l'article →
            </Link>

            <span className="text-sm text-gray-500">
              Publié récemment
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
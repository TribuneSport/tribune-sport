import Image from "next/image";
import Link from "next/link";
import { db } from "@/lib/db";

export default async function FeaturedArticle() {
  const article = await db.article.findFirst({
    where: {
      published: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  if (!article) {
    return (
      <section className="rounded-3xl border bg-white p-12 shadow-sm">

        <span className="inline-flex rounded-full bg-red-100 px-4 py-2 text-sm font-bold text-red-700">
          À LA UNE
        </span>

        <h2 className="mt-6 text-4xl font-black">
          Tribune Sport est prêt
        </h2>

        <p className="mt-4 text-lg text-gray-600">
          Les premiers articles seront publiés automatiquement dès
          l'import des flux RSS.
        </p>

      </section>
    );
  }

  return (
    <section className="overflow-hidden rounded-3xl border bg-white shadow-lg">

      <div className="grid lg:grid-cols-2">

        <div className="relative min-h-[420px]">

          <Image
            src={article.image || "/football.jpg"}
            alt={article.title}
            fill
            priority
            className="object-cover"
          />

        </div>

        <div className="flex flex-col justify-center p-10">

          <span className="inline-flex w-fit rounded-full bg-red-100 px-4 py-2 text-sm font-bold text-red-700">
            🔥 À LA UNE
          </span>

          <p className="mt-6 text-sm font-bold uppercase tracking-widest text-gray-500">
            {article.category}
          </p>

          <h2 className="mt-4 text-4xl font-black leading-tight">
            {article.title}
          </h2>

          <p className="mt-6 text-lg leading-8 text-gray-600">
            {article.summary}
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-5">

            <Link
              href={`/article/${article.slug}`}
              className="rounded-xl bg-red-700 px-8 py-4 font-bold text-white transition hover:bg-red-800"
            >
              Lire l'article →
            </Link>

            <span className="text-sm text-gray-500">
              Dernière mise à jour
            </span>

          </div>

        </div>

      </div>

    </section>
  );
}
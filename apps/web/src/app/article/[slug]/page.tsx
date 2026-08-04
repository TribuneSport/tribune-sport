import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;

  const article = await prisma.article.findUnique({
    where: {
      slug,
    },
  });

  if (!article) {
    notFound();
  }

  const related = await prisma.article.findMany({
    where: {
      published: true,
      category: article.category,
      id: {
        not: article.id,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 3,
  });

  return (
    <main className="min-h-screen bg-slate-100">

      <div className="mx-auto max-w-6xl py-10">

        <Link
          href="/"
          className="mb-8 inline-flex items-center rounded-xl bg-white px-5 py-3 shadow hover:bg-gray-100"
        >
          ← Retour
        </Link>

        <article className="overflow-hidden rounded-3xl bg-white shadow-xl">

          <div className="relative h-[500px]">

            <Image
              src={article.image || "/placeholder.jpg"}
              alt={article.title}
              fill
              priority
              className="object-cover"
            />

          </div>

          <div className="p-12">

            <span className="rounded-full bg-red-100 px-4 py-2 font-bold text-red-700">
              {article.category}
            </span>

            <h1 className="mt-6 text-5xl font-extrabold leading-tight">
              {article.title}
            </h1>

            <div className="mt-5 flex gap-6 text-gray-500">

              <span>
                📅{" "}
                {new Date(article.createdAt).toLocaleDateString("fr-FR")}
              </span>

              <span>⏱ Lecture 3 min</span>

            </div>

            <p className="mt-8 text-xl leading-9 text-gray-700">
              {article.summary}
            </p>

            <div className="prose prose-lg mt-12 max-w-none whitespace-pre-wrap">
              {article.content}
            </div>

            <div className="mt-12 border-t pt-8">

              <h3 className="font-bold">
                Source
              </h3>

              <a
                href={article.sourceUrl}
                target="_blank"
                className="text-blue-600 underline"
              >
                {article.sourceUrl}
              </a>

            </div>

          </div>

        </article>

        {related.length > 0 && (

          <section className="mt-16">

            <h2 className="mb-8 text-3xl font-bold">
              Articles similaires
            </h2>

            <div className="grid gap-8 md:grid-cols-3">

              {related.map((item) => (

                <Link
                  key={item.id}
                  href={`/article/${item.slug}`}
                  className="overflow-hidden rounded-2xl bg-white shadow hover:shadow-xl transition"
                >

                  <Image
                    src={item.image || "/placeholder.jpg"}
                    alt={item.title}
                    width={600}
                    height={400}
                    className="h-52 w-full object-cover"
                  />

                  <div className="p-5">

                    <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-700">
                      {item.category}
                    </span>

                    <h3 className="mt-3 text-xl font-bold">
                      {item.title}
                    </h3>

                  </div>

                </Link>

              ))}

            </div>

          </section>

        )}

      </div>

    </main>
  );
}
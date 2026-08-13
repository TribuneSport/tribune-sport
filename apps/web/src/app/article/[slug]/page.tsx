import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { db } from "@/lib/db";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { slug } = await params;

  const article = await db.article.findUnique({
    where: {
      slug,
    },
  });

  if (!article) {
    return {
      title: "Article introuvable | Tribune Sport",
    };
  }

  const title = `${article.title} | Tribune Sport`;

  const description =
    article.summary ||
    "Toute l'actualité du football sur Tribune Sport.";

  const image = article.image || "/football.jpg";

  return {
    title,
    description,

    alternates: {
      canonical: `/article/${article.slug}`,
    },

    openGraph: {
      title,
      description,
      type: "article",
      url: `https://tribunesport.fr/article/${article.slug}`,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;

  const article = await db.article.findUnique({
    where: {
      slug,
    },
  });

  if (!article) {
    notFound();
  }

  const related = await db.article.findMany({
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

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    description: article.summary,
    image: article.image,
    datePublished: article.createdAt,
    dateModified: article.updatedAt,
    author: {
      "@type": "Organization",
      name: "Tribune Sport",
    },
    publisher: {
      "@type": "Organization",
      name: "Tribune Sport",
    },
  };

  return (
        <main className="bg-gray-100">

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd),
        }}
      />

      <div className="mx-auto max-w-7xl px-4 py-8">

        <Link
          href="/"
          className="inline-flex items-center rounded-xl border bg-white px-5 py-3 font-semibold shadow-sm transition hover:bg-gray-50"
        >
          ← Retour aux actualités
        </Link>

        <article className="mt-8 overflow-hidden rounded-3xl bg-white shadow-lg">

          <div className="relative h-[320px] md:h-[500px]">

            <Image
              src={article.image || "/football.jpg"}
              alt={article.title}
              fill
              priority
              className="object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

            <div className="absolute bottom-0 left-0 w-full p-8 text-white">

              <span className="inline-flex rounded-full bg-red-600 px-4 py-2 text-sm font-bold">
                {article.category}
              </span>

              <h1 className="mt-5 max-w-5xl text-4xl font-black leading-tight md:text-6xl">
                {article.title}
              </h1>

              <div className="mt-6 flex flex-wrap gap-6 text-sm text-gray-200">

                <span>
                  📅{" "}
                  {new Date(article.createdAt).toLocaleDateString("fr-FR")}
                </span>

                <span>⏱ Lecture 3 min</span>

              </div>

            </div>

          </div>

          <div className="mx-auto max-w-4xl p-8 md:p-12">

            <p className="border-l-4 border-red-600 pl-6 text-2xl leading-10 text-gray-700">
              {article.summary}
            </p>

            <div className="prose prose-lg mt-12 max-w-none whitespace-pre-wrap">
              {article.content}
            </div>

            {article.sourceUrl && (
              <div className="mt-12 rounded-2xl bg-gray-50 p-6">

                <p className="mb-2 font-bold">
                  Source
                </p>

                <a
                  href={article.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="break-all text-blue-700 hover:underline"
                >
                  {article.sourceUrl}
                </a>

              </div>
            )}

          </div>

        </article>

        {related.length > 0 && (

          <section className="mt-16">

            <h2 className="mb-8 text-3xl font-black">
              À lire également
            </h2>

            <div className="grid gap-8 md:grid-cols-3">

              {related.map((item) => (

                <Link
                  key={item.id}
                  href={`/article/${item.slug}`}
                  className="overflow-hidden rounded-3xl border bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                >

                  <Image
                    src={item.image || "/football.jpg"}
                    alt={item.title}
                    width={700}
                    height={450}
                    className="h-56 w-full object-cover"
                  />

                  <div className="p-6">

                    <span className="inline-flex rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-700">
                      {item.category}
                    </span>

                    <h3 className="mt-4 text-xl font-black leading-7">
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
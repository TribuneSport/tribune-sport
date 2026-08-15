import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { db } from "@/lib/db";

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

async function getArticle(slug: string) {
  return db.article.findFirst({
    where: {
      slug,
      published: true,
    },
    include: {
      club: true,
      player: true,
      competition: true,
    },
  });
}

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { slug } = await params;

  const article = await getArticle(slug);

  if (!article) {
    return {
      title: "Article introuvable | Tribune Sport",
      description: "Cet article n'existe pas ou n'est plus disponible.",
    };
  }

  return {
    title:
      article.seoTitle ||
      `${article.title} | Tribune Sport`,
    description:
      article.seoDescription ||
      article.summary,
    openGraph: {
      title:
        article.seoTitle ||
        article.title,
      description:
        article.seoDescription ||
        article.summary,
      type: "article",
      images: article.image
        ? [
            {
              url: article.image,
            },
          ]
        : undefined,
    },
  };
}

export default async function ArticlePage({
  params,
}: Props) {
  const { slug } = await params;

  const article = await getArticle(slug);

  if (!article) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <article className="mx-auto max-w-5xl px-6 py-12">

        {/* Catégorie */}
        <div className="mb-4">
          <span className="inline-block rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-700">
            {article.category}
          </span>
        </div>

        {/* Titre */}
        <h1 className="text-4xl font-extrabold leading-tight text-gray-900 md:text-5xl">
          {article.title}
        </h1>

        {/* Date */}
        <div className="mt-4 text-sm text-gray-500">
          Publié le{" "}
          {new Intl.DateTimeFormat("fr-FR", {
            day: "2-digit",
            month: "long",
            year: "numeric",
          }).format(article.createdAt)}
        </div>

        {/* Image */}
        {article.image && (
          <div className="mt-8 overflow-hidden rounded-2xl bg-gray-200">
            <img
              src={article.image}
              alt={article.title}
              className="h-auto max-h-[600px] w-full object-cover"
            />
          </div>
        )}

        {/* Résumé */}
        {article.summary && (
          <div className="mt-8 rounded-2xl border-l-4 border-green-600 bg-white p-6 shadow-sm">
            <p className="text-xl font-medium leading-relaxed text-gray-700">
              {article.summary}
            </p>
          </div>
        )}

        {/* Contenu */}
        <div
          className="
            article-content
            mt-10
            rounded-2xl
            bg-white
            p-6
            shadow-sm
            md:p-10
          "
          dangerouslySetInnerHTML={{
            __html: article.content,
          }}
        />

        {/* Source */}
        {article.sourceUrl && (
          <div className="mt-8 border-t pt-6">
            <p className="text-sm text-gray-500">
              Source :
            </p>

            <a
              href={article.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 inline-block break-all text-sm text-blue-600 hover:underline"
            >
              {article.sourceUrl}
            </a>
          </div>
        )}

      </article>
    </main>
  );
}
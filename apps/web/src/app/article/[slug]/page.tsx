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

/*
 * Supprime le résumé lorsqu'il est déjà présent
 * au début du contenu de l'article.
 *
 * Le résumé reste affiché dans son encadré dédié.
 */
function removeDuplicateSummary(
  content: string,
  summary: string
): string {
  if (!content?.trim() || !summary?.trim()) {
    return content;
  }

  const cleanContent = content.trim();
  const cleanSummary = summary.trim();

  /*
   * Comparaison simple après suppression des balises HTML
   * et normalisation des espaces.
   */
  const normalize = (value: string) =>
    value
      .replace(/<[^>]*>/g, " ")
      .replace(/&nbsp;/gi, " ")
      .replace(/\s+/g, " ")
      .trim()
      .toLowerCase();

  const normalizedContent =
    normalize(cleanContent);

  const normalizedSummary =
    normalize(cleanSummary);

  /*
   * Le contenu commence directement par le résumé.
   */
  if (
    normalizedContent.startsWith(
      normalizedSummary
    )
  ) {
    /*
     * On retire le résumé du début du HTML.
     *
     * Plusieurs formes sont prises en compte :
     * - texte simple
     * - <p>résumé</p>
     * - <p>résumé</p><p>suite...</p>
     */
    const escapedSummary =
      cleanSummary.replace(
        /[.*+?^${}()|[\]\\]/g,
        "\\$&"
      );

    const patterns = [
      new RegExp(
        `^\\s*<p[^>]*>\\s*${escapedSummary}\\s*</p>\\s*`,
        "i"
      ),

      new RegExp(
        `^\\s*${escapedSummary}\\s*`,
        "i"
      ),
    ];

    for (const pattern of patterns) {
      const result =
        cleanContent.replace(
          pattern,
          ""
        );

      if (result !== cleanContent) {
        return result.trim();
      }
    }

    /*
     * Si le résumé est légèrement différent
     * à cause du HTML, on retire le premier paragraphe.
     */
    const firstParagraphMatch =
      cleanContent.match(
        /^\s*<p[^>]*>([\s\S]*?)<\/p>/i
      );

    if (firstParagraphMatch) {
      const firstParagraphText =
        normalize(
          firstParagraphMatch[1]
        );

      if (
        firstParagraphText ===
        normalizedSummary
      ) {
        return cleanContent
          .replace(
            firstParagraphMatch[0],
            ""
          )
          .trim();
      }
    }
  }

  return content;
}

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { slug } = await params;

  const article = await getArticle(slug);

  if (!article) {
    return {
      title:
        "Article introuvable | Tribune Foot",

      description:
        "Cet article n'existe pas ou n'est plus disponible.",
    };
  }

  const articleTitle =
    article.seoTitle ||
    article.title;

  const articleDescription =
    article.seoDescription ||
    article.summary ||
    `Retrouvez toute l'actualité football sur Tribune Foot : ${article.title}`;

  const canonicalUrl =
    `${siteUrl}/article/${article.slug}`;

  const publicationDate =
    article.pubDate ||
    article.createdAt;

  return {
    title: articleTitle,

    description:
      articleDescription,

    alternates: {
      canonical: canonicalUrl,
    },

    robots: {
      index: true,
      follow: true,

      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },

    openGraph: {
      type: "article",

      url: canonicalUrl,

      siteName: "Tribune Foot",

      locale: "fr_FR",

      title: articleTitle,

      description:
        articleDescription,

      publishedTime:
        publicationDate.toISOString(),

      modifiedTime:
        article.updatedAt.toISOString(),

      authors: [
        "Tribune Foot",
      ],

      section:
        article.category,

      images: article.image
        ? [
            {
              url: article.image,
              alt: article.title,
            },
          ]
        : undefined,
    },

    twitter: {
      card: "summary_large_image",

      title: articleTitle,

      description:
        articleDescription,

      images: article.image
        ? [article.image]
        : undefined,
    },
  };
}

const siteUrl =
  "https://www.tribunesport.fr";

export default async function ArticlePage({
  params,
}: Props) {
  const { slug } = await params;

  const article = await getArticle(slug);

  if (!article) {
    notFound();
  }

  const articleContent =
    removeDuplicateSummary(
      article.content,
      article.summary
    );

  /*
   * Date réellement fournie par le flux RSS.
   *
   * Si aucune date RSS n'existe,
   * on utilise createdAt comme secours.
   */
  const publicationDate =
    article.pubDate ||
    article.createdAt;

  const articleUrl =
    `${siteUrl}/article/${article.slug}`;

  /*
   * ------------------------------------------------------------
   * DONNÉES STRUCTURÉES NEWSARTICLE
   * ------------------------------------------------------------
   */

  const newsArticleStructuredData = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",

    headline: article.title,

    description:
      article.seoDescription ||
      article.summary ||
      "",

    url: articleUrl,

    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": articleUrl,
    },

    datePublished:
      publicationDate.toISOString(),

    dateModified:
      article.updatedAt.toISOString(),

    articleSection:
      article.category,

    inLanguage: "fr-FR",

    author: {
      "@type": "Organization",
      name: "Tribune Foot",
      url: siteUrl,
    },

    publisher: {
      "@type": "Organization",
      name: "Tribune Foot",
      url: siteUrl,

      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/football.jpg`,
      },
    },

    image: article.image
      ? [
          article.image,
        ]
      : [
          `${siteUrl}/football.jpg`,
        ],

    isAccessibleForFree: true,
  };

  return (
    <main className="min-h-screen bg-gray-50">

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            newsArticleStructuredData
          ),
        }}
      />

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
          {new Intl.DateTimeFormat(
            "fr-FR",
            {
              day: "2-digit",
              month: "long",
              year: "numeric",
            }
          ).format(publicationDate)}
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
            __html: articleContent,
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
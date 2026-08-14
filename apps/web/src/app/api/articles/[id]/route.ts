import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

interface Context {
  params: Promise<{
    id: string;
  }>;
}

/**
 * GET /api/articles/:id
 */
export async function GET(
  _request: NextRequest,
  { params }: Context
) {
  try {
    const { id } = await params;

    const articleId = Number(id);

    if (!Number.isInteger(articleId)) {
      return NextResponse.json(
        {
          error: "ID article invalide.",
        },
        {
          status: 400,
        }
      );
    }

    const article = await db.article.findUnique({
      where: {
        id: articleId,
      },
    });

    if (!article) {
      return NextResponse.json(
        {
          error: "Article introuvable.",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json(article);
  } catch (error) {
    console.error(
      "GET /api/articles/[id] :",
      error
    );

    return NextResponse.json(
      {
        error: "Erreur lors de la récupération de l'article.",
      },
      {
        status: 500,
      }
    );
  }
}

/**
 * PUT /api/articles/:id
 */
export async function PUT(
  request: NextRequest,
  { params }: Context
) {
  try {
    const { id } = await params;

    const articleId = Number(id);

    if (!Number.isInteger(articleId)) {
      return NextResponse.json(
        {
          error: "ID article invalide.",
        },
        {
          status: 400,
        }
      );
    }

    const body = await request.json();

    const existingArticle =
      await db.article.findUnique({
        where: {
          id: articleId,
        },
      });

    if (!existingArticle) {
      return NextResponse.json(
        {
          error: "Article introuvable.",
        },
        {
          status: 404,
        }
      );
    }

    const title = String(
      body.title ?? ""
    ).trim();

    const summary = String(
      body.summary ?? ""
    ).trim();

    const content = String(
      body.content ?? ""
    ).trim();

    const category = String(
      body.category ?? ""
    ).trim();

    const image = String(
      body.image ?? ""
    ).trim();

    const sourceUrl = String(
      body.sourceUrl ?? ""
    ).trim();

    const seoTitle =
      body.seoTitle
        ? String(body.seoTitle).trim()
        : null;

    const seoDescription =
      body.seoDescription
        ? String(body.seoDescription).trim()
        : null;

    const slug =
      body.slug
        ? String(body.slug).trim()
        : null;

    const published =
      Boolean(body.published);

    if (!title) {
      return NextResponse.json(
        {
          error: "Le titre est obligatoire.",
        },
        {
          status: 400,
        }
      );
    }

    if (!summary) {
      return NextResponse.json(
        {
          error: "Le résumé est obligatoire.",
        },
        {
          status: 400,
        }
      );
    }

    if (!content) {
      return NextResponse.json(
        {
          error: "Le contenu est obligatoire.",
        },
        {
          status: 400,
        }
      );
    }

    if (!category) {
      return NextResponse.json(
        {
          error: "La catégorie est obligatoire.",
        },
        {
          status: 400,
        }
      );
    }

    /*
     * sourceUrl est unique dans Prisma.
     * On évite donc de modifier inutilement sa valeur.
     */
    if (
      sourceUrl &&
      sourceUrl !== existingArticle.sourceUrl
    ) {
      const sourceExists =
        await db.article.findUnique({
          where: {
            sourceUrl,
          },
        });

      if (
        sourceExists &&
        sourceExists.id !== articleId
      ) {
        return NextResponse.json(
          {
            error:
              "Cette URL source est déjà utilisée par un autre article.",
          },
          {
            status: 409,
          }
        );
      }
    }

    /*
     * Le slug est également unique.
     */
    if (
      slug &&
      slug !== existingArticle.slug
    ) {
      const slugExists =
        await db.article.findUnique({
          where: {
            slug,
          },
        });

      if (
        slugExists &&
        slugExists.id !== articleId
      ) {
        return NextResponse.json(
          {
            error:
              "Ce slug est déjà utilisé par un autre article.",
          },
          {
            status: 409,
          }
        );
      }
    }

    const article =
      await db.article.update({
        where: {
          id: articleId,
        },

        data: {
          title,
          summary,
          content,

          category,
          image,
          sourceUrl,

          seoTitle,
          seoDescription,
          slug,

          published,
        },
      });

    return NextResponse.json({
      success: true,
      article,
    });
  } catch (error) {
    console.error(
      "PUT /api/articles/[id] :",
      error
    );

    return NextResponse.json(
      {
        error:
          "Erreur lors de la modification de l'article.",
      },
      {
        status: 500,
      }
    );
  }
}

/**
 * DELETE /api/articles/:id
 */
export async function DELETE(
  _request: NextRequest,
  { params }: Context
) {
  try {
    const { id } = await params;

    const articleId = Number(id);

    if (!Number.isInteger(articleId)) {
      return NextResponse.json(
        {
          error: "ID article invalide.",
        },
        {
          status: 400,
        }
      );
    }

    const existingArticle =
      await db.article.findUnique({
        where: {
          id: articleId,
        },
      });

    if (!existingArticle) {
      return NextResponse.json(
        {
          error: "Article introuvable.",
        },
        {
          status: 404,
        }
      );
    }

    await db.article.delete({
      where: {
        id: articleId,
      },
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(
      "DELETE /api/articles/[id] :",
      error
    );

    return NextResponse.json(
      {
        error:
          "Erreur lors de la suppression de l'article.",
      },
      {
        status: 500,
      }
    );
  }
}
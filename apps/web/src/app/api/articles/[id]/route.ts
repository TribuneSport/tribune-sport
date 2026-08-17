import { NextResponse } from "next/server";
import { db } from "@/lib/db";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export async function PUT(
  request: Request,
  { params }: Props
) {
  try {
    const { id } = await params;
    const articleId = Number(id);

    if (!Number.isInteger(articleId)) {
      return NextResponse.json(
        { error: "Identifiant d'article invalide." },
        { status: 400 }
      );
    }

    const body = await request.json();

    const article = await db.article.update({
      where: {
        id: articleId,
      },
      data: {
        title: body.title,
        summary: body.summary ?? "",
        content: body.content ?? "",
        category: body.category ?? "",
        image: body.image ?? "",
        sourceUrl: body.sourceUrl,
        seoTitle: body.seoTitle || null,
        seoDescription: body.seoDescription || null,
        slug: body.slug || null,
        published: Boolean(body.published),
      },
    });

    return NextResponse.json(article);
  } catch (error) {
    console.error("PUT /api/articles/[id] error:", error);

    return NextResponse.json(
      {
        error: "Impossible de modifier l'article.",
      },
      {
        status: 500,
      }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: Props
) {
  try {
    const { id } = await params;
    const articleId = Number(id);

    if (!Number.isInteger(articleId)) {
      return NextResponse.json(
        { error: "Identifiant d'article invalide." },
        { status: 400 }
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
    console.error("DELETE /api/articles/[id] error:", error);

    return NextResponse.json(
      {
        error: "Impossible de supprimer l'article.",
      },
      {
        status: 500,
      }
    );
  }
}
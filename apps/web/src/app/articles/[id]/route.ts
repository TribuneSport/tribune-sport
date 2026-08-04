import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { slugify } from "@/lib/slug";

interface Params {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(
  request: NextRequest,
  { params }: Params
) {
  const { id } = await params;

  const article = await db.article.findUnique({
    where: {
      id: Number(id),
    },
  });

  if (!article) {
    return NextResponse.json(
      {
        error: "Article introuvable",
      },
      {
        status: 404,
      }
    );
  }

  return NextResponse.json(article);
}

export async function PUT(
  request: NextRequest,
  { params }: Params
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const article = await db.article.update({
      where: {
        id: Number(id),
      },
      data: {
        title: body.title,
        summary: body.summary,
        content: body.content,
        category: body.category,
        image: body.image,
        sourceUrl: body.sourceUrl,
        seoTitle: body.seoTitle,
        seoDescription: body.seoDescription,
        slug: body.slug || slugify(body.title),
        published: body.published,
      },
    });

    return NextResponse.json(article);
  } catch {
    return NextResponse.json(
      {
        error: "Erreur lors de la mise à jour",
      },
      {
        status: 500,
      }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: Params
) {
  try {
    const { id } = await params;

    await db.article.delete({
      where: {
        id: Number(id),
      },
    });

    return NextResponse.json({
      success: true,
    });
  } catch {
    return NextResponse.json(
      {
        error: "Erreur lors de la suppression",
      },
      {
        status: 500,
      }
    );
  }
}
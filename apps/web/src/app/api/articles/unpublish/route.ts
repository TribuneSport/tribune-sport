import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const id = Number(body.id);

    if (!Number.isInteger(id)) {
      return NextResponse.json(
        {
          success: false,
          error: "ID article invalide.",
        },
        {
          status: 400,
        }
      );
    }

    const article = await db.article.findUnique({
      where: {
        id,
      },
    });

    if (!article) {
      return NextResponse.json(
        {
          success: false,
          error: "Article introuvable.",
        },
        {
          status: 404,
        }
      );
    }

    const updatedArticle = await db.article.update({
      where: {
        id,
      },
      data: {
        published: false,
      },
    });

    return NextResponse.json({
      success: true,
      article: updatedArticle,
    });
  } catch (error) {
    console.error(
      "POST /api/articles/unpublish :",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error: "Erreur lors de la dépublication de l'article.",
      },
      {
        status: 500,
      }
    );
  }
}
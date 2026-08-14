import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(
  request: NextRequest
) {
  try {
    const body = await request.json();

    const id = Number(body.id);

    if (!Number.isInteger(id)) {
      return NextResponse.json(
        {
          error: "ID article invalide.",
        },
        {
          status: 400,
        }
      );
    }

    const article =
      await db.article.findUnique({
        where: {
          id,
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

    const updatedArticle =
      await db.article.update({
        where: {
          id,
        },

        data: {
          published: true,
        },
      });

    return NextResponse.json({
      success: true,
      article: updatedArticle,
    });
  } catch (error) {
    console.error(
      "POST /api/articles/publish :",
      error
    );

    return NextResponse.json(
      {
        error:
          "Erreur lors de la publication de l'article.",
      },
      {
        status: 500,
      }
    );
  }
}
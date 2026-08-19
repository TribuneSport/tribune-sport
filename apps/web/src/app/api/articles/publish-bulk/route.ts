import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const ids = Array.isArray(body.ids)
      ? body.ids
          .map(Number)
          .filter((id: number) => Number.isInteger(id))
      : [];

    if (ids.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Aucun article sélectionné.",
        },
        {
          status: 400,
        }
      );
    }

    const result = await db.article.updateMany({
      where: {
        id: {
          in: ids,
        },
        published: false,
      },
      data: {
        published: true,
      },
    });

    return NextResponse.json({
      success: true,
      count: result.count,
    });
  } catch (error) {
    console.error(
      "POST /api/articles/publish-bulk :",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error: "Erreur lors de la publication des articles.",
      },
      {
        status: 500,
      }
    );
  }
}
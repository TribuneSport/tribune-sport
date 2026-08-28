import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const ids = Array.isArray(body.ids)
      ? body.ids
          .map((id: unknown) => Number(id))
          .filter((id: number) => Number.isInteger(id))
      : [];

    if (ids.length === 0) {
      return NextResponse.json(
        {
          error: "Aucun article sélectionné.",
        },
        {
          status: 400,
        }
      );
    }

    const result = await db.article.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    });

    return NextResponse.json({
      success: true,
      count: result.count,
    });
  } catch (error) {
    console.error(
      "POST /api/articles/delete-bulk error:",
      error
    );

    return NextResponse.json(
      {
        error: "Impossible de supprimer les articles sélectionnés.",
      },
      {
        status: 500,
      }
    );
  }
}
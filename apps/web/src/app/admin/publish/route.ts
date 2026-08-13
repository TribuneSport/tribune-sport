import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { id } = await req.json();

    const article = await db.article.findUnique({
      where: {
        id,
      },
    });

    if (!article) {
      return NextResponse.json(
        {
          success: false,
          error: "Article introuvable",
        },
        {
          status: 404,
        }
      );
    }

    await db.article.update({
      where: {
        id,
      },
      data: {
        published: !article.published,
      },
    });

    return NextResponse.json({
      success: true,
    });
  } catch (e) {
    console.error(e);

    return NextResponse.json(
      {
        success: false,
      },
      {
        status: 500,
      }
    );
  }
}
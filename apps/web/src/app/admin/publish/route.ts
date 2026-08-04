import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { id } = await req.json();

    const article = await prisma.article.findUnique({
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

    await prisma.article.update({
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
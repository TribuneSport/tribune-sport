import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const article = await prisma.article.create({
      data: {
        title: body.title,
        summary: body.summary,
        content: body.content,
        category: body.category,
        image: body.image,
      },
    });

    return NextResponse.json(article, { status: 201 });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Erreur lors de la création de l'article" },
      { status: 500 }
    );
  }
}
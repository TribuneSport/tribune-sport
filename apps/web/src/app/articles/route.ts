import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { slugify } from "@/lib/slug";

export async function GET() {
  const articles = await db.article.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return NextResponse.json(articles);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const article = await db.article.create({
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
        published: body.published ?? false,
      },
    });

    return NextResponse.json(article, {
      status: 201,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Impossible de créer l'article.",
      },
      {
        status: 500,
      }
    );
  }
}
import { NextResponse } from "next/server";
import { ArticleService } from "@/services/article.service";

export async function GET() {
  try {
    const service = new ArticleService();

    const articles = await service.getLatestArticles();

    return NextResponse.json(articles);
  } catch (error) {
    console.error("GET /api/articles error:", error);

    return NextResponse.json(
      {
        error: "Impossible de récupérer les articles.",
      },
      {
        status: 500,
      }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const service = new ArticleService();

    const article = await service.createArticle({
      title: body.title,
      summary: body.summary ?? "",
      content: body.content ?? "",
      category: body.category ?? "",
      image: body.image ?? "",
      sourceUrl: body.sourceUrl,
      seoTitle: body.seoTitle ?? null,
      seoDescription: body.seoDescription ?? null,
      slug: body.slug ?? null,
      published: body.published ?? false,
    });

    return NextResponse.json(article, {
      status: 201,
    });
  } catch (error) {
    console.error("POST /api/articles error:", error);

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
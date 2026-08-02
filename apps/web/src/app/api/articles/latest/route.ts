import { NextResponse } from "next/server";
import { ArticleService } from "@/services/article.service";

export async function GET() {

  const service = new ArticleService();

  const articles = await service.getPublishedArticles();

  return NextResponse.json(articles);

}
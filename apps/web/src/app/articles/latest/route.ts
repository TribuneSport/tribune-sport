import { NextResponse } from "next/server";
import { ArticleService } from "@/services/article.service";

export async function GET() {
  const service = new ArticleService();

  const articles = await service.getLatestArticles(20);

  return NextResponse.json(articles);
}
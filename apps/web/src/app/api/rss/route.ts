import { NextResponse } from "next/server";
import { RSSService } from "@/services/rss.service";

export async function GET() {
  const rss = new RSSService();

  const articles = await rss.getSources();

  return NextResponse.json(articles);
}
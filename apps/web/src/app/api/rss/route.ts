import { NextResponse } from "next/server";
import { RSSService } from "@/services/rss.service";

export async function GET() {
  try {
    const service = new RSSService();

    const articles = await service.getSources();

    return new NextResponse(JSON.stringify(articles), {
      status: 200,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Erreur API RSS :", error);

    return new NextResponse(
      JSON.stringify({
        error: "Impossible de récupérer les flux RSS",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
      },
    );
  }
}
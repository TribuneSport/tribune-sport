import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    await db.article.update({
      where: {
        id: body.id,
      },
      data: {
        title: body.title,
        summary: body.summary,
        content: body.content,
        category: body.category,
        image: body.image,
        seoTitle: body.seoTitle,
        seoDescription: body.seoDescription,
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
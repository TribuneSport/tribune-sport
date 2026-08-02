import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const body = await request.json();

  await prisma.article.update({
    where: {
      id: Number(id),
    },
    data: {
      title: body.title,
      summary: body.summary,
      content: body.content,
    },
  });

  return NextResponse.json({
    success: true,
  });
}
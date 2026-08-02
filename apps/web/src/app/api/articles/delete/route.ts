import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const { id } = await request.json();

    await prisma.article.delete({
      where: {
        id: Number(id),
      },
    });

    return NextResponse.json({ success: true });

  } catch (error) {

    return NextResponse.json(
      {
        success: false,
        error: String(error),
      },
      { status: 500 }
    );
  }
}
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {

  const { id } = await request.json();

  await prisma.article.update({

    where: {
      id,
    },

    data: {
      published: true,
      updatedAt: new Date(),
    },

  });

  return NextResponse.json({
    success: true,
  });

}
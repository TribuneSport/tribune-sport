import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(request: NextRequest) {

  const { id } = await request.json();

  await db.article.update({

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
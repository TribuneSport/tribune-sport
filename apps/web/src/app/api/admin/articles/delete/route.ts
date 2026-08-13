import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {

  const { id } = await req.json();

  await db.article.delete({
    where: {
      id,
    },
  });

  return NextResponse.json({
    success: true,
  });

}
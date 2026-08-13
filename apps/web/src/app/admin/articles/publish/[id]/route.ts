import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  await db.article.update({
    where: {
      id: Number(id),
    },
    data: {
      published: true,
    },
  });

  return NextResponse.redirect(new URL("/admin/articles", request.url));
}
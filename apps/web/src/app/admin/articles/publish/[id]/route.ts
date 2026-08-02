import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  await prisma.article.update({
    where: {
      id: Number(id),
    },
    data: {
      published: true,
    },
  });

  return NextResponse.redirect(new URL("/admin/articles", request.url));
}
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {

  const form = await request.formData();

  const id = Number(form.get("id"));

  const title = String(form.get("title"));
  const summary = String(form.get("summary"));
  const content = String(form.get("content"));

  await prisma.article.update({

    where: {
      id,
    },

    data: {
      title,
      summary,
      content,
      updatedAt: new Date(),
    },

  });

  return NextResponse.redirect(new URL("/admin", request.url));

}
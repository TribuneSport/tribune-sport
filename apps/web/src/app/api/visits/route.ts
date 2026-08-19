import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const path =
      typeof body?.path === "string"
        ? body.path.substring(0, 500)
        : "/";

    /*
     * On ne compte jamais l'administration
     * ni les routes API.
     */
    if (
      path.startsWith("/admin") ||
      path.startsWith("/api") ||
      path.startsWith("/_next")
    ) {
      return NextResponse.json({
        success: true,
        counted: false,
      });
    }

    await db.visit.create({
      data: {
        path,
      },
    });

    /*
     * Si c'est un article :
     * on incrémente également son compteur individuel.
     *
     * Exemple :
     * /article/mon-article
     */
    const articleMatch =
      path.match(/^\/article\/([^/]+)$/);

    if (articleMatch) {
      const slug = decodeURIComponent(
        articleMatch[1]
      );

      await db.article.updateMany({
        where: {
          slug,
          published: true,
        },
        data: {
          views: {
            increment: 1,
          },
        },
      });
    }

    return NextResponse.json({
      success: true,
      counted: true,
    });
  } catch (error) {
    console.error(
      "Erreur compteur de visites :",
      error
    );

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
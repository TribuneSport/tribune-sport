import { NextRequest, NextResponse } from "next/server";
import { mkdir, writeFile } from "fs/promises";
import path from "path";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const data = await req.formData();

    const file = data.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "Aucun fichier." },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadDir = path.join(
      process.cwd(),
      "public",
      "uploads"
    );

    await mkdir(uploadDir, {
      recursive: true,
    });

    const extension =
      file.name.split(".").pop() || "jpg";

    const filename = `${Date.now()}-${Math.random()
      .toString(36)
      .substring(2, 10)}.${extension}`;

    const filepath = path.join(
      uploadDir,
      filename
    );

    await writeFile(filepath, buffer);

    return NextResponse.json({
      success: true,
      url: `/uploads/${filename}`,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Erreur lors de l'upload.",
      },
      {
        status: 500,
      }
    );
  }
}
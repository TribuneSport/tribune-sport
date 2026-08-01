import { NextResponse } from "next/server";
import { RSSImportService } from "@/services/rss-import.service";

export async function GET() {
  try {
    const importer = new RSSImportService();

    const total = await importer.import();

    return NextResponse.json({
      success: true,
      imported: total,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json({
      success: false,
      error: String(error),
    });
  }
}
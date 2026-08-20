import { NextResponse } from "next/server";
import { MatchImporter } from "@/importers/MatchImporter";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function POST() {
  try {
    console.log("IMPORT MATCHS");

    const importer = new MatchImporter();
    const matches = await importer.execute();

    return NextResponse.json({
      success: true,
      step: "matches",
      matches,
    });
  } catch (error) {
    console.error("ERREUR IMPORT MATCHS :", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Erreur inconnue lors de l'import des matchs.",
      },
      { status: 500 }
    );
  }
}

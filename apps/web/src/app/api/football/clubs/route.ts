New-Item -ItemType Directory -Force apps/web/src/app/api/football/clubs | Out-Null

@"
import { NextResponse } from "next/server";
import { ClubImporter } from "@/importers/ClubImporter";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function POST() {
  try {
    const importer = new ClubImporter();
    const clubs = await importer.execute();

    return NextResponse.json({
      success: true,
      step: "clubs",
      clubs,
    });
  } catch (error) {
    console.error("ERREUR IMPORT CLUBS :", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Erreur inconnue lors de l'import des clubs.",
      },
      { status: 500 }
    );
  }
}
"@ | Set-Content apps/web/src/app/api/football/clubs/route.ts -Encoding UTF8
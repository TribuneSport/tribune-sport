import { NextResponse } from "next/server";
import { PlayerImporter } from "@/importers/PlayerImporter";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function POST() {
  try {
    console.log("IMPORT JOUEURS");

    const importer = new PlayerImporter();
    const players = await importer.execute();

    return NextResponse.json({
      success: true,
      step: "players",
      players,
    });
  } catch (error) {
    console.error("ERREUR IMPORT JOUEURS :", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Erreur inconnue lors de l'import des joueurs.",
      },
      { status: 500 }
    );
  }
}

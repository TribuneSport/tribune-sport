import { NextResponse } from "next/server";
import { PlayerImporter } from "@/importers/PlayerImporter";

export const dynamic = "force-dynamic";

export async function POST() {
  try {
    console.log("====================================");
    console.log("TRIBUNE FOOT");
    console.log("IMPORT JOUEURS");
    console.log("====================================");

    const importer = new PlayerImporter();

    const players = await importer.execute();

    console.log("====================================");
    console.log(`IMPORT JOUEURS TERMINÉ : ${players}`);
    console.log("====================================");

    return NextResponse.json({
      success: true,
      players,
    });
  } catch (error) {
    console.error(
      "ERREUR IMPORT JOUEURS :",
      error
    );

    const message =
      error instanceof Error
        ? error.message
        : "Erreur inconnue lors de l'import des joueurs.";

    return NextResponse.json(
      {
        success: false,
        message: "Impossible d'importer les joueurs.",
        error: message,
      },
      {
        status: 500,
      }
    );
  }
}
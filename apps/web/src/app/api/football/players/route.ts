import { NextResponse } from "next/server";
import { PlayerImporter } from "@/importers/PlayerImporter";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function POST() {
  try {
    console.log("====================================");
    console.log("TRIBUNE FOOT");
    console.log("IMPORT JOUEURS");
    console.log("====================================");

    const importer = new PlayerImporter();

    const players = await importer.execute();

    console.log(
      `IMPORT JOUEURS TERMINE : ${players}`
    );

    return NextResponse.json({
      success: true,
      players,
    });
  } catch (error) {
    console.error(
      "ERREUR IMPORT JOUEURS :",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Impossible d'importer les joueurs.",
        error:
          error instanceof Error
            ? error.message
            : "Erreur inconnue.",
      },
      {
        status: 500,
      }
    );
  }
}
import { NextResponse } from "next/server";
import { PlayerImporter } from "@/importers/PlayerImporter";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const COMPETITIONS = [
  "FL1",
  "CL",
  "PL",
  "PD",
  "SA",
  "BL1",
  "DED",
  "PPL",
];

export async function POST(request: Request) {
  try {
    const body =
      await request.json().catch(() => ({}));

    const competition =
      typeof body?.competition === "string"
        ? body.competition
        : "FL1";

    if (!COMPETITIONS.includes(competition)) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Compétition invalide.",
        },
        { status: 400 }
      );
    }

    const importer =
      new PlayerImporter();

    const players =
      await importer.execute(
        competition
      );

    return NextResponse.json({
      success: true,
      step: "players",
      competition,
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
        error:
          error instanceof Error
            ? error.message
            : "Erreur inconnue lors de l'import des joueurs.",
      },
      { status: 500 }
    );
  }
}
import { NextResponse } from "next/server";
import { ClubImporter } from "@/importers/ClubImporter";

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
    const body = await request.json().catch(() => ({}));

    const competition =
      typeof body?.competition === "string"
        ? body.competition
        : COMPETITIONS[0];

    if (!COMPETITIONS.includes(competition)) {
      return NextResponse.json(
        {
          success: false,
          error: "Compétition invalide.",
        },
        { status: 400 }
      );
    }

    const importer = new ClubImporter();

    const clubs = await importer.execute(
      competition
    );

    return NextResponse.json({
      success: true,
      step: "clubs",
      competition,
      clubs,
    });
  } catch (error) {
    console.error(
      "ERREUR IMPORT CLUBS :",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Erreur inconnue.",
      },
      { status: 500 }
    );
  }
}
import { NextResponse } from "next/server";
import { MatchImporter } from "@/importers/MatchImporter";

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
        : "FL1";

    const dateFrom =
      typeof body?.dateFrom === "string"
        ? body.dateFrom
        : undefined;

    const dateTo =
      typeof body?.dateTo === "string"
        ? body.dateTo
        : undefined;

    if (!COMPETITIONS.includes(competition)) {
      return NextResponse.json(
        {
          success: false,
          error: "Compétition invalide.",
        },
        { status: 400 }
      );
    }

    const importer = new MatchImporter();

    const matches = await importer.execute(
      competition,
      dateFrom,
      dateTo
    );

    return NextResponse.json({
      success: true,
      step: "matches",
      competition,
      dateFrom,
      dateTo,
      matches,
    });
  } catch (error) {
    console.error(
      "ERREUR IMPORT MATCHS :",
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
import { NextResponse } from "next/server";
import { FootballSeeder } from "@/importers/FootballSeeder";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

export async function POST() {
  try {
    const seeder = new FootballSeeder();
    const result = await seeder.execute();

    return NextResponse.json(result);
  } catch (error) {
    console.error("ERREUR INITIALISATION FOOTBALL :", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Erreur inconnue lors de l'initialisation Football.",
      },
      { status: 500 }
    );
  }
}

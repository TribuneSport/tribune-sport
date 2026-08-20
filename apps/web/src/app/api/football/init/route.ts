import { NextResponse } from "next/server";
import { FootballSeeder } from "@/importers/FootballSeeder";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function POST() {
  try {
    console.log("====================================");
    console.log("TRIBUNE FOOT");
    console.log("INITIALISATION FOOTBALL");
    console.log("====================================");

    const seeder = new FootballSeeder();

    const result = await seeder.execute();

    console.log("INITIALISATION TERMINEE");

    return NextResponse.json(result);
  } catch (error) {
    console.error(
      "ERREUR INITIALISATION FOOTBALL :",
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
      {
        status: 500,
      }
    );
  }
}
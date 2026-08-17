import { NextResponse } from "next/server";
import { FootballSeeder } from "@/importers/FootballSeeder";

export const dynamic = "force-dynamic";

export async function POST() {
  try {
    console.log("====================================");
    console.log("DEBUT INITIALISATION FOOTBALL");
    console.log("====================================");

    const seeder = new FootballSeeder();

    const result = await seeder.execute();

    console.log("====================================");
    console.log("INITIALISATION FOOTBALL TERMINEE");
    console.log("====================================");

    return NextResponse.json({
      success: true,
      message: "Base Football initialisée avec succès.",
      data: result,
    });
  } catch (error) {
    console.error("ERREUR INITIALISATION FOOTBALL :", error);

    const message =
      error instanceof Error
        ? error.message
        : "Erreur inconnue lors de l'initialisation Football.";

    return NextResponse.json(
      {
        success: false,
        message: "Impossible d'initialiser la base Football.",
        error: message,
      },
      {
        status: 500,
      }
    );
  }
}
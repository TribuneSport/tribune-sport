import { NextResponse } from "next/server";
import { FootballSeeder } from "@/importers/FootballSeeder";

export async function POST() {
  try {
    const seeder = new FootballSeeder();
    const result = await seeder.execute();

    return NextResponse.json(result);
  } catch (error) {
    console.error("Football initialization error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Impossible d'initialiser la base Football.",
      },
      {
        status: 500,
      }
    );
  }
}

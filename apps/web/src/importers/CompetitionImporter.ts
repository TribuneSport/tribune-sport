import slugify from "slugify";
import { footballDb } from "@/lib/football/database";
import { footballData } from "@/lib/football/DataLoader";

export class CompetitionImporter {
  async execute(): Promise<number> {

    const competitions = footballData.getCompetitions();

    for (const competition of competitions) {

      await footballDb.createCompetition({

        name: competition.name,

        slug: slugify(competition.name, {
          lower: true,
          strict: true,
        }),

        country: competition.country,

        season: "2026-2027",

      });

    }

    return competitions.length;

  }
}
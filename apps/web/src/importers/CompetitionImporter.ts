import { footballDb } from "@/lib/football/database";
import { footballFetch } from "@/lib/football/api";

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

interface ApiCompetition {
  id: number;
  name: string;
  code: string;
  type: string;
  emblem?: string | null;
  area?: {
    id: number;
    name: string;
    code: string;
  };
  currentSeason?: {
    id: number;
    startDate: string;
    endDate: string;
    currentMatchday?: number;
  };
}

interface CompetitionsResponse {
  competitions: ApiCompetition[];
}

export class CompetitionImporter {
  async execute(): Promise<number> {
    console.log("🏆 Import des compétitions...");

    /*
     * Une seule requête pour récupérer toutes les compétitions.
     * Cela économise fortement le quota API.
     */
    const data =
      await footballFetch<CompetitionsResponse>(
        "/competitions"
      );

    const available = new Map(
      data.competitions.map((competition) => [
        competition.code,
        competition,
      ])
    );

    let imported = 0;

    for (const code of COMPETITIONS) {
      const competition = available.get(code);

      if (!competition) {
        console.warn(
          `⚠️ Compétition ${code} indisponible dans l'API.`
        );

        continue;
      }

      await footballDb.createCompetition({
        name: competition.name,
        slug: competition.code.toLowerCase(),
        country: competition.area?.name,
        logo: competition.emblem ?? undefined,
        season: competition.currentSeason
          ? `${competition.currentSeason.startDate.substring(
              0,
              4
            )}-${competition.currentSeason.endDate.substring(0, 4)}`
          : undefined,
      });

      imported++;

      console.log(
        `✅ Compétition importée : ${competition.name}`
      );
    }

    return imported;
  }
}
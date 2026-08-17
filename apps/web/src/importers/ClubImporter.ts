import slugify from "slugify";
import { footballDb } from "@/lib/football/database";
import {
  footballFetch,
  FootballApiError,
} from "@/lib/football/api";

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

interface ApiTeam {
  id: number;
  name: string;
  shortName?: string;
  tla?: string;
  crest?: string;
  address?: string;
  founded?: number;
  venue?: string;
  area?: {
    id: number;
    name: string;
    code: string;
  };
}

interface TeamsResponse {
  teams: ApiTeam[];
}

export class ClubImporter {
  async execute(): Promise<number> {
    const clubs = new Map<number, ApiTeam>();

    console.log("");
    console.log("⚽ Récupération des clubs...");

    for (const competition of COMPETITIONS) {
      try {
        console.log(
          `📡 Récupération des équipes : ${competition}`
        );

        const data =
          await footballFetch<TeamsResponse>(
            `/competitions/${competition}/teams`
          );

        for (const team of data.teams) {
          clubs.set(team.id, team);
        }

        console.log(
          `✅ ${data.teams.length} équipes trouvées pour ${competition}.`
        );
      } catch (error) {
        if (
          error instanceof FootballApiError &&
          error.status === 429
        ) {
          console.warn(
            `⚠️ Quota API atteint pendant ${competition}.`
          );

          console.warn(
            "⏸️ Import des clubs interrompu pour cette exécution."
          );

          break;
        }

        throw error;
      }
    }

    console.log("");
    console.log(
      `📊 ${clubs.size} clubs uniques récupérés.`
    );

    let imported = 0;

    for (const club of clubs.values()) {
      const slug = slugify(club.name, {
        lower: true,
        strict: true,
      });

      await footballDb.createClub({
        externalId: club.id,
        name: club.name,
        slug,
        country: club.area?.name ?? "Inconnu",
        city: undefined,
        stadium: club.venue,
        founded: club.founded,
        logo: club.crest,
      });

      imported++;

      console.log(
        `✅ Club importé : ${club.name}`
      );
    }

    console.log("");
    console.log(
      `✅ ${imported} clubs importés ou mis à jour.`
    );

    return imported;
  }
}

export default ClubImporter;
import slugify from "slugify";
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
  async execute(competitionCode?: string): Promise<number> {
    const codes = competitionCode
      ? [competitionCode]
      : COMPETITIONS;

    let imported = 0;

    for (const competition of codes) {
      console.log(`Import clubs : ${competition}`);

      const data = await footballFetch<TeamsResponse>(
        `/competitions/${competition}/teams`
      );

      for (const club of data.teams) {
        const slug =
          slugify(club.name, {
            lower: true,
            strict: true,
          }) || `club-${club.id}`;

        await footballDb.createClub({
          name: club.name,
          slug,
          country: club.area?.name ?? "Inconnu",
          stadium: club.venue,
          founded: club.founded,
          logo: club.crest,
        });

        imported++;
      }

      console.log(
        `${competition} : ${data.teams.length} clubs traités.`
      );
    }

    return imported;
  }
}

export default ClubImporter;
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

interface ApiMatch {
  id: number;
  utcDate: string;
  status: string;
  homeTeam: {
    id: number;
    name: string;
  };
  awayTeam: {
    id: number;
    name: string;
  };
  score?: {
    fullTime?: {
      home?: number | null;
      away?: number | null;
    };
  };
}

interface MatchesResponse {
  matches: ApiMatch[];
}

export class MatchImporter {
  async execute(
    competitionCode?: string
  ): Promise<number> {
    const codes = competitionCode
      ? [competitionCode]
      : COMPETITIONS;

    let imported = 0;

    for (const code of codes) {
      console.log(`Import matchs : ${code}`);

      const competition =
        await footballDb.getCompetitionBySlug(
          code.toLowerCase()
        );

      if (!competition) {
        console.warn(
          `Compétition absente : ${code}`
        );
        continue;
      }

      const data =
        await footballFetch<MatchesResponse>(
          `/competitions/${code}/matches`
        );

      for (const match of data.matches) {
        const homeClub =
          await footballDb.getClubByName(
            match.homeTeam.name
          );

        const awayClub =
          await footballDb.getClubByName(
            match.awayTeam.name
          );

        if (!homeClub || !awayClub) {
          continue;
        }

        const matchDate =
          new Date(match.utcDate);

        if (
          Number.isNaN(matchDate.getTime())
        ) {
          continue;
        }

        await footballDb.createMatch({
          competitionId: competition.id,
          homeClubId: homeClub.id,
          awayClubId: awayClub.id,
          matchDate,
          homeScore:
            match.score?.fullTime?.home ??
            undefined,
          awayScore:
            match.score?.fullTime?.away ??
            undefined,
          status: match.status,
        });

        imported++;
      }

      console.log(
        `${code} : ${data.matches.length} matchs traités.`
      );
    }

    return imported;
  }
}

export default MatchImporter;
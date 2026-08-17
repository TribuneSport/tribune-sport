import { footballDb } from "@/lib/football/database";
import { footballFetch, FootballApiError } from "@/lib/football/api";

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
  async execute(): Promise<number> {
    let imported = 0;

    console.log("");
    console.log("⚽ Récupération des matchs...");

    for (const competitionCode of COMPETITIONS) {
      try {
        console.log(
          `📡 Récupération des matchs : ${competitionCode}`
        );

        const data =
          await footballFetch<MatchesResponse>(
            `/competitions/${competitionCode}/matches`
          );

        console.log(
          `✅ ${data.matches.length} matchs trouvés pour ${competitionCode}.`
        );

        const competition =
          await footballDb.getCompetitionBySlug(
            competitionCode.toLowerCase()
          );

        if (!competition) {
          console.warn(
            `⚠️ Compétition introuvable en base : ${competitionCode}`
          );

          continue;
        }

        for (const match of data.matches) {
          const homeClub =
            await footballDb.getClubByExternalId(
              match.homeTeam.id
            );

          const awayClub =
            await footballDb.getClubByExternalId(
              match.awayTeam.id
            );

          if (!homeClub || !awayClub) {
            console.warn(
              `⚠️ Club introuvable : ${match.homeTeam.name} - ${match.awayTeam.name}`
            );

            continue;
          }

          const matchDate =
            new Date(match.utcDate);

          if (Number.isNaN(matchDate.getTime())) {
            console.warn(
              `⚠️ Date invalide pour le match ${match.id}`
            );

            continue;
          }

          const homeScore =
            match.score?.fullTime?.home ??
            undefined;

          const awayScore =
            match.score?.fullTime?.away ??
            undefined;

          await footballDb.createMatch({
            competitionId: competition.id,
            homeClubId: homeClub.id,
            awayClubId: awayClub.id,
            matchDate,
            homeScore,
            awayScore,
            status: match.status,
          });

          imported++;
        }
      } catch (error) {
        if (
          error instanceof FootballApiError &&
          error.status === 429
        ) {
          console.warn(
            `⚠️ Quota API atteint pendant ${competitionCode}.`
          );

          console.warn(
            "⏹️ Import des matchs interrompu pour cette exécution."
          );

          break;
        }

        throw error;
      }
    }

    console.log("");
    console.log(`📊 ${imported} matchs traités.`);
    console.log("⚽ Import des matchs terminé.");

    return imported;
  }
}

export default MatchImporter;
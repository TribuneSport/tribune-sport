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
    console.log("");

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

        /*
         * ---------------------------------------------------------
         * COMPÉTITION
         * ---------------------------------------------------------
         */

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

        /*
         * ---------------------------------------------------------
         * MATCHS
         * ---------------------------------------------------------
         */

        for (const match of data.matches) {
          /*
           * Les clubs ne sont plus recherchés avec externalId.
           *
           * Nous utilisons le nom fourni par Football Data API,
           * qui correspond au nom enregistré par ClubImporter.
           */

          const homeClub =
            await footballDb.getClubByName(
              match.homeTeam.name
            );

          const awayClub =
            await footballDb.getClubByName(
              match.awayTeam.name
            );

          /*
           * -------------------------------------------------------
           * CLUB MANQUANT
           * -------------------------------------------------------
           */

          if (!homeClub || !awayClub) {
            console.warn(
              `⚠️ Club introuvable : ${match.homeTeam.name} - ${match.awayTeam.name}`
            );

            continue;
          }

          /*
           * -------------------------------------------------------
           * DATE
           * -------------------------------------------------------
           */

          const matchDate =
            new Date(match.utcDate);

          if (
            Number.isNaN(
              matchDate.getTime()
            )
          ) {
            console.warn(
              `⚠️ Date invalide pour le match ${match.id}`
            );

            continue;
          }

          /*
           * -------------------------------------------------------
           * SCORE
           * -------------------------------------------------------
           */

          const homeScore =
            match.score?.fullTime?.home ??
            undefined;

          const awayScore =
            match.score?.fullTime?.away ??
            undefined;

          /*
           * -------------------------------------------------------
           * CRÉATION / MISE À JOUR
           *
           * createMatch() utilise la contrainte unique :
           *
           * competitionId
           * homeClubId
           * awayClubId
           * matchDate
           *
           * Donc relancer l'import ne crée pas de doublons.
           * -------------------------------------------------------
           */

          await footballDb.createMatch({
            competitionId:
              competition.id,

            homeClubId:
              homeClub.id,

            awayClubId:
              awayClub.id,

            matchDate,

            homeScore,

            awayScore,

            status:
              match.status,
          });

          imported++;

          console.log(
            `✅ Match traité : ${match.homeTeam.name} - ${match.awayTeam.name}`
          );
        }
      } catch (error) {
        /*
         * ---------------------------------------------------------
         * QUOTA FOOTBALL API
         * ---------------------------------------------------------
         */

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

    console.log(
      `📊 ${imported} matchs traités.`
    );

    console.log(
      "⚽ Import des matchs terminé."
    );

    return imported;
  }
}

export default MatchImporter;
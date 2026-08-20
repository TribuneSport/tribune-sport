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

interface ApiPlayer {
  id: number;
  name: string;
  position?: string;
  dateOfBirth?: string;
  nationality?: string;
  shirtNumber?: number;
  photo?: string;
}

interface ApiTeam {
  id: number;
  name: string;
  squad?: ApiPlayer[];
}

interface TeamsResponse {
  teams: ApiTeam[];
}

const CLUB_NAME_ALIASES: Record<string, string> = {
  "Paris Saint-Germain FC": "Paris Saint-Germain",
  "FC Barcelona": "FC Barcelone",
  "Real Madrid CF": "Real Madrid",
};

export class PlayerImporter {
  async execute(): Promise<number> {
    const teams = new Map<number, ApiTeam>();

    console.log("");
    console.log("Récupération des équipes et joueurs...");

    for (const competition of COMPETITIONS) {
      try {
        console.log(
          `Récupération des équipes : ${competition}`
        );

        const data = await footballFetch<TeamsResponse>(
          `/competitions/${competition}/teams`
        );

        for (const team of data.teams) {
          teams.set(team.id, team);
        }

        console.log(
          `${data.teams.length} équipes récupérées.`
        );
      } catch (error) {
        if (
          error instanceof FootballApiError &&
          error.status === 429
        ) {
          console.warn(
            `Quota API atteint pendant ${competition}.`
          );
          break;
        }

        throw error;
      }
    }

    let imported = 0;

    console.log(
      `${teams.size} équipes uniques à traiter.`
    );

    for (const team of teams.values()) {
      if (!team.squad?.length) {
        continue;
      }

      const databaseClubName =
        CLUB_NAME_ALIASES[team.name] ?? team.name;

      const clubSlug = slugify(databaseClubName, {
        lower: true,
        strict: true,
      });

      const club =
        await footballDb.getClubBySlug(clubSlug);

      if (!club) {
        console.warn(
          `Club introuvable : ${team.name}`
        );
        continue;
      }

      console.log(
        `Import joueurs : ${team.name} (${team.squad.length})`
      );

      /*
       * Traitement par petits lots.
       * Cela évite de conserver une énorme opération
       * en mémoire et limite les risques de timeout.
       */
      const BATCH_SIZE = 20;

      for (
        let i = 0;
        i < team.squad.length;
        i += BATCH_SIZE
      ) {
        const batch = team.squad.slice(
          i,
          i + BATCH_SIZE
        );

        await Promise.all(
          batch.map(async (player) => {
            const nameParts = player.name
              .trim()
              .split(/\s+/);

            const firstname =
              nameParts.length > 1
                ? nameParts
                    .slice(0, -1)
                    .join(" ")
                : nameParts[0];

            const lastname =
              nameParts.length > 1
                ? nameParts[nameParts.length - 1]
                : nameParts[0];

            const playerSlug = slugify(
              `${firstname}-${lastname}-${club.id}`,
              {
                lower: true,
                strict: true,
              }
            );

            let birthDate: Date | undefined;

            if (player.dateOfBirth) {
              const parsedDate = new Date(
                player.dateOfBirth
              );

              if (
                !Number.isNaN(
                  parsedDate.getTime()
                )
              ) {
                birthDate = parsedDate;
              }
            }

            try {
              await footballDb.createPlayer({
                firstname,
                lastname,
                slug: playerSlug,
                nationality:
                  player.nationality,
                birthDate,
                position: player.position,
                number: player.shirtNumber,
                photo: player.photo,
                clubId: club.id,
              });

              imported++;
            } catch (error: any) {
              /*
               * Un joueur déjà présent ne doit pas
               * faire échouer toute l'initialisation.
               */
              if (
                error?.code === "P2002"
              ) {
                return;
              }

              throw error;
            }
          })
        );
      }
    }

    console.log(
      `${imported} joueurs importés.`
    );

    return imported;
  }
}

export default PlayerImporter;
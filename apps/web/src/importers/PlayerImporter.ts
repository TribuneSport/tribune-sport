import slugify from "slugify";
import { footballDb } from "@/lib/football/database";
import {
  footballFetch,
  FootballApiError,
} from "@/lib/football/api";

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
  async execute(
    competitionCode: string
  ): Promise<number> {
    console.log(
      `Import joueurs : ${competitionCode}`
    );

    try {
      const data =
        await footballFetch<TeamsResponse>(
          `/competitions/${competitionCode}/teams`
        );

      const teams = new Map<number, ApiTeam>();

      for (const team of data.teams) {
        teams.set(team.id, team);
      }

      console.log(
        `${teams.size} équipes récupérées.`
      );

      const clubs = await footballDb.getAllClubs();

      const clubsByName = new Map(
        clubs.map((club) => [
          club.name,
          club,
        ])
      );

      let imported = 0;

      for (const team of teams.values()) {
        if (!team.squad?.length) {
          continue;
        }

        const databaseClubName =
          CLUB_NAME_ALIASES[team.name] ??
          team.name;

        const club =
          clubsByName.get(databaseClubName);

        if (!club) {
          console.warn(
            `Club introuvable : ${team.name}`
          );
          continue;
        }

        console.log(
          `Import joueurs : ${team.name} (${team.squad.length})`
        );

        for (const player of team.squad) {
          const nameParts =
            player.name
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
              ? nameParts[
                  nameParts.length - 1
                ]
              : nameParts[0];

          const playerSlug =
            slugify(
              `${firstname}-${lastname}-${club.id}`,
              {
                lower: true,
                strict: true,
              }
            );

          let birthDate:
            | Date
            | undefined;

          if (player.dateOfBirth) {
            const parsedDate =
              new Date(
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
              position:
                player.position,
              number:
                player.shirtNumber,
              photo:
                player.photo,
              clubId: club.id,
            });

            imported++;
          } catch (error: any) {
            if (error?.code === "P2002") {
              continue;
            }

            throw error;
          }
        }
      }

      console.log(
        `${imported} joueurs traités pour ${competitionCode}.`
      );

      return imported;
    } catch (error) {
      if (
        error instanceof FootballApiError &&
        error.status === 429
      ) {
        console.warn(
          `Quota API atteint pour ${competitionCode}.`
        );

        return 0;
      }

      throw error;
    }
  }
}

export default PlayerImporter;
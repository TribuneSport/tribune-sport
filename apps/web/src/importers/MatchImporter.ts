import { footballDb } from "@/lib/football/database";
import { footballFetch } from "@/lib/football/api";

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
    competitionCode: string,
    dateFrom?: string,
    dateTo?: string
  ): Promise<number> {
    const competition =
      await footballDb.getCompetitionBySlug(
        competitionCode.toLowerCase()
      );

    if (!competition) {
      throw new Error(
        `Compétition introuvable : ${competitionCode}`
      );
    }

    let endpoint =
      `/competitions/${competitionCode}/matches`;

    const params = new URLSearchParams();

    if (dateFrom) {
      params.set("dateFrom", dateFrom);
    }

    if (dateTo) {
      params.set("dateTo", dateTo);
    }

    if (params.toString()) {
      endpoint += `?${params.toString()}`;
    }

    console.log(`Import matchs : ${endpoint}`);

    const data =
      await footballFetch<MatchesResponse>(endpoint);

    if (!data.matches.length) {
      return 0;
    }

    /*
     * On charge les clubs une seule fois.
     * Cela évite 2 requêtes Prisma par match.
     */
    const clubs = await footballDb.getAllClubs();

    const clubsByName = new Map(
      clubs.map((club) => [club.name, club])
    );

    let imported = 0;

    for (const match of data.matches) {
      const homeClub =
        clubsByName.get(match.homeTeam.name);

      const awayClub =
        clubsByName.get(match.awayTeam.name);

      if (!homeClub || !awayClub) {
        console.warn(
          `Club introuvable : ${match.homeTeam.name} - ${match.awayTeam.name}`
        );
        continue;
      }

      const matchDate =
        new Date(match.utcDate);

      if (Number.isNaN(matchDate.getTime())) {
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
      `${competitionCode} : ${imported} matchs traités.`
    );

    return imported;
  }
}

export default MatchImporter;
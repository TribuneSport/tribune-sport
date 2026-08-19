import { db } from "@/lib/db";

export class FootballDatabase {
  async getClubBySlug(slug: string) {
    return db.club.findUnique({
      where: {
        slug,
      },
      include: {
        articles: true,
        players: true,

        homeMatches: {
          include: {
            awayClub: true,
            competition: true,
          },
        },

        awayMatches: {
          include: {
            homeClub: true,
            competition: true,
          },
        },
      },
    });
  }

  async getClubByName(name: string) {
    return db.club.findUnique({
      where: {
        name,
      },
      include: {
        articles: true,
        players: true,

        homeMatches: {
          include: {
            awayClub: true,
            competition: true,
          },
        },

        awayMatches: {
          include: {
            homeClub: true,
            competition: true,
          },
        },
      },
    });
  }

  async getCompetitionBySlug(slug: string) {
    return db.competition.findUnique({
      where: {
        slug,
      },
      include: {
        articles: true,
        matches: true,
      },
    });
  }

  async getPlayerBySlug(slug: string) {
    return db.player.findUnique({
      where: {
        slug,
      },
      include: {
        articles: true,
        club: true,
      },
    });
  }

  async getClubById(id: number) {
    return db.club.findUnique({
      where: {
        id,
      },
    });
  }

  async getCompetitionById(id: number) {
    return db.competition.findUnique({
      where: {
        id,
      },
    });
  }

  async createClub(data: {
    name: string;
    slug: string;
    country: string;
    city?: string;
    stadium?: string;
    founded?: number;
    logo?: string;
    banner?: string;
    description?: string;
  }) {
    const existingClub = await db.club.findUnique({
      where: {
        slug: data.slug,
      },
    });

    if (existingClub) {
      return db.club.update({
        where: {
          id: existingClub.id,
        },
        data: {
          name: data.name,
          slug: data.slug,
          country: data.country,
          city: data.city,
          stadium: data.stadium,
          founded: data.founded,
          logo: data.logo,
          banner: data.banner,
          description: data.description,
        },
      });
    }

    return db.club.create({
      data,
    });
  }

  async createCompetition(data: {
    name: string;
    slug: string;
    country?: string;
    logo?: string;
    season?: string;
  }) {
    const existingCompetition =
      await db.competition.findUnique({
        where: {
          slug: data.slug,
        },
      });

    if (existingCompetition) {
      return db.competition.update({
        where: {
          id: existingCompetition.id,
        },
        data: {
          name: data.name,
          slug: data.slug,
          country: data.country,
          logo: data.logo,
          season: data.season,
        },
      });
    }

    return db.competition.create({
      data,
    });
  }

  async createPlayer(data: {
    firstname: string;
    lastname: string;
    slug: string;
    nationality?: string;
    birthDate?: Date;
    position?: string;
    number?: number;
    photo?: string;
    clubId?: number;
  }) {
    const existingPlayer = await db.player.findUnique({
      where: {
        slug: data.slug,
      },
    });

    if (existingPlayer) {
      return db.player.update({
        where: {
          id: existingPlayer.id,
        },
        data: {
          firstname: data.firstname,
          lastname: data.lastname,
          nationality: data.nationality,
          birthDate: data.birthDate,
          position: data.position,
          number: data.number,
          photo: data.photo,
          clubId: data.clubId,
        },
      });
    }

    return db.player.create({
      data: {
        firstname: data.firstname,
        lastname: data.lastname,
        slug: data.slug,
        nationality: data.nationality,
        birthDate: data.birthDate,
        position: data.position,
        number: data.number,
        photo: data.photo,
        clubId: data.clubId,
      },
    });
  }

  async createMatch(data: {
    competitionId: number;
    homeClubId: number;
    awayClubId: number;
    matchDate: Date;
    homeScore?: number;
    awayScore?: number;
    status: string;
  }) {
    return db.match.upsert({
      where: {
        competitionId_homeClubId_awayClubId_matchDate: {
          competitionId: data.competitionId,
          homeClubId: data.homeClubId,
          awayClubId: data.awayClubId,
          matchDate: data.matchDate,
        },
      },

      update: {
        homeScore: data.homeScore,
        awayScore: data.awayScore,
        status: data.status,
      },

      create: data,
    });
  }
}

export const footballDb = new FootballDatabase();
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

  async getClubByExternalId(externalId: number) {
    return db.club.findUnique({
      where: {
        externalId,
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

  async createClub(data: {
    externalId: number;
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
    const existingByExternalId = await db.club.findUnique({
      where: {
        externalId: data.externalId,
      },
    });

    if (existingByExternalId) {
      return db.club.update({
        where: {
          id: existingByExternalId.id,
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

    const existingByName = await db.club.findUnique({
      where: {
        name: data.name,
      },
    });

    if (existingByName) {
      return db.club.update({
        where: {
          id: existingByName.id,
        },
        data: {
          externalId: data.externalId,
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
    /*
     * Vérification par slug.
     *
     * Le slug est unique dans la base.
     */
    const existingBySlug = await db.competition.findUnique({
      where: {
        slug: data.slug,
      },
    });

    if (existingBySlug) {
      return db.competition.update({
        where: {
          id: existingBySlug.id,
        },
        data: {
          name: data.name,
          country: data.country,
          logo: data.logo,
          season: data.season,
        },
      });
    }

    /*
     * Vérification par nom.
     *
     * Le nom est également unique dans la base.
     *
     * Cela évite l'erreur :
     *
     * Unique constraint failed on the fields: (`name`)
     */
    const existingByName = await db.competition.findUnique({
      where: {
        name: data.name,
      },
    });

    if (existingByName) {
      return db.competition.update({
        where: {
          id: existingByName.id,
        },
        data: {
          slug: data.slug,
          country: data.country,
          logo: data.logo,
          season: data.season,
        },
      });
    }

    /*
     * Aucune compétition existante :
     * création normale.
     */
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
    return db.player.upsert({
      where: {
        slug: data.slug,
      },

      update: {
        firstname: data.firstname,
        lastname: data.lastname,
        nationality: data.nationality,
        birthDate: data.birthDate,
        position: data.position,
        number: data.number,
        photo: data.photo,
        clubId: data.clubId,
      },

      create: {
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
import { db } from "@/lib/db";

export class FootballDatabase {
  async getClubBySlug(slug: string) {
    return db.club.findUnique({
      where: { slug },
      include: {
        articles: true,
        players: true,
        homeMatches: true,
        awayMatches: true,
      },
    });
  }

  async getCompetitionBySlug(slug: string) {
    return db.competition.findUnique({
      where: { slug },
      include: {
        articles: true,
        matches: true,
      },
    });
  }

  async getPlayerBySlug(slug: string) {
    return db.player.findUnique({
      where: { slug },
      include: {
        articles: true,
        club: true,
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
    return db.club.upsert({
      where: {
        slug: data.slug,
      },
      update: data,
      create: data,
    });
  }

  async createCompetition(data: {
    name: string;
    slug: string;
    country?: string;
    logo?: string;
    season?: string;
  }) {
    return db.competition.upsert({
      where: {
        slug: data.slug,
      },
      update: data,
      create: data,
    });
  }

  async createPlayer(data: {
    firstname: string;
    lastname: string;
    slug: string;
    nationality?: string;
    position?: string;
    number?: number;
    photo?: string;
    clubId?: number;
  }) {
    return db.player.upsert({
      where: {
        slug: data.slug,
      },
      update: data,
      create: data,
    });
  }
}

export const footballDb = new FootballDatabase();
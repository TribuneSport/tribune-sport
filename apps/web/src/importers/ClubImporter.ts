import slugify from "slugify";
import { footballDb } from "@/lib/football/database";
import { footballData } from "@/lib/football/DataLoader";

export class ClubImporter {

  async execute(): Promise<number> {

    const clubs = footballData.getClubs();

    for (const club of clubs) {

      await footballDb.createClub({

        name: club.name,

        slug: slugify(club.name, {
          lower: true,
          strict: true,
        }),

        country: club.country,

        city: club.city,

        founded: club.founded,

      });

    }

    return clubs.length;

  }

}
import { db } from "@/lib/db";

export class EntityAgent {
  async execute(): Promise<number> {
    const articles = await db.article.findMany({
      where: {
        OR: [
          { clubId: null },
          { playerId: null },
          { competitionId: null },
        ],
      },
    });

    const clubs = await db.club.findMany();
    const players = await db.player.findMany();
    const competitions = await db.competition.findMany();

    let total = 0;

    for (const article of articles) {
      const text = (
        article.title +
        " " +
        article.summary +
        " " +
        article.content
      ).toLowerCase();

      let clubId = article.clubId;
      let playerId = article.playerId;
      let competitionId = article.competitionId;

      if (!clubId) {
        const club = clubs.find((club) =>
          text.includes(club.name.toLowerCase())
        );

        if (club) {
          clubId = club.id;
        }
      }

      if (!playerId) {
        const player = players.find((player) =>
          text.includes(
            `${player.firstname} ${player.lastname}`.toLowerCase()
          )
        );

        if (player) {
          playerId = player.id;
        }
      }

      if (!competitionId) {
        const competition = competitions.find((competition) =>
          text.includes(competition.name.toLowerCase())
        );

        if (competition) {
          competitionId = competition.id;
        }
      }

      await db.article.update({
        where: {
          id: article.id,
        },
        data: {
          clubId,
          playerId,
          competitionId,
        },
      });

      total++;
    }

    return total;
  }
}
import { db } from "@/lib/db";

export class AdminService {

  async getDrafts() {

    return db.article.findMany({

      where: {
        published: false,
      },

      orderBy: {
        createdAt: "desc",
      },

    });

  }

  async getPublished() {

    return db.article.findMany({

      where: {
        published: true,
      },

      orderBy: {
        createdAt: "desc",
      },

    });

  }

}
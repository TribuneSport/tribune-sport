import { prisma } from "@/lib/prisma";

export class AdminService {

  async getDrafts() {

    return prisma.article.findMany({

      where: {
        published: false,
      },

      orderBy: {
        createdAt: "desc",
      },

    });

  }

  async getPublished() {

    return prisma.article.findMany({

      where: {
        published: true,
      },

      orderBy: {
        createdAt: "desc",
      },

    });

  }

}
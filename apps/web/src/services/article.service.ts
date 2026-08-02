import { prisma } from "@/lib/prisma";

export class ArticleService {

  async getPublishedArticles(limit: number = 20) {

    return prisma.article.findMany({

      where: {
        published: true,
      },

      orderBy: {
        createdAt: "desc",
      },

      take: limit,

    });

  }

  async getLatestArticles(limit: number = 20) {

    return prisma.article.findMany({

      orderBy: {
        createdAt: "desc",
      },

      take: limit,

    });

  }

  async getArticle(id: number) {

    return prisma.article.findUnique({

      where: {
        id,

      },

    });

  }

}
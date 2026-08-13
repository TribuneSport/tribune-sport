import { db } from "@/lib/db";

export class ArticleService {

  async getPublishedArticles(limit: number = 20) {

    return db.article.findMany({

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

    return db.article.findMany({

      orderBy: {
        createdAt: "desc",
      },

      take: limit,

    });

  }

  async getArticle(id: number) {

    return db.article.findUnique({

      where: {
        id,

      },

    });

  }

}
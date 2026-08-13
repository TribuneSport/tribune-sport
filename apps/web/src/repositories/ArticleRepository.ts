import { db } from "@/lib/db";

export class ArticleRepository {
  async findAll() {
    return db.article.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async findPublished() {
    return db.article.findMany({
      where: {
        published: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async findDrafts() {
    return db.article.findMany({
      where: {
        published: false,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async findById(id: number) {
    return db.article.findUnique({
      where: {
        id,
      },
    });
  }

  async publish(id: number) {
    return db.article.update({
      where: {
        id,
      },
      data: {
        published: true,
      },
    });
  }

  async delete(id: number) {
    return db.article.delete({
      where: {
        id,
      },
    });
  }
}
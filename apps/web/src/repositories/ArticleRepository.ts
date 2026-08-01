import { prisma } from "@/lib/prisma";

export class ArticleRepository {
  async findAll() {
    return prisma.article.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async findPublished() {
    return prisma.article.findMany({
      where: {
        published: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async findDrafts() {
    return prisma.article.findMany({
      where: {
        published: false,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async findById(id: number) {
    return prisma.article.findUnique({
      where: {
        id,
      },
    });
  }

  async publish(id: number) {
    return prisma.article.update({
      where: {
        id,
      },
      data: {
        published: true,
      },
    });
  }

  async delete(id: number) {
    return prisma.article.delete({
      where: {
        id,
      },
    });
  }
}
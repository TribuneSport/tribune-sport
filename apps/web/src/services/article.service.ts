import { prisma } from "@/lib/prisma";

export class ArticleService {
  async create(data: {
    title: string;
    summary: string;
    content: string;
    category: string;
    image: string;
  }) {
    return prisma.article.create({
      data,
    });
  }
}
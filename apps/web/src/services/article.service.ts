import { db } from "@/lib/db";

interface CreateArticleInput {
  title: string;
  summary: string;
  content: string;
  category: string;
  image: string;
  sourceUrl?: string | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
  slug?: string | null;
  published?: boolean;
}

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

  async createArticle(data: CreateArticleInput) {
    return db.article.create({
      data: {
        title: data.title,
        summary: data.summary,
        content: data.content,
        category: data.category,
        image: data.image,
        sourceUrl: data.sourceUrl?.trim() || null,
        seoTitle: data.seoTitle || null,
        seoDescription: data.seoDescription || null,
        slug: data.slug || null,
        published: data.published ?? false,
      },
    });
  }
}
export interface ArticleInput {
  title: string;
  summary: string;
  content: string;
  category: string;
  image: string;
  sourceUrl: string;
  seoTitle?: string;
  seoDescription?: string;
  slug?: string;
  published?: boolean;
}

export interface ArticleUpdate extends Partial<ArticleInput> {}

export interface ArticleFilters {
  search?: string;
  category?: string;
  published?: boolean;
}

export interface ArticleDTO {
  id: number;
  title: string;
  summary: string;
  content: string;
  category: string;
  image: string;
  sourceUrl: string;
  published: boolean;
  seoTitle: string | null;
  seoDescription: string | null;
  slug: string | null;
  createdAt: Date;
  updatedAt: Date;
}
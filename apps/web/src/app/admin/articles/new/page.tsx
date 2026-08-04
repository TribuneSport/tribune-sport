import ArticleForm from "@/components/admin/ArticleForm";

export default function NewArticlePage() {
  return (
    <main className="mx-auto max-w-5xl p-8">
      <h1 className="mb-8 text-3xl font-bold">
        Nouvel article
      </h1>

      <ArticleForm />
    </main>
  );
}
"use client";

import { useState } from "react";

type Props = {
  article: {
    id: number;
    title: string;
    summary: string;
    content: string;
  };
};

export default function EditArticleForm({ article }: Props) {
  const [title, setTitle] = useState(article.title);
  const [summary, setSummary] = useState(article.summary);
  const [content, setContent] = useState(article.content);
  const [saving, setSaving] = useState(false);

  async function save() {
    setSaving(true);

    await fetch(`/api/articles/update/${article.id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        summary,
        content,
      }),
    });

    setSaving(false);

    alert("Article enregistré.");
  }

  return (
    <div className="space-y-6">

      <div>
        <label className="font-bold">Titre</label>

        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-2 w-full rounded border p-3"
        />
      </div>

      <div>
        <label className="font-bold">Résumé</label>

        <textarea
          rows={5}
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          className="mt-2 w-full rounded border p-3"
        />
      </div>

      <div>
        <label className="font-bold">Contenu</label>

        <textarea
          rows={20}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="mt-2 w-full rounded border p-3"
        />
      </div>

      <button
        onClick={save}
        disabled={saving}
        className="rounded bg-blue-600 px-6 py-3 text-white"
      >
        {saving ? "Enregistrement..." : "Enregistrer"}
      </button>

    </div>
  );
}
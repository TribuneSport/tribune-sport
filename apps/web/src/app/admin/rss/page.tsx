"use client";

import { useState } from "react";

const sources = [
  {
    name: "L'Équipe",
    url: "https://www.lequipe.fr/rss/actu_rss_Football.xml",
    status: "Active",
    priority: "France",
  },
  {
    name: "RMC Sport",
    url: "https://rmcsport.bfmtv.com/rss/football/",
    status: "Active",
    priority: "France",
  },
  {
    name: "Foot Mercato",
    url: "https://www.footmercato.net/rss",
    status: "Active",
    priority: "France",
  },
  {
    name: "Le Figaro Football",
    url: "https://www.lefigaro.fr/rss/figaro_football.xml",
    status: "Active",
    priority: "France",
  },
  {
    name: "UEFA",
    url: "https://www.uefa.com/rssfeed/news/rss.xml",
    status: "Active",
    priority: "International",
  },
  {
    name: "BBC Sport Football",
    url: "https://feeds.bbci.co.uk/sport/football/rss.xml",
    status: "Active",
    priority: "International",
  },
  {
    name: "The Guardian Football",
    url: "https://www.theguardian.com/football/rss",
    status: "Active",
    priority: "International",
  },
];

export default function RSSPage() {
  const [loading, setLoading] = useState(false);

  const [result, setResult] = useState<{
    success?: boolean;
    imported?: number;
    error?: string;
  } | null>(null);

  async function runImport() {
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch(
        "/api/agents/news",
        {
          method: "GET",
          cache: "no-store",
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.error ||
            "Erreur pendant l'import RSS"
        );
      }

      setResult(data);
    } catch (error) {
      setResult({
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Erreur inconnue",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="p-6 md:p-10">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold md:text-4xl">
            Sources RSS
          </h1>

          <p className="mt-2 text-gray-500">
            Sources utilisées pour l'import
            automatique des actualités.
          </p>
        </div>

        <button
          type="button"
          onClick={runImport}
          disabled={loading}
          className="rounded-lg bg-black px-5 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading
            ? "Import en cours..."
            : "Importer maintenant"}
        </button>
      </div>

      {result && (
        <div
          className={`mb-8 rounded-lg border p-4 ${
            result.success
              ? "border-green-200 bg-green-50 text-green-800"
              : "border-red-200 bg-red-50 text-red-800"
          }`}
        >
          {result.success ? (
            <>
              <strong>
                Import terminé.
              </strong>

              <div className="mt-1">
                {result.imported ?? 0} nouvel
                article
                {(result.imported ?? 0) > 1
                  ? "s"
                  : ""}{" "}
                importé
                {(result.imported ?? 0) > 1
                  ? "s"
                  : ""}.
              </div>
            </>
          ) : (
            <>
              <strong>
                Erreur pendant l'import.
              </strong>

              <div className="mt-1 break-words">
                {result.error}
              </div>
            </>
          )}
        </div>
      )}

      <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
        <div className="hidden grid-cols-[1fr_2fr_auto_auto] gap-4 border-b bg-gray-50 px-5 py-4 font-semibold md:grid">
          <div>Source</div>
          <div>Flux RSS</div>
          <div>Priorité</div>
          <div>État</div>
        </div>

        {sources.map((source) => (
          <div
            key={source.url}
            className="grid gap-3 border-b px-5 py-4 last:border-b-0 md:grid-cols-[1fr_2fr_auto_auto] md:items-center md:gap-4"
          >
            <div className="font-medium">
              {source.name}
            </div>

            <a
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="break-all text-sm text-blue-600 hover:underline"
            >
              {source.url}
            </a>

            <div>
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  source.priority === "France"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-purple-100 text-purple-700"
                }`}
              >
                {source.priority}
              </span>
            </div>

            <div>
              <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                {source.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
"use client";

import { useState } from "react";

const sources = [
  {
    name: "L'Équipe",
    url: "https://www.lequipe.fr/rss/actu_rss_Football.xml",
    status: "Active",
  },
  {
    name: "RMC Sport",
    url: "https://rmcsport.bfmtv.com/rss/football/",
    status: "Active",
  },
  {
    name: "Foot Mercato",
    url: "https://www.footmercato.net/rss",
    status: "Active",
  },
  {
    name: "Le Figaro Football",
    url: "https://www.lefigaro.fr/rss/figaro_football.xml",
    status: "Active",
  },
  {
    name: "UEFA",
    url: "https://www.uefa.com/rssfeed/news/rss.xml",
    status: "Active",
  },
  {
    name: "BBC Sport Football",
    url: "https://feeds.bbci.co.uk/sport/football/rss.xml",
    status: "Active",
  },
  {
    name: "The Guardian Football",
    url: "https://www.theguardian.com/football/rss",
    status: "Active",
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
      const response = await fetch("/api/agents/news", {
        method: "GET",
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Erreur pendant l'import RSS");
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
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold">
            Sources RSS
          </h1>

          <p className="text-gray-500 mt-2">
            Sources utilisées pour l'import automatique des actualités.
          </p>
        </div>

        <button
          type="button"
          onClick={runImport}
          disabled={loading}
          className="rounded-lg bg-black px-5 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Import en cours..." : "Importer maintenant"}
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
              <strong>Import terminé.</strong>
              <div className="mt-1">
                {result.imported ?? 0} nouvel article importé.
              </div>
            </>
          ) : (
            <>
              <strong>Erreur pendant l'import.</strong>
              <div className="mt-1 break-words">
                {result.error}
              </div>
            </>
          )}
        </div>
      )}

      <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
        <div className="grid grid-cols-[1fr_2fr_auto] gap-4 border-b bg-gray-50 px-5 py-4 font-semibold">
          <div>Source</div>
          <div>Flux RSS</div>
          <div>État</div>
        </div>

        {sources.map((source) => (
          <div
            key={source.url}
            className="grid grid-cols-[1fr_2fr_auto] gap-4 border-b px-5 py-4 last:border-b-0"
          >
            <div className="font-medium">
              {source.name}
            </div>

            <div className="truncate text-sm text-gray-500">
              {source.url}
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
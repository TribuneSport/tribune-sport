"use client";

import { useState } from "react";

export default function FootballSeederButton() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function runStep(url: string, label: string) {
    setMessage(label);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const text = await response.text();

    let data: any;

    try {
      data = JSON.parse(text);
    } catch {
      throw new Error(
        "Réponse invalide du serveur : " +
          (text || `HTTP ${response.status}`)
      );
    }

    if (!response.ok || !data.success) {
      throw new Error(
        data.error ||
          data.message ||
          `Erreur HTTP ${response.status}`
      );
    }

    return data;
  }

  async function runSeeder() {
    if (loading) return;

    setLoading(true);
    setMessage("Initialisation...");

    try {
      await runStep(
        "/api/football/seed",
        "1/4 — Import des compétitions..."
      );

      await runStep(
        "/api/football/clubs",
        "2/4 — Import des clubs..."
      );

      await runStep(
        "/api/football/players",
        "3/4 — Import des joueurs..."
      );

      await runStep(
        "/api/football/matches",
        "4/4 — Import des matchs..."
      );

      setMessage(
        "Base Football initialisée avec succès."
      );
    } catch (error) {
      console.error(
        "Erreur initialisation Football :",
        error
      );

      setMessage(
        error instanceof Error
          ? error.message
          : "Erreur pendant l'initialisation."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        onClick={runSeeder}
        disabled={loading}
        className="rounded-lg bg-green-600 px-4 py-2 font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading
          ? "Initialisation en cours..."
          : "Initialiser la base Football"}
      </button>

      {message && (
        <p className="text-sm text-gray-600">
          {message}
        </p>
      )}
    </div>
  );
}

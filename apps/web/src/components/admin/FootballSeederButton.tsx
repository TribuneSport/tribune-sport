"use client";

import { useState } from "react";

export default function FootballSeederButton() {
  const [loading, setLoading] = useState(false);

  async function runSeeder() {
    if (loading) return;

    setLoading(true);

    try {
      const response = await fetch("/api/football/seed", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const text = await response.text();

      if (!response.ok) {
        throw new Error(
          `Erreur lors de l'initialisation (${response.status}) : ${text}`
        );
      }

      let data: any = null;

      try {
        data = JSON.parse(text);
      } catch {
        data = null;
      }

      alert(
        data?.message ||
          "Base Football initialisée avec succès."
      );
    } catch (error) {
      console.error("Erreur lors de l'initialisation :", error);

      alert(
        error instanceof Error
          ? error.message
          : "Erreur lors de l'initialisation."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={runSeeder}
      disabled={loading}
      className="rounded-lg bg-green-600 px-4 py-2 font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {loading ? "Initialisation..." : "Initialiser la base Football"}
    </button>
  );
}
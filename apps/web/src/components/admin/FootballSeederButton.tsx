"use client";

import { useState } from "react";

export default function FootballSeederButton() {
  const [loading, setLoading] = useState(false);

  async function runSeeder() {
    try {
      setLoading(true);

      const response = await fetch("/api/football/init", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Erreur lors de l'initialisation");
      }

      alert("Base Football initialisée.");
    } catch (error) {
      console.error(error);
      alert("Erreur lors de l'initialisation de la base Football.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={runSeeder}
      disabled={loading}
      className="rounded-xl bg-emerald-600 px-6 py-3 font-bold text-white hover:bg-emerald-700 disabled:opacity-50"
    >
      {loading ? "Import..." : "Initialiser la base Football"}
    </button>
  );
}

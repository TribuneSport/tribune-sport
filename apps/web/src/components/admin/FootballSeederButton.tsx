"use client";

import { useState } from "react";

export default function FootballSeederButton() {
  const [loading, setLoading] = useState(false);

  async function runSeeder() {
    setLoading(true);

    await fetch("/api/football/init");

    alert("Base Football initialisée.");

    setLoading(false);
  }

  return (
    <button
      onClick={runSeeder}
      disabled={loading}
      className="rounded-xl bg-emerald-600 px-6 py-3 text-white font-bold hover:bg-emerald-700"
    >
      {loading ? "Import..." : "Initialiser la base Football"}
    </button>
  );
}
"use client";

import { useState } from "react";

export default function LoginPage() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function login(e: React.FormEvent) {

    e.preventDefault();

    const res = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const data = await res.json();

    if (!data.success) {
      alert("Identifiants incorrects");
      return;
    }

    window.location.href = "/admin";
  }

  return (

    <main className="flex min-h-screen items-center justify-center bg-gray-100">

      <form
        onSubmit={login}
        className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg"
      >

        <h1 className="mb-8 text-center text-3xl font-bold">
          Tribune Sport
        </h1>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-4 w-full rounded border p-3"
        />

        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-6 w-full rounded border p-3"
        />

        <button
          className="w-full rounded bg-red-600 p-3 font-bold text-white hover:bg-red-700"
        >
          Se connecter
        </button>

      </form>

    </main>

  );

}
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const url = process.env.DATABASE_URL;

    if (!url) {
      return NextResponse.json({
        ok: false,
        error: "DATABASE_URL absente",
      });
    }

    const parsed = new URL(url);

    return NextResponse.json({
      ok: true,
      protocol: parsed.protocol,
      host: parsed.hostname,
      database: parsed.pathname,
      sslmode: parsed.searchParams.get("sslmode"),
      channel_binding: parsed.searchParams.get("channel_binding"),
      username: parsed.username,
    });
  } catch (error) {
    return NextResponse.json({
      ok: false,
      error: String(error),
    });
  }
}

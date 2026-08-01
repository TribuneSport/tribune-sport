import { NextResponse } from "next/server";
import { NewsAgent } from "@/agents/news/NewsAgent";

export async function GET() {
  const agent = new NewsAgent();

  const processed = await agent.process();

  return NextResponse.json({
    success: true,
    processed,
  });
}
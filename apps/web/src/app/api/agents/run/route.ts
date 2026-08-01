import { NextResponse } from "next/server";
import { Scheduler } from "@/agents/Scheduler";

export async function GET() {
  try {
    const scheduler = new Scheduler();

    const result = await scheduler.run();

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json({
      success: false,
      error: String(error),
    });
  }
}
import { NextResponse } from "next/server";
import { AdminService } from "@/services/admin.service";

export async function GET() {

  const admin = new AdminService();

  const drafts = await admin.getDrafts();

  const published = await admin.getPublished();

  return NextResponse.json({

    drafts,

    published,

  });

}
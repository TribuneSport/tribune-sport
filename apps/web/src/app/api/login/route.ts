import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {

  const { email, password } = await request.json();

  if (
    email === process.env.ADMIN_EMAIL &&
    password === process.env.ADMIN_PASSWORD
  ) {
    return NextResponse.json({
      success: true,
    });
  }

  return NextResponse.json(
    {
      success: false,
    },
    {
      status: 401,
    }
  );

}
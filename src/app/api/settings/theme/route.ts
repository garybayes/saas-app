import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId");
  if (!userId)
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { theme: true },
  });

  return NextResponse.json(user || { theme: "light" });
}

export async function POST(req: NextRequest) {
  try {
    const { userId, theme } = await req.json();

    const updatedUser = await prisma.user.upsert({
      where: { id: userId },
      update: { theme },
      create: { id: userId, theme, email: `${userId}@example.com` },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Error updating theme:", error);
    return NextResponse.json(
      { error: "Failed to update theme" },
      { status: 500 }
    );
  }
}

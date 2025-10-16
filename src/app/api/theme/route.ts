import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface ThemeRequestBody {
  userId?: string;
  theme?: "light" | "dark";
}

// GET: fetch current theme
export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId") || "user-001";

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { theme: true },
    });

    return NextResponse.json({
      theme: user?.theme || "light",
    });
  } catch (error) {
    console.error("GET /api/theme error:", error);
    return NextResponse.json({ theme: "light" }, { status: 500 });
  }
}

// POST: update theme
export async function POST(req: NextRequest) {
  try {
    const body: ThemeRequestBody = await req.json();
    const userId = body.userId || "user-001";
    const theme = body.theme || "light";

    // Upsert ensures user exists
    const user = await prisma.user.upsert({
      where: { id: userId },
      update: { theme },
      create: {
        id: userId,
        email: "user@example.com", // placeholder, required by schema
        theme,
      },
    });

    return NextResponse.json({ theme: user.theme });
  } catch (error) {
    console.error("POST /api/theme error:", error);
    return NextResponse.json({ theme: "light" }, { status: 500 });
  }
}

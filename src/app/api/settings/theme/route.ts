// src/app/api/settings/theme/route.ts
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

const prisma = new PrismaClient();

// ✅ GET theme
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, email: true, theme: true },
    });

    return NextResponse.json(user || {});
  } catch (error) {
    console.error("GET /api/settings/theme error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// ✅ POST theme update
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { theme } = await req.json();
    if (!["light", "dark"].includes(theme)) {
      return NextResponse.json({ error: "Invalid theme" }, { status: 400 });
    }

    const updated = await prisma.user.update({
      where: { id: session.user.id },
      data: { theme, updatedAt: new Date() },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("POST /api/settings/theme error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

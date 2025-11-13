import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/requireAuth";

export async function GET(req: NextRequest): Promise<Response> {
  const { userId, response } = await requireAuth(req);
  if (response) return response;
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const connections = await prisma.connection.findMany({
    where: { userId },
    select: { id: true, appName: true, apiKey: true, createdAt: true },
  });

  return NextResponse.json({ connections });
}

export async function POST() {
  return NextResponse.json({ success: true, message: "POST not yet implemented" });
}

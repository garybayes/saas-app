import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/requireAuth";

export async function GET(req: NextRequest): Promise<Response> {
  const { userId, response } = await requireAuth(req);
  if (response) return response;
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { theme: true },
  });

  return NextResponse.json({ theme: user?.theme || "light" });
}

export async function PATCH(req: NextRequest): Promise<Response> {
  const { userId, response } = await requireAuth(req);
  if (response) return response;
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { theme } = await req.json();

  const updated = await prisma.user.update({
    where: { id: userId },
    data: { theme },
    select: { theme: true },
  });

  return NextResponse.json({ theme: updated.theme });
}

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
    select: { email: true, displayName: true, theme: true },
  });

  return NextResponse.json({ user });
}

export async function PATCH(req: NextRequest): Promise<Response> {
  const { userId, response } = await requireAuth(req);
  if (response) return response;
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { displayName, theme } = await req.json();

  const updated = await prisma.user.update({
    where: { id: userId },
    data: { displayName, theme },
    select: { email: true, displayName: true, theme: true },
  });

  return NextResponse.json({ user: updated });
}

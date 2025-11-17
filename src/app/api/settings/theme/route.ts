// src/app/api/settings/theme/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/requireAuth";

export async function PATCH(req: NextRequest) {
  const { userId, response } = await requireAuth(req);
  if (response) return response;

  const { theme } = await req.json();

  const updated = await prisma.user.update({
    where: { id: userId },
    data: { theme },
    select: { theme: true },
  });

  return NextResponse.json({ theme: updated.theme });
}

export async function GET(req: NextRequest) {
  const { userId, response } = await requireAuth(req);
  if (response) return response;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { theme: true },
  });

  return NextResponse.json({ theme: user?.theme ?? "light" });
}

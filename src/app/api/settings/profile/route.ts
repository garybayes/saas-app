// src/app/api/settings/profile/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/requireAuth";

export async function GET(req: NextRequest) {
  const { userId, response } = await requireAuth(req);
  if (response) return response;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      email: true,
      displayName: true,
      theme: true,
      lastLogin: true,
      connections: true, // ← needed for dashboard
    },
  });

  return NextResponse.json({
    displayName: user?.displayName ?? "",
    email: user?.email ?? "",
    theme: user?.theme ?? "light",
    lastLogin: user?.lastLogin ?? null,
    connections: user?.connections?.length ?? 0,
  });
}

export async function PATCH(req: NextRequest) {
  const { userId, response } = await requireAuth(req);
  if (response) return response;

  const { displayName, theme } = await req.json();

  const updated = await prisma.user.update({
    where: { id: userId },
    data: { displayName, theme },
    select: {
      email: true,
      displayName: true,
      theme: true,
    },
  });

  return NextResponse.json(updated);
}

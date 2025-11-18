// src/app/api/connections/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/requireAuth";

export async function GET(req: NextRequest) {
  const { userId, response } = await requireAuth(req);
  if (response) return response;

  const connections = await prisma.connection.findMany({
    where: { userId },
    select: {
      id: true,
      appName: true,
      apiKey: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(connections);
}

export async function POST(req: NextRequest) {
  const { userId, response } = await requireAuth(req);
  if (response) return response;

  const { appName, apiKey } = await req.json();

  await prisma.connection.create({
    data: {
      appName,
      apiKey,
      userId,
    },
  });

  return NextResponse.json({ success: true });
}

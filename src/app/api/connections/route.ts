import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId");
  if (!userId)
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });

  const connections = await prisma.connection.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(connections);
}

export async function POST(req: NextRequest) {
  try {
    const { userId, appName, apiKey } = await req.json();
    const connection = await prisma.connection.create({
      data: { userId, appName, apiKey },
    });
    return NextResponse.json(connection);
  } catch (error) {
    console.error("Error creating connection:", error);
    return NextResponse.json(
      { error: "Failed to create connection" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  if (!id)
    return NextResponse.json({ error: "Missing id" }, { status: 400 });

  await prisma.connection.delete({ where: { id } });
  return NextResponse.json({ success: true });
}

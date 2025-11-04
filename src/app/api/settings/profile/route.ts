import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { User } from "@prisma/client";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });
  const connections = await prisma.connection.count({
    where: { userId: session.user.id },
  });

  return NextResponse.json({
    displayName: user?.displayName ?? null,
    email: user?.email ?? "",
    theme: user?.theme ?? "light",
    lastLogin: (user as User)?.lastLogin ?? null,
    connections,
  });
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const updated = await prisma.user.update({
    where: { id: session.user.id },
    data: {
      displayName: body.displayName,
      theme: body.theme,
      lastLogin: new Date(),
    },
  });

  return NextResponse.json(updated);
}

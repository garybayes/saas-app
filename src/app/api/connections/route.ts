// src/app/api/connections/route.ts
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { encrypt, decrypt } from "@/lib/crypto";

const prisma = new PrismaClient();

// ✅ GET user’s connections
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const connections = await prisma.connection.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    });

    const decrypted = connections.map((c) => ({
      ...c,
      apiKey: c.apiKey ? decrypt(c.apiKey) : "",
    }));

    return NextResponse.json(decrypted);
  } catch (error) {
    console.error("GET /api/connections error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// ✅ POST new connection
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { appName, apiKey } = await req.json();
    if (!appName || !apiKey) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const encryptedKey = encrypt(apiKey);

    const created = await prisma.connection.create({
      data: {
        userId: session.user.id,
        appName,
        apiKey: encryptedKey,
      },
    });

    return NextResponse.json(created);
  } catch (error) {
    console.error("POST /api/connections error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

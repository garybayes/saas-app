import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { encrypt, decrypt } from "@/lib/crypto";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/connections
 * Returns all saved connections for the logged-in user.
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    const connections = await prisma.connection.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    // 🔐 Decrypt API keys before returning (if any)
    const decryptedConnections = connections.map((conn) => {
      try {
        const decryptedKey = conn.apiKey ? decrypt(conn.apiKey) : "";
        return { ...conn, apiKey: decryptedKey };
      } catch (error) {
        console.error("Error decrypting API key:", error);
        return { ...conn, apiKey: "" };
      }
    });

    return NextResponse.json(decryptedConnections, { status: 200 });
  } catch (error: unknown) {
    let errorMessage = "Failed to fetch connections";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    console.error("GET /api/connections error:", errorMessage);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

/**
 * POST /api/connections
 * Adds a new connection for the logged-in user.
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const { appName, apiKey } = await req.json();

    if (!appName || !apiKey) {
      return NextResponse.json(
        { error: "Missing appName or apiKey" },
        { status: 400 }
      );
    }

    const encryptedKey = encrypt(apiKey);

    const newConnection = await prisma.connection.create({
      data: {
        appName,
        apiKey: encryptedKey,
        userId,
      },
    });

    return NextResponse.json(newConnection, { status: 201 });
  } catch (error: unknown) {
    let errorMessage = "Failed to create connection";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    console.error("POST /api/connections error:", errorMessage);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

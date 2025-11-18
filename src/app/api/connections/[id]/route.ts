// src/app/api/connections/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/requireAuth";

// DELETE /api/connections/[id]
export async function DELETE(req: NextRequest): Promise<Response> {
  const { userId, response } = await requireAuth(req);
  if (response) return response; // Return 401 if unauthorized
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(req.url);
  const id = url.pathname.split("/").pop();
  if (!id) {
    return NextResponse.json({ error: "Missing connection ID" }, { status: 400 });
  }

  // ✅ userId is guaranteed to be string here
  await prisma.connection.deleteMany({
    where: { id, userId },
  });

  return NextResponse.json({ success: true });
}

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs"; // or from "next-auth" if using that

// DELETE /api/connections/[id]
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const connection = await prisma.connection.findUnique({
      where: { id: params.id },
    });

    if (!connection || connection.userId !== userId)
      return NextResponse.json({ error: "Not found" }, { status: 404 });

    await prisma.connection.delete({ where: { id: params.id } });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE /connections error:", err);
    return NextResponse.json({ error: "Failed to delete connection" }, { status: 500 });
  }
}


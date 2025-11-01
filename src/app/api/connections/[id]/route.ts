import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

/**
 * DELETE /api/connections/[id]
 * Force-fix: Satisfies the build error which incorrectly expects params to be a Promise.
 */
export async function DELETE(
  req: NextRequest,
  // 🎯 FIX: Match the incorrect type reported by the compiler (Promise<{ id: string }>)
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 💡 AWAIT the params object because the type requires it.
    const awaitedContext = await context.params;
    const { id } = awaitedContext;

    if (!id) {
      return NextResponse.json({ error: "Missing connection ID" }, { status: 400 });
    }

    // First, verify the connection exists and belongs to the user.
    const connection = await prisma.connection.findFirst({
      where: {
        id: id,
        userId: session.user.id,
      },
    });

    if (!connection) {
      return NextResponse.json(
        { error: "Connection not found or you do not have permission to delete it" },
        { status: 404 }
      );
    }

    // If verification passes, delete the connection.
    await prisma.connection.delete({
      where: { id },
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: unknown) {
    let errorMessage = "Failed to delete connection";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    console.error("Error deleting connection:", errorMessage);
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

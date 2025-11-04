import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
* GET  /api/workflows      → List user workflows
* POST /api/workflows      → Create new workflow
*/

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const workflows = await prisma.workflow.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(workflows);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { name, data } = await req.json();

  const workflow = await prisma.workflow.create({
    data: {
      name: name || "Untitled Workflow",
      data: data || {},
      userId: session.user.id,
    },
  });

  return NextResponse.json(workflow, { status: 201 });
}

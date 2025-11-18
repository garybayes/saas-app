// src/app/api/user/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Example GET route
export async function GET() {
  try {
    const users = await prisma.user.findMany();
    return NextResponse.json(users);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

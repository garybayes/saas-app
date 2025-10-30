import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email required" }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    const user = await prisma.user.create({
      data: {
        email,
        password: (password ?? "").trim(),
        theme: "light",
      },
    });

    return NextResponse.json({ success: true, user }, { status: 201 });
  } catch (error) {
    console.error("POST /api/auth/signup error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

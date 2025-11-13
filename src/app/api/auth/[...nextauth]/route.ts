// src/app/api/auth/[...nextauth]/route.ts
import { Auth } from "@auth/core";
import { authConfig } from "@/lib/authOptions";
import { NextRequest, NextResponse } from "next/server";

// ✅ Handle GET requests (session, csrf, providers, etc.)
export async function GET(req: NextRequest) {
  const res = await Auth(req, authConfig);
  return new NextResponse(res.body, {
    status: res.status,
    headers: res.headers,
  });
}

// ✅ Handle POST requests (signIn, signOut, callback, etc.)
export async function POST(req: NextRequest) {
  const res = await Auth(req, authConfig);
  return new NextResponse(res.body, {
    status: res.status,
    headers: res.headers,
  });
}

// ❌ No DELETE, PUT, or PATCH handlers are needed here

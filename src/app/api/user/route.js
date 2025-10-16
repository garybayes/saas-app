import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req) {
  const users = await prisma.user.findMany();
  return new Response(JSON.stringify(users), {
    headers: { "Content-Type": "application/json" },
  });
}

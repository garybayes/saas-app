import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function PATCH(req) {
  try {
    const { theme } = await req.json();

    // Supply a default email if the user record doesn't already exist
    const user = await prisma.user.upsert({
      where: { id: "user-001" },
      update: { theme },
      create: {
        id: "user-001",
        email: "user001@example.com", // ✅ required field
        theme,
      },
    });

    return new Response(JSON.stringify(user), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

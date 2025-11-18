import { prisma } from "@/lib/prisma";
import { User } from "@prisma/client";

export async function getUserStats(userId: string) {
  const [user, connections] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId } }),
    prisma.connection.count({ where: { userId } }),
  ]);
  return {
    email: user?.email ?? "",
    theme: user?.theme ?? "light",
    lastLogin: (user as User)?.lastLogin,
    connections,
  };
}

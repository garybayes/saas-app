// prisma/seed.ts
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding test data into PostgreSQL...");

  // Create a test user
  const user = await prisma.user.upsert({
    where: { email: "test@example.com" },
    update: {},
    create: {
      email: "test@example.com",
      password: "password123",
      displayName: "Test User",
      theme: "light",
    },
  });

  // Create connections
  await prisma.connection.createMany({
    data: [
      { userId: user.id, appName: "Slack", apiKey: "slack-test-key" },
      { userId: user.id, appName: "Notion", apiKey: "notion-test-key" },
    ],
    skipDuplicates: true,
  });

  // Create a demo workflow
//  await prisma.workflow.upsert({
//    where: { name_userId: { name: "Demo Workflow", userId: user.id } },
//    update: {},
//    create: {
//      userId: user.id,
//      name: "Demo Workflow",
//      data: { steps: ["connect", "process", "notify"] },
//    },
//  });

  console.log("✅ Seeding complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

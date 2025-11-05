/**
 * Sprint 5 Test Data Seeder (SQLite)
 * ------------------------------------
 * Populates the local database with test data
 * matching the current Prisma schema.
 *
 * Run with: npx prisma db seed
 */

import { PrismaClient } from "@prisma/client";
import crypto from "crypto";

const prisma = new PrismaClient();

function hashPassword(password: string) {
  return crypto.createHash("sha256").update(password).digest("hex");
}

async function main() {
  console.log("🌱 Seeding test data into SQLite...");

  // --- USER ---
  const user = await prisma.user.upsert({
    where: { email: "test@example.com" },
    update: {},
    create: {
      email: "test@example.com",
      password: hashPassword("password123"),
      displayName: "Test User",
      theme: "light",
    },
  });

  // --- CONNECTIONS ---
await prisma.connection.createMany({
  data: [
    {
      userId: user.id,
      appName: "Slack",
      apiKey: "demo-slack-key",
    },
    {
      userId: user.id,
      appName: "Notion",
      apiKey: "demo-notion-key",
    },
  ],
});

  // --- WORKFLOW ---
  await prisma.workflow.create({
    data: {
      userId: user.id,
      name: "Demo Workflow",
      data: {
        version: 1,
        nodes: [
          { id: "1", type: "input", label: "Start" },
          { id: "2", type: "process", label: "Send Slack message" },
        ],
        edges: [
          { id: "e1-2", source: "1", target: "2" },
        ],
      },
    },
  });

  console.log("✅ Seeding complete.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

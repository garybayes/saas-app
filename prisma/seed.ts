import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

// --- Inline AES-GCM Encryption (matches src/lib/crypto.ts) ---
const ENCRYPTION_KEY = Buffer.from(
  process.env.ENCRYPTION_KEY || "",
  "base64"
);

function encrypt(plaintext: string): string {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const cipher = crypto.createCipheriv("aes-256-gcm", ENCRYPTION_KEY, iv);

  const encrypted = Buffer.concat([
    cipher.update(plaintext, "utf8"),
    cipher.final(),
  ]);

  const tag = cipher.getAuthTag();

  return Buffer.from(
    Buffer.concat([iv, tag, encrypted])
  ).toString("base64");
}
// --------------------------------------------------------------

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding PostgreSQL test data...");

  const hashedPassword = await bcrypt.hash("password123", 10);

  // Create test user
  const user = await prisma.user.upsert({
    where: { email: "test@example.com" },
    update: {},
    create: {
      email: "test@example.com",
      password: hashedPassword,
      displayName: "Test User",
      theme: "light",
    },
  });

  // Create connections
  await prisma.connection.createMany({
    data: [
      {
        userId: user.id,
        appName: "Slack",
        apiKey: encrypt("slack-test-key"),
      },
      {
        userId: user.id,
        appName: "Notion",
        apiKey: encrypt("notion-test-key"),
      },
    ],
    skipDuplicates: true,
  });

  console.log("✅ Seed complete.");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

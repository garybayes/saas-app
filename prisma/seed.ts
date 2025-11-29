import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { webcrypto } from "crypto";   // correct import for Node WebCrypto

const crypto = webcrypto;
const prisma = new PrismaClient();

const ENCRYPTION_KEY_B64 = process.env.ENCRYPTION_KEY;
if (!ENCRYPTION_KEY_B64) {
  throw new Error("ENCRYPTION_KEY missing in environment");
}
const ENCRYPTION_KEY = Buffer.from(ENCRYPTION_KEY_B64, "base64");

// Convert raw key into a CryptoKey
async function getCryptoKey() {
  return crypto.subtle.importKey(
    "raw",
    ENCRYPTION_KEY,
    "AES-GCM",
    false,
    ["encrypt"]
  );
}

// Local AES-GCM encrypt function (keep this, remove import)
async function encryptValue(plaintext: string): Promise<string> {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await getCryptoKey();

  const encoded = new TextEncoder().encode(plaintext);

  const ciphertext = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    encoded
  );

  const encryptedBytes = Buffer.from(ciphertext);
  const result = Buffer.concat([Buffer.from(iv), encryptedBytes]);

  return result.toString("base64");
}

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

  // Create demo connections
  await prisma.connection.createMany({
    data: [
      {
        userId: user.id,
        appName: "Slack",
        apiKey: await encryptValue("slack-test-key"),
      },
      {
        userId: user.id,
        appName: "Notion",
        apiKey: await encryptValue("notion-test-key"),
      }
    ],
    skipDuplicates: true,
  });

  console.log("✅ Seeding complete.");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

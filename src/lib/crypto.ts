import crypto from "crypto";

const ALGORITHM = "aes-256-cbc";
const IV_LENGTH = 16;
const keyBase64 = process.env.ENCRYPTION_KEY;

if (!keyBase64) {
  throw new Error('ENCRYPTION_KEY is missing from environment variables.');
}

const key = Buffer.from(process.env.ENCRYPTION_KEY || "", "base64");
if (key.length !== 32) {
  throw new Error("ENCRYPTION_KEY must be exactly 32 characters long.");
}

export function encrypt(text: string): string {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  const encrypted = Buffer.concat([cipher.update(text, "utf8"), cipher.final()]);
  return iv.toString("hex") + ":" + encrypted.toString("hex");
}

export function decrypt(encryptedText: string): string {
  if (!encryptedText) return ""; // ✅ Skip null/undefined gracefully

  try {
    const [ivHex, encryptedHex] = encryptedText.split(":");
    const iv = Buffer.from(ivHex, "hex");
    const encrypted = Buffer.from(encryptedHex, "hex");
    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
    return decrypted.toString("utf8");
  } catch (error) {
    console.error("Error decrypting API key:", error);
    return ""; // ✅ Fallback: don’t break API responses
  }
}
import bcrypt from "bcryptjs";

// Securely hash user passwords
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

// Verify a plain password against a stored hash
export async function verifyPassword(password: string, hashed: string): Promise<boolean> {
  return bcrypt.compare(password, hashed);
}

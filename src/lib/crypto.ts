import crypto from "crypto";

const ALGORITHM = "aes-256-cbc";
const key = Buffer.from(process.env.ENCRYPTION_KEY || "", "utf-8");

if (key.length !== 32) {
  throw new Error("ENCRYPTION_KEY must be exactly 32 characters long.");
}

export function encrypt(text: string): string {
  if (!text) return "";
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  const encrypted = Buffer.concat([cipher.update(text, "utf8"), cipher.final()]);
  return iv.toString("hex") + ":" + encrypted.toString("hex");
}

export function decrypt(encryptedText: string): string {
  if (!encryptedText) return "";

  // NEW: handle legacy plain strings (no IV prefix)
  if (!encryptedText.includes(":")) {
    return encryptedText;
  }

  const [ivHex, encryptedHex] = encryptedText.split(":");
  const iv = Buffer.from(ivHex, "hex");
  const encrypted = Buffer.from(encryptedHex, "hex");

  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
  return decrypted.toString("utf8");
}

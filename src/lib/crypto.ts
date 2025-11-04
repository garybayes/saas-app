import crypto from "crypto";

const ALGORITHM = "aes-256-cbc";
const IV_LENGTH = 16;

const key = Buffer.from(process.env.ENCRYPTION_KEY || "", "utf-8");
if (key.length !== 32) {
  throw new Error("ENCRYPTION_KEY must be exactly 32 characters long.");
}

export function encrypt(text: string): string {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, new Uint8Array(key), new Uint8Array(iv));
  const encrypted = Buffer.concat([new Uint8Array(cipher.update(text, "utf8")), new Uint8Array(cipher.final())]);
  return iv.toString("hex") + ":" + encrypted.toString("hex");
}

export function decrypt(encryptedText: string): string {
  const [ivHex, encryptedHex] = encryptedText.split(":");
  const iv = Buffer.from(ivHex, "hex");
  const encrypted = Buffer.from(encryptedHex, "hex");
  const decipher = crypto.createDecipheriv(ALGORITHM, new Uint8Array(key), new Uint8Array(iv));
  const decrypted = Buffer.concat([new Uint8Array(decipher.update(encrypted)), new Uint8Array(decipher.final())]);
  return decrypted.toString("utf8");
}

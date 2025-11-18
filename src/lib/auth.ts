// src/lib/auth.ts
// Temporary simple auth layer (to be replaced in Sprint 3 with real login)

export async function getUserId(): Promise<string> {
  // In future: extract from session or JWT
  return "user-001";
}

// Optional helper for API routes
export async function requireUser(): Promise<{ id: string }> {
  const id = await getUserId();
  if (!id) throw new Error("User not authenticated");
  return { id };
}

"use client";

export default function CheckClient() {
  console.log("✅ CheckClient running on:", typeof window !== "undefined" ? "client" : "server");
  return (
    <div className="text-xs text-center text-muted">
      CheckClient: {typeof window !== "undefined" ? "client" : "server"}
    </div>
  );
}

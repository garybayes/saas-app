"use client";

import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Session } from "next-auth";

export default function ProfileForm({ user }: { user: Session["user"] }) {
  const [displayName, setDisplayName] = useState(user.displayName || "");
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/settings/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ displayName }),
      });
      if (res.ok) {
        toast({ title: "Success", description: "Profile updated successfully" });
      } else {
        toast({ title: "Error", description: "Failed to update profile" });
      }
    } catch (error) {
      console.error("Profile update error:", error);
      toast({ title: "Error", description: "An error occurred while updating your profile." });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card p-4">
      <h2 className="text-lg font-medium mb-2">Edit Profile</h2>
      <div className="flex gap-4">
        <input
          type="text"
          placeholder="Display Name"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          required
          className="input"
        />
        <button type="submit" className="btn-primary">
          Save
        </button>
      </div>
    </form>
  );
}

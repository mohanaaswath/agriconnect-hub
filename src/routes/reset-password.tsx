import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { BUSINESS } from "@/lib/constants";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "Reset password — Dhandapani Farms" },
      { name: "description", content: "Set a new password for your account." },
    ],
  }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      toast.success("Password updated! You're signed in.");
      navigate({ to: "/" });
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md glass rounded-2xl p-8">
        <div className="text-center mb-6">
          <div className="text-xs uppercase tracking-widest text-gold">{BUSINESS.name}</div>
          <h1 className="mt-2 font-display text-3xl font-bold">Set new password</h1>
        </div>
        <form onSubmit={submit} className="space-y-3">
          <input
            type="password"
            placeholder="New password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 bg-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            required
            minLength={6}
          />
          <button
            disabled={loading}
            className="w-full py-3 rounded-md bg-gradient-to-r from-primary to-[oklch(0.55_0.16_150)] text-primary-foreground font-medium shadow-glow disabled:opacity-50"
          >
            {loading ? "Please wait…" : "Update password"}
          </button>
        </form>
      </div>
    </div>
  );
}

import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { BUSINESS } from "@/lib/constants";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in or create an account — Dhandapani Farms" },
      {
        name: "description",
        content:
          "Sign in to your Dhandapani Farms account or create a new one to buy produce, livestock and agricultural real estate in Tamil Nadu.",
      },
      { property: "og:title", content: "Sign in or create an account — Dhandapani Farms" },
      {
        property: "og:description",
        content: "Access your Dhandapani Farms account to shop the marketplace.",
      },
      { property: "og:url", content: "https://farm-first-connect.lovable.app/auth" },
      { name: "robots", content: "noindex, follow" },
    ],
    links: [{ rel: "canonical", href: "https://farm-first-connect.lovable.app/auth" }],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup" | "forgot">("signin");
  const [f, setF] = useState({ email: "", password: "", name: "" });
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email: f.email,
          password: f.password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
            data: { full_name: f.name },
          },
        });
        if (error) throw error;
        toast.success("Account created! You're signed in.");
        navigate({ to: "/" });
      } else if (mode === "forgot") {
        const { error } = await supabase.auth.resetPasswordForEmail(f.email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) throw error;
        toast.success("Password reset link sent! Check your email.");
        setMode("signin");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: f.email,
          password: f.password,
        });
        if (error) throw error;
        toast.success("Welcome back!");
        navigate({ to: "/" });
      }
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  const title =
    mode === "signin" ? "Welcome back" : mode === "signup" ? "Create account" : "Reset password";

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md glass rounded-2xl p-8">
        <div className="text-center mb-6">
          <div className="text-xs uppercase tracking-widest text-gold">{BUSINESS.name}</div>
          <h1 className="mt-2 font-display text-3xl font-bold">{title}</h1>
          {mode === "forgot" && (
            <p className="mt-2 text-sm text-muted-foreground">
              Enter your email and we'll send you a reset link.
            </p>
          )}
        </div>
        <form onSubmit={submit} className="space-y-3">
          {mode === "signup" && (
            <input
              placeholder="Full name"
              value={f.name}
              onChange={(e) => setF({ ...f, name: e.target.value })}
              className="w-full px-4 py-3 bg-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={f.email}
            onChange={(e) => setF({ ...f, email: e.target.value })}
            className="w-full px-4 py-3 bg-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
          {mode !== "forgot" && (
            <input
              type="password"
              placeholder="Password"
              value={f.password}
              onChange={(e) => setF({ ...f, password: e.target.value })}
              className="w-full px-4 py-3 bg-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              required
              minLength={6}
            />
          )}
          {mode === "signin" && (
            <div className="text-right">
              <button
                type="button"
                onClick={() => setMode("forgot")}
                className="text-xs text-gold hover:underline"
              >
                Forgot password?
              </button>
            </div>
          )}
          <button
            disabled={loading}
            className="w-full py-3 rounded-md bg-gradient-to-r from-primary to-[color:var(--dark-gold)] text-primary-foreground font-medium shadow-glow disabled:opacity-50"
          >
            {loading
              ? "Please wait…"
              : mode === "signin"
                ? "Sign in"
                : mode === "signup"
                  ? "Create account"
                  : "Send reset link"}
          </button>
        </form>
        <div className="mt-5 text-center text-sm text-muted-foreground">
          {mode === "forgot" ? (
            <button onClick={() => setMode("signin")} className="text-gold hover:underline">
              Back to sign in
            </button>
          ) : (
            <>
              {mode === "signin" ? "New here?" : "Already have an account?"}{" "}
              <button
                onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
                className="text-gold hover:underline"
              >
                {mode === "signin" ? "Create an account" : "Sign in"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

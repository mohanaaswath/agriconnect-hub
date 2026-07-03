import { useState } from "react";
import { MessageCircle, Star, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

const feedbackSchema = z.object({
  name: z.string().trim().min(1, "Please enter your name").max(100),
  email: z
    .string()
    .trim()
    .max(255)
    .email("Invalid email")
    .optional()
    .or(z.literal("")),
  role: z.string().trim().max(100).optional().or(z.literal("")),
  rating: z.number().int().min(1).max(5),
  message: z.string().trim().min(3, "Please write a short message").max(2000),
});

export function FeedbackFab({ variant = "fab" }: { variant?: "fab" | "footer" }) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(0);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const reset = () => {
    setName("");
    setEmail("");
    setRole("");
    setRating(5);
    setMessage("");
    setHover(0);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = feedbackSchema.safeParse({
      name: name || user?.user_metadata?.full_name || user?.email || "",
      email: email || user?.email || "",
      role: role || "",
      rating,
      message,
    });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("feedback").insert({
      name: parsed.data.name,
      email: parsed.data.email ? parsed.data.email : null,
      role: parsed.data.role ? parsed.data.role : null,
      rating: parsed.data.rating,
      message: parsed.data.message,
      user_id: user?.id ?? null,
    });
    setSubmitting(false);
    if (error) {
      toast.error("Could not send feedback. Please try again.");
      return;
    }
    toast.success("Thank you for your feedback!");
    reset();
    setOpen(false);
  };

  return (
    <>
      {variant === "fab" ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Send feedback"
          className="fixed bottom-28 right-6 z-30 h-14 w-14 rounded-full bg-gold text-background shadow-glow flex items-center justify-center hover:scale-105 transition"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-gold transition"
        >
          <MessageCircle className="w-4 h-4" />
          Send feedback
        </button>
      )}

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-md glass rounded-2xl p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close"
              className="absolute top-3 right-3 p-2 rounded-md hover:bg-white/5"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="text-xs uppercase tracking-widest text-gold">Feedback</div>
            <h2 className="mt-1 font-display text-2xl font-bold">Share your thoughts</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              We'd love to hear from you — your feedback helps us improve.
            </p>

            <form onSubmit={submit} className="mt-5 space-y-4">
              <div>
                <label className="text-xs text-muted-foreground">Your name</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={100}
                  required
                  placeholder={user?.user_metadata?.full_name || user?.email || "Your name"}
                  className="mt-1 w-full rounded-md bg-background/60 border border-border px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Email (optional)</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  maxLength={255}
                  placeholder={user?.email || "you@example.com"}
                  className="mt-1 w-full rounded-md bg-background/60 border border-border px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Rating</label>
                <div className="mt-1 flex gap-1">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setRating(n)}
                      onMouseEnter={() => setHover(n)}
                      onMouseLeave={() => setHover(0)}
                      aria-label={`${n} star${n > 1 ? "s" : ""}`}
                      className="p-1"
                    >
                      <Star
                        className={`w-6 h-6 transition ${
                          n <= (hover || rating)
                            ? "fill-gold text-gold"
                            : "text-muted-foreground"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Your feedback</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  maxLength={2000}
                  required
                  rows={4}
                  placeholder="Tell us what you love or how we can improve..."
                  className="mt-1 w-full rounded-md bg-background/60 border border-border px-3 py-2 text-sm resize-none"
                />
                <div className="mt-1 text-right text-xs text-muted-foreground">
                  {message.length}/2000
                </div>
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-md bg-gold text-background px-4 py-2.5 text-sm font-semibold hover:opacity-90 disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                Send feedback
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

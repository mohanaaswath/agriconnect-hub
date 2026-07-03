import { Star, Trash2 } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Loader } from "@/components/Loader";
import { FeedbackFab } from "@/components/FeedbackFab";
import { useAuth } from "@/hooks/use-auth";
import type { Database } from "@/integrations/supabase/types";

type FeedbackRow = Database["public"]["Tables"]["feedback"]["Row"];

export function Testimonials() {
  const { isAdmin } = useAuth();
  const queryClient = useQueryClient();
  const { data: items, isLoading } = useQuery({
    queryKey: ["customer-feedback"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("feedback")
        .select("id, name, role, rating, message, created_at")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as FeedbackRow[];
    },
  });

  const deleteFeedback = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("feedback").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Feedback deleted");
      queryClient.invalidateQueries({ queryKey: ["customer-feedback"] });
    },
    onError: () => toast.error("Only admins can delete feedback"),
  });

  const handleDelete = (feedback: FeedbackRow) => {
    if (!isAdmin || deleteFeedback.isPending) return;
    const ok = window.confirm(`Delete feedback from ${feedback.name}?`);
    if (ok) deleteFeedback.mutate(feedback.id);
  };

  return (
    <section className="py-20 bg-[oklch(0.14_0.012_150)] border-y border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <div className="text-xs uppercase tracking-widest text-gold">Voices from the field</div>
          <h2 className="mt-2 font-display text-3xl sm:text-4xl font-bold">
            Trusted by buyers across Tamil Nadu
          </h2>
          <div className="mt-6">
            <FeedbackFab variant="section" />
          </div>
        </div>

        {isLoading ? (
          <Loader />
        ) : !items?.length ? (
          <p className="text-center text-sm text-muted-foreground">
            No testimonials yet. Be the first to share your experience!
          </p>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {items.map((t) => (
              <div key={t.id} className="glass rounded-2xl p-6">
                <div className="mb-3 flex items-start justify-between gap-3">
                  <div className="flex gap-0.5 text-gold">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < (t.rating ?? 0) ? "fill-current" : "text-muted-foreground"}`}
                      />
                    ))}
                  </div>
                  {isAdmin ? (
                    <button
                      type="button"
                      onClick={() => handleDelete(t)}
                      disabled={deleteFeedback.isPending}
                      aria-label={`Delete feedback from ${t.name}`}
                      className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-destructive transition hover:bg-destructive/10 disabled:opacity-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  ) : null}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">"{t.message}"</p>
                <div className="mt-5">
                  <div className="font-semibold text-sm">{t.name}</div>
                  {t.role ? <div className="text-xs text-muted-foreground">{t.role}</div> : null}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

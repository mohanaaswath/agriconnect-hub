import { Star } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader } from "@/components/Loader";
import type { Database } from "@/integrations/supabase/types";

type FeedbackRow = Database["public"]["Tables"]["feedback"]["Row"];

export function Testimonials() {
  const { data: items, isLoading } = useQuery({
    queryKey: ["approved-testimonials"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("feedback")
        .select("id, name, role, rating, message, created_at")
        .eq("approved", true)
        .order("created_at", { ascending: false })
        .limit(6);
      if (error) throw error;
      return (data ?? []) as FeedbackRow[];
    },
  });

  return (
    <section className="py-20 bg-[oklch(0.14_0.012_150)] border-y border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <div className="text-xs uppercase tracking-widest text-gold">Voices from the field</div>
          <h2 className="mt-2 font-display text-3xl sm:text-4xl font-bold">
            Trusted by buyers across Tamil Nadu
          </h2>
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
                <div className="flex gap-0.5 text-gold mb-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < (t.rating ?? 0) ? "fill-current" : "text-muted-foreground"}`}
                    />
                  ))}
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

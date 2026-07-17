import { Star } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader } from "@/components/Loader";
import { FeedbackFab } from "@/components/FeedbackFab";
import type { Database } from "@/integrations/supabase/types";

type FeedbackRow = Database["public"]["Tables"]["feedback"]["Row"];

export function Testimonials() {
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




  return (
    <section className="py-20 bg-secondary border-y border-border">
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

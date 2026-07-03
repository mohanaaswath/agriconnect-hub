import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { LivestockCard } from "@/components/LivestockCard";
import { Loader } from "@/components/Loader";
import { LIVESTOCK_CATEGORIES } from "@/lib/constants";
import type { Livestock } from "@/lib/types";
import { AddButton } from "@/components/admin/AdminControls";

export const Route = createFileRoute("/livestock")({
  head: () => ({
    meta: [
      { title: "Livestock — Dhandapani Farms" },
      {
        name: "description",
        content: "Native breed cows, goats and more — verified livestock from Tamil Nadu farms.",
      },
    ],
  }),
  component: LivestockPage,
});

function LivestockPage() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");

  const { data, isLoading } = useQuery({
    queryKey: ["livestock"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("livestock")
        .select(
          "id, livestock_code, name, description, price, category, breed, age, weight, milk_yield, health, vaccination, location, seller_rating, seller_verified, images, featured, created_at",
        )
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Livestock[];
    },
  });

  const filtered = useMemo(() => {
    const list = data ?? [];
    return list.filter((l) => {
      const matchCat = cat === "All" || l.category === cat;
      const term = q.trim().toLowerCase();
      const matchQ =
        !term ||
        [l.name, l.breed, l.category, l.description, l.location]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(term);
      return matchCat && matchQ;
    });
  }, [data, q, cat]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <div className="text-center mb-10">
        <div className="text-xs uppercase tracking-widest text-gold">Marketplace</div>
        <h1 className="mt-2 font-display text-4xl sm:text-5xl font-bold">Native livestock</h1>
        <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
          Verified, vaccinated, and farm-raised. Gir, Kangayam, native goats and more.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by breed, location…"
            className="w-full pl-10 pr-3 py-2.5 bg-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto">
          {LIVESTOCK_CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`px-3 py-2 rounded-md text-xs font-medium whitespace-nowrap border ${cat === c ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:bg-accent"}`}
            >
              {c}
            </button>
          ))}
        </div>
        <AddButton kind="livestock" label="+ Add Livestock" />
      </div>

      {isLoading ? (
        <Loader />
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          No livestock match your search.
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((l) => (
            <LivestockCard key={l.id} item={l} />
          ))}
        </div>
      )}
    </div>
  );
}

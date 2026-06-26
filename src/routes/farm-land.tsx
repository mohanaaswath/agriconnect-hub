import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { RealEstateCard } from "@/components/RealEstateCard";
import { Loader } from "@/components/Loader";
import type { RealEstate } from "@/lib/types";

export const Route = createFileRoute("/farm-land")({
  head: () => ({
    meta: [
      { title: "Farm Land — Dhandapani Farms" },
      { name: "description", content: "Verified agricultural land and farm estates for sale across Tamil Nadu." },
    ],
  }),
  component: FarmLandPage,
});

function FarmLandPage() {
  const [q, setQ] = useState("");
  const [max, setMax] = useState(0);

  const { data, isLoading } = useQuery({
    queryKey: ["real-estate"],
    queryFn: async () => {
      const { data, error } = await supabase.from("real_estate").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as RealEstate[];
    },
  });

  const filtered = useMemo(() => {
    const list = data ?? [];
    return list.filter((r) => {
      const term = q.trim().toLowerCase();
      const matchQ = !term || [r.name, r.location, r.description].filter(Boolean).join(" ").toLowerCase().includes(term);
      const matchPrice = max === 0 || r.price <= max;
      return matchQ && matchPrice;
    });
  }, [data, q, max]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <div className="text-center mb-10">
        <div className="text-xs uppercase tracking-widest text-gold">Real Estate</div>
        <h1 className="mt-2 font-display text-4xl sm:text-5xl font-bold">Farm land & estates</h1>
        <p className="mt-3 text-muted-foreground max-w-xl mx-auto">Verified agricultural properties, ready for the next chapter.</p>
      </div>
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by location, name…"
            className="w-full pl-10 pr-3 py-2.5 bg-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>
        <select value={max} onChange={(e) => setMax(Number(e.target.value))}
          className="px-3 py-2.5 bg-input rounded-md text-sm">
          <option value={0}>Any price</option>
          <option value={10000000}>Under ₹1 Cr</option>
          <option value={30000000}>Under ₹3 Cr</option>
          <option value={50000000}>Under ₹5 Cr</option>
          <option value={100000000}>Under ₹10 Cr</option>
        </select>
      </div>

      {isLoading ? <Loader /> : filtered.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">No properties match your search.</div>
      ) : (
        <div className="grid md:grid-cols-2 gap-5">
          {filtered.map((r) => <RealEstateCard key={r.id} item={r} />)}
        </div>
      )}
    </div>
  );
}

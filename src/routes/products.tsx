import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { ProductCard } from "@/components/ProductCard";
import { Loader } from "@/components/Loader";
import { PRODUCT_CATEGORIES } from "@/lib/constants";
import type { Product } from "@/lib/types";
import { AddButton } from "@/components/admin/AdminControls";

export const Route = createFileRoute("/products")({
  head: () => ({
    meta: [
      { title: "Products — Dhandapani Farms" },
      { name: "description", content: "Fresh agriculture produce: grains, fruits, vegetables, seeds and trees direct from Tamil Nadu farms." },
    ],
  }),
  component: ProductsPage,
});

function ProductsPage() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");

  const { data, isLoading, error } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data, error } = await supabase.from("products").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Product[];
    },
  });

  const filtered = useMemo(() => {
    const list = data ?? [];
    return list.filter((p) => {
      const matchCat = cat === "All" || p.category === cat;
      const term = q.trim().toLowerCase();
      const matchQ = !term || [p.name, p.description, p.category].filter(Boolean).join(" ").toLowerCase().includes(term);
      return matchCat && matchQ;
    });
  }, [data, q, cat]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <div className="text-center mb-10">
        <div className="text-xs uppercase tracking-widest text-gold">Marketplace</div>
        <h1 className="mt-2 font-display text-4xl sm:text-5xl font-bold">Fresh produce</h1>
        <p className="mt-3 text-muted-foreground max-w-xl mx-auto">Browse seasonal harvests, organic staples and farm essentials.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search produce…"
            className="w-full pl-10 pr-3 py-2.5 bg-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {PRODUCT_CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`px-3 py-2 rounded-md text-xs font-medium whitespace-nowrap border ${cat === c ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:bg-accent"}`}
            >
              {c}
            </button>
          ))}
        </div>
        <AddButton kind="product" label="+ Add Product" />
      </div>

      {isLoading ? <Loader /> : error ? (
        <div className="text-center py-20 text-destructive">Failed to load products.</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">No products match your search.</div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  );
}

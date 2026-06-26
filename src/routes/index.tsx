import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Hero } from "@/components/Hero";
import { GateOpening } from "@/components/GateOpening";
import { About } from "@/components/About";
import { Statistics } from "@/components/Statistics";
import { Testimonials } from "@/components/Testimonials";
import { ProductCard } from "@/components/ProductCard";
import { LivestockCard } from "@/components/LivestockCard";
import { RealEstateCard } from "@/components/RealEstateCard";
import type { Product, Livestock, RealEstate } from "@/lib/types";
import { Loader } from "@/components/Loader";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dhandapani Farms — Premium Agriculture Marketplace" },
      { name: "description", content: "Shop fresh produce, native livestock and fertile farm land from Tamil Nadu's trusted family-run farm." },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const products = useQuery({
    queryKey: ["featured-products"],
    queryFn: async () => {
      const { data, error } = await supabase.from("products").select("*").eq("featured", true).limit(6);
      if (error) throw error;
      return (data ?? []) as Product[];
    },
  });
  const livestock = useQuery({
    queryKey: ["featured-livestock"],
    queryFn: async () => {
      const { data, error } = await supabase.from("livestock").select("*").eq("featured", true).limit(3);
      if (error) throw error;
      return (data ?? []) as Livestock[];
    },
  });
  const realEstate = useQuery({
    queryKey: ["featured-real-estate"],
    queryFn: async () => {
      const { data, error } = await supabase.from("real_estate").select("*").eq("featured", true).limit(2);
      if (error) throw error;
      return (data ?? []) as RealEstate[];
    },
  });

  return (
    <>
      <Hero />
      <About />
      <Statistics />

      <Section title="Featured produce" eyebrow="From our farm" link="/products">
        {products.isLoading ? <Loader /> : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {products.data?.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </Section>

      <Section title="Featured livestock" eyebrow="Native breeds" link="/livestock">
        {livestock.isLoading ? <Loader /> : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {livestock.data?.map((l) => <LivestockCard key={l.id} item={l} />)}
          </div>
        )}
      </Section>

      <Section title="Featured farm land" eyebrow="Verified properties" link="/farm-land">
        {realEstate.isLoading ? <Loader /> : (
          <div className="grid md:grid-cols-2 gap-5">
            {realEstate.data?.map((r) => <RealEstateCard key={r.id} item={r} />)}
          </div>
        )}
      </Section>

      <Testimonials />
    </>
  );
}

function Section({ title, eyebrow, link, children }: { title: string; eyebrow: string; link: string; children: React.ReactNode }) {
  return (
    <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6">
      <div className="flex items-end justify-between mb-10">
        <div>
          <div className="text-xs uppercase tracking-widest text-gold">{eyebrow}</div>
          <h2 className="mt-2 font-display text-3xl sm:text-4xl font-bold">{title}</h2>
        </div>
        <Link to={link} className="hidden sm:inline-block text-sm text-muted-foreground hover:text-gold">
          View all →
        </Link>
      </div>
      {children}
    </section>
  );
}

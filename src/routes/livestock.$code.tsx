import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle2, MapPin, Phone } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { Livestock } from "@/lib/types";
import { Loader } from "@/components/Loader";
import { livestockInquiry } from "@/lib/whatsapp";

export const Route = createFileRoute("/livestock/$code")({
  component: LivestockDetail,
});

function LivestockDetail() {
  const { code } = Route.useParams();
  const { data, isLoading } = useQuery({
    queryKey: ["livestock", code],
    queryFn: async () => {
      const { data, error } = await supabase.from("livestock").select("*").eq("livestock_code", code).maybeSingle();
      if (error) throw error;
      return data as Livestock | null;
    },
  });
  if (isLoading) return <Loader />;
  if (!data) return (
    <div className="text-center py-32"><p className="text-muted-foreground">Listing not found.</p>
      <Link to="/livestock" className="mt-4 inline-block text-gold">← All livestock</Link></div>
  );

  const detailRows = [
    ["Breed", data.breed], ["Age", data.age], ["Weight", data.weight],
    ["Milk Yield", data.milk_yield], ["Health", data.health], ["Vaccination", data.vaccination],
  ].filter(([, v]) => !!v);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 grid md:grid-cols-2 gap-10">
      <div className="aspect-square rounded-2xl overflow-hidden glass">
        {data.images?.[0] && <img src={data.images[0]} alt={data.name} className="w-full h-full object-cover" />}
      </div>
      <div>
        <div className="text-xs uppercase tracking-widest text-gold">{data.category}</div>
        <h1 className="mt-2 font-display text-4xl font-bold">{data.name}</h1>
        <div className="mt-2 flex items-center gap-3 text-sm text-muted-foreground">
          <MapPin className="w-4 h-4" /> {data.location}
        </div>
        <p className="mt-5 text-muted-foreground leading-relaxed">{data.description}</p>
        <div className="mt-6 font-display text-4xl font-bold gold-text">₹{data.price.toLocaleString("en-IN")}</div>

        <dl className="mt-6 grid grid-cols-2 gap-4">
          {detailRows.map(([k, v]) => (
            <div key={k} className="glass rounded-lg p-3">
              <dt className="text-[10px] uppercase tracking-wider text-muted-foreground">{k}</dt>
              <dd className="mt-0.5 text-sm font-medium">{v}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-6 glass rounded-xl p-4">
          <div className="text-xs uppercase tracking-widest text-gold">Seller</div>
          <div className="mt-1 font-semibold flex items-center gap-2">
            {data.seller_name}
            {data.seller_verified && <CheckCircle2 className="w-4 h-4 text-success" />}
          </div>
          <div className="text-sm text-muted-foreground">{data.seller_phone}</div>
        </div>

        <a href={livestockInquiry(data.name, data.livestock_code)} target="_blank" rel="noreferrer"
          className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-primary to-[oklch(0.55_0.16_150)] text-primary-foreground font-medium shadow-glow">
          <Phone className="w-4 h-4" /> Inquire on WhatsApp
        </a>
        <div className="mt-6 text-xs text-muted-foreground">Code: <span className="text-foreground">{data.livestock_code}</span></div>
      </div>
    </div>
  );
}

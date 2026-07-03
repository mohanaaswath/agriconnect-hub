import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import {
  BadgeCheck,
  Droplets,
  Layers,
  MapPin,
  Maximize,
  Phone,
  type LucideIcon,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { RealEstate } from "@/lib/types";
import { Loader } from "@/components/Loader";
import { propertyInquiry } from "@/lib/whatsapp";

const BASE_URL = "https://farm-first-connect.lovable.app";
const REAL_ESTATE_COLUMNS =
  "id, property_code, name, description, price, size, price_per_acre, location, water_source, soil_type, suitable_for, amenities, images, featured, verified, owner_rating, created_at";

export const Route = createFileRoute("/real-estate/$code")({
  loader: async ({ params }) => {
    const { data, error } = await supabase
      .from("real_estate")
      .select(REAL_ESTATE_COLUMNS)
      .eq("property_code", params.code)
      .maybeSingle();
    if (error) throw error;
    return (data as RealEstate | null) ?? null;
  },
  head: ({ params, loaderData }) => {
    const item = loaderData;
    const url = `${BASE_URL}/real-estate/${params.code}`;
    const title = item
      ? `${item.name} — Dhandapani Farms`.slice(0, 60)
      : "Property — Dhandapani Farms";
    const rawDesc =
      item?.description ||
      `${item?.name ?? "Agricultural land"} in ${item?.location ?? "Tamil Nadu"} — verified listing on Dhandapani Farms.`;
    const description = rawDesc.length < 60 ? `${rawDesc} Verified agricultural real estate in Tamil Nadu.` : rawDesc;
    const image = item?.images?.[0];
    const meta = [
      { title },
      { name: "description", content: description.slice(0, 160) },
      { property: "og:title", content: title },
      { property: "og:description", content: description.slice(0, 160) },
      { property: "og:type", content: "product" },
      { property: "og:url", content: url },
    ];
    if (image) {
      meta.push({ property: "og:image", content: image });
      meta.push({ name: "twitter:image", content: image });
    }
    const scripts = item
      ? [
          {
            type: "application/ld+json",
            children: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Product",
              name: item.name,
              description: item.description ?? undefined,
              sku: item.property_code,
              image: image ?? undefined,
              category: "Agricultural Land",
              brand: { "@type": "Brand", name: "Dhandapani Farms" },
              offers: {
                "@type": "Offer",
                priceCurrency: "INR",
                price: item.price,
                availability: "https://schema.org/InStock",
                url,
              },
            }),
          },
        ]
      : undefined;
    return { meta, links: [{ rel: "canonical", href: url }], scripts };
  },
  component: RealEstateDetail,
  errorComponent: RealEstateError,
  notFoundComponent: RealEstateNotFound,
  pendingComponent: () => <Loader />,
});

function RealEstateNotFound() {
  return (
    <div className="text-center py-32">
      <p className="text-muted-foreground">Property not found.</p>
      <Link to="/real-estate" className="mt-4 inline-block text-gold">
        ← All properties
      </Link>
    </div>
  );
}

function RealEstateError({ reset }: { error: Error; reset: () => void }) {
  const router = useRouter();
  return (
    <div className="text-center py-32">
      <p className="text-muted-foreground">Couldn't load this property.</p>
      <button
        onClick={() => {
          router.invalidate();
          reset();
        }}
        className="mt-4 inline-block text-gold"
      >
        Try again
      </button>
    </div>
  );
}

function RealEstateDetail() {
  const data = Route.useLoaderData();
  if (!data) return <RealEstateNotFound />;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      <div className="aspect-[16/9] rounded-2xl overflow-hidden glass mb-8">
        {data.images?.[0] && (
          <img src={data.images[0]} alt={data.name} className="w-full h-full object-cover" />
        )}
      </div>
      <div className="grid md:grid-cols-3 gap-10">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2">
            {data.verified && (
              <span className="px-2 py-0.5 rounded-full bg-gold text-gold-foreground text-[10px] font-bold uppercase flex items-center gap-1">
                <BadgeCheck className="w-3 h-3" /> Verified
              </span>
            )}
            <span className="text-xs uppercase tracking-widest text-muted-foreground">
              {data.property_code}
            </span>
          </div>
          <h1 className="mt-2 font-display text-4xl font-bold">{data.name}</h1>
          <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="w-4 h-4" /> {data.location}
          </div>
          <p className="mt-5 text-muted-foreground leading-relaxed">{data.description}</p>

          <div className="mt-8 grid sm:grid-cols-3 gap-4">
            <Stat icon={Maximize} label="Size" value={data.size} />
            <Stat icon={Droplets} label="Water" value={data.water_source} />
            <Stat icon={Layers} label="Soil" value={data.soil_type} />
          </div>

          {data.suitable_for && data.suitable_for.length > 0 && (
            <div className="mt-8">
              <div className="text-xs uppercase tracking-widest text-gold mb-2">Suitable for</div>
              <div className="flex flex-wrap gap-2">
                {data.suitable_for.map((s) => (
                  <span key={s} className="px-3 py-1 rounded-full bg-accent text-sm">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}
          {data.amenities && data.amenities.length > 0 && (
            <div className="mt-6">
              <div className="text-xs uppercase tracking-widest text-gold mb-2">Amenities</div>
              <div className="flex flex-wrap gap-2">
                {data.amenities.map((s) => (
                  <span key={s} className="px-3 py-1 rounded-full bg-accent text-sm">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div>
          <div className="glass rounded-2xl p-6 sticky top-24">
            <div className="font-display text-3xl font-bold gold-text">
              ₹{(data.price / 100000).toFixed(1)}L
            </div>
            {data.price_per_acre && (
              <div className="text-sm text-muted-foreground">
                ₹{(data.price_per_acre / 100000).toFixed(2)}L / acre
              </div>
            )}
            <div className="my-5 h-px bg-border" />
            <div className="text-xs uppercase tracking-widest text-gold">Owner</div>
            <div className="mt-1 font-semibold">
              {data.verified ? "Verified owner" : "Listed owner"}
            </div>
            <div className="text-sm text-muted-foreground">Contact via WhatsApp inquiry below.</div>
            <a
              href={propertyInquiry(data.name, data.property_code)}
              target="_blank"
              rel="noreferrer"
              className="mt-5 w-full inline-flex justify-center items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-primary to-[oklch(0.55_0.16_150)] text-primary-foreground font-medium shadow-glow"
            >
              <Phone className="w-4 h-4" /> Inquire on WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string | null;
}) {
  return (
    <div className="glass rounded-xl p-4">
      <Icon className="w-4 h-4 text-gold" />
      <div className="mt-1 text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="text-sm font-semibold mt-0.5">{value || "—"}</div>
    </div>
  );
}

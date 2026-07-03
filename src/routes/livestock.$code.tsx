import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { CheckCircle2, MapPin, Phone } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { Livestock } from "@/lib/types";
import { Loader } from "@/components/Loader";
import { livestockInquiry } from "@/lib/whatsapp";

const BASE_URL = "https://farm-first-connect.lovable.app";
const LIVESTOCK_COLUMNS =
  "id, livestock_code, name, description, price, category, breed, age, weight, milk_yield, health, vaccination, location, seller_rating, seller_verified, images, featured, created_at";

export const Route = createFileRoute("/livestock/$code")({
  loader: async ({ params }) => {
    const { data, error } = await supabase
      .from("livestock")
      .select(LIVESTOCK_COLUMNS)
      .eq("livestock_code", params.code)
      .maybeSingle();
    if (error) throw error;
    return (data as Livestock | null) ?? null;
  },
  head: ({ params, loaderData }) => {
    const item = loaderData;
    const url = `${BASE_URL}/livestock/${params.code}`;
    const title = item
      ? `${item.name} (${item.breed ?? item.category ?? "livestock"}) — Dhandapani Farms`.slice(
          0,
          60,
        )
      : "Livestock — Dhandapani Farms";
    const rawDesc =
      item?.description ||
      `${item?.name ?? "Native livestock"} from a verified Tamil Nadu farm via Dhandapani Farms.`;
    const description = rawDesc.length < 60 ? `${rawDesc} Verified Tamil Nadu farm listing.` : rawDesc;
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
              sku: item.livestock_code,
              image: image ?? undefined,
              category: item.category ?? "Livestock",
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
  component: LivestockDetail,
  errorComponent: LivestockError,
  notFoundComponent: LivestockNotFound,
  pendingComponent: () => <Loader />,
});

function LivestockNotFound() {
  return (
    <div className="text-center py-32">
      <p className="text-muted-foreground">Listing not found.</p>
      <Link to="/livestock" className="mt-4 inline-block text-gold">
        ← All livestock
      </Link>
    </div>
  );
}

function LivestockError({ reset }: { error: Error; reset: () => void }) {
  const router = useRouter();
  return (
    <div className="text-center py-32">
      <p className="text-muted-foreground">Couldn't load this listing.</p>
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

function LivestockDetail() {
  const data = Route.useLoaderData();
  if (!data) return <LivestockNotFound />;

  const detailRows = [
    ["Breed", data.breed],
    ["Age", data.age],
    ["Weight", data.weight],
    ["Milk Yield", data.milk_yield],
    ["Health", data.health],
    ["Vaccination", data.vaccination],
  ].filter(([, v]) => !!v);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 grid md:grid-cols-2 gap-10">
      <div className="aspect-square rounded-2xl overflow-hidden glass">
        {data.images?.[0] && (
          <img src={data.images[0]} alt={data.name} className="w-full h-full object-cover" />
        )}
      </div>
      <div>
        <div className="text-xs uppercase tracking-widest text-gold">{data.category}</div>
        <h1 className="mt-2 font-display text-4xl font-bold">{data.name}</h1>
        <div className="mt-2 flex items-center gap-3 text-sm text-muted-foreground">
          <MapPin className="w-4 h-4" /> {data.location}
        </div>
        <p className="mt-5 text-muted-foreground leading-relaxed">{data.description}</p>
        <div className="mt-6 font-display text-4xl font-bold gold-text">
          ₹{data.price.toLocaleString("en-IN")}
        </div>

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
            Verified seller
            {data.seller_verified && <CheckCircle2 className="w-4 h-4 text-success" />}
          </div>
          <div className="text-sm text-muted-foreground">Contact via WhatsApp inquiry below.</div>
        </div>

        <a
          href={livestockInquiry(data.name, data.livestock_code)}
          target="_blank"
          rel="noreferrer"
          className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-primary to-[oklch(0.55_0.16_150)] text-primary-foreground font-medium shadow-glow"
        >
          <Phone className="w-4 h-4" /> Inquire on WhatsApp
        </a>
        <div className="mt-6 text-xs text-muted-foreground">
          Code: <span className="text-foreground">{data.livestock_code}</span>
        </div>
      </div>
    </div>
  );
}

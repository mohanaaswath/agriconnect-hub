import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { Leaf, ShoppingCart, Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { Product } from "@/lib/types";
import { discountedPrice } from "@/lib/types";
import { Loader } from "@/components/Loader";
import { useCart } from "@/stores/cart";
import { toast } from "sonner";
import { productInquiry } from "@/lib/whatsapp";

const BASE_URL = "https://farm-first-connect.lovable.app";

export const Route = createFileRoute("/products/$code")({
  loader: async ({ params }) => {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("product_code", params.code)
      .maybeSingle();
    if (error) throw error;
    return (data as Product | null) ?? null;
  },
  head: ({ params, loaderData }) => {
    const item = loaderData;
    const url = `${BASE_URL}/products/${params.code}`;
    const title = item
      ? `${item.name} — Dhandapani Farms`.slice(0, 60)
      : "Product — Dhandapani Farms";
    const rawDesc =
      item?.description ||
      `Buy ${item?.name ?? "farm produce"} direct from Dhandapani Farms in Tamil Nadu.`;
    const description = rawDesc.length < 60 ? `${rawDesc} Direct from Tamil Nadu farms.` : rawDesc;
    const meta = [
      { title },
      { name: "description", content: description.slice(0, 160) },
      { property: "og:title", content: title },
      { property: "og:description", content: description.slice(0, 160) },
      { property: "og:type", content: "product" },
      { property: "og:url", content: url },
    ];
    if (item?.image_url) {
      meta.push({ property: "og:image", content: item.image_url });
      meta.push({ name: "twitter:image", content: item.image_url });
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
              sku: item.product_code,
              image: item.image_url ?? undefined,
              category: item.category ?? undefined,
              brand: { "@type": "Brand", name: "Dhandapani Farms" },
              offers: {
                "@type": "Offer",
                priceCurrency: "INR",
                price: discountedPrice(item),
                availability:
                  item.stock > 0
                    ? "https://schema.org/InStock"
                    : "https://schema.org/OutOfStock",
                url,
              },
              aggregateRating:
                item.rating > 0 && item.reviews > 0
                  ? {
                      "@type": "AggregateRating",
                      ratingValue: item.rating,
                      reviewCount: item.reviews,
                    }
                  : undefined,
            }),
          },
        ]
      : undefined;
    return { meta, links: [{ rel: "canonical", href: url }], scripts };
  },
  component: ProductDetail,
  errorComponent: ProductError,
  notFoundComponent: ProductNotFound,
  pendingComponent: () => <Loader />,
});

function ProductNotFound() {
  return (
    <div className="text-center py-32">
      <p className="text-muted-foreground">Product not found.</p>
      <Link to="/products" className="mt-4 inline-block text-gold">
        ← All products
      </Link>
    </div>
  );
}

function ProductError({ reset }: { error: Error; reset: () => void }) {
  const router = useRouter();
  return (
    <div className="text-center py-32">
      <p className="text-muted-foreground">Couldn't load this product.</p>
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

function ProductDetail() {
  const data = Route.useLoaderData();
  const add = useCart((s) => s.add);

  if (!data) return <ProductNotFound />;

  const price = discountedPrice(data);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 grid md:grid-cols-2 gap-10">
      <div className="aspect-square rounded-2xl overflow-hidden glass">
        {data.image_url && (
          <img src={data.image_url} alt={data.name} className="w-full h-full object-cover" />
        )}
      </div>
      <div>
        <div className="text-xs uppercase tracking-widest text-gold">{data.category}</div>
        <h1 className="mt-2 font-display text-4xl font-bold">{data.name}</h1>
        <div className="mt-2 flex items-center gap-3 text-sm">
          {data.rating > 0 && (
            <span className="flex items-center gap-1 text-gold">
              <Star className="w-4 h-4 fill-current" /> {data.rating} ({data.reviews} reviews)
            </span>
          )}
          {data.organic && (
            <span className="flex items-center gap-1 text-success">
              <Leaf className="w-4 h-4" /> Organic
            </span>
          )}
        </div>
        <p className="mt-5 text-muted-foreground leading-relaxed">{data.description}</p>
        <div className="mt-6 flex items-baseline gap-3">
          <span className="font-display text-4xl font-bold gold-text">₹{price}</span>
          {data.discount_percent > 0 && (
            <span className="line-through text-muted-foreground">₹{data.price}</span>
          )}
          <span className="text-xs text-muted-foreground">{data.unit}</span>
        </div>
        <div className="mt-3 text-sm text-muted-foreground">
          {data.stock > 0 ? (
            <>
              In stock · {data.stock} {data.unit}
            </>
          ) : (
            <span className="text-destructive">Out of stock</span>
          )}
          {data.freshness && <> · {data.freshness}</>}
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <button
            onClick={() => {
              add(data);
              toast.success(`${data.name} added to cart`);
            }}
            disabled={data.stock === 0}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-primary to-[color:var(--dark-gold)] text-primary-foreground font-medium shadow-glow disabled:opacity-50"
          >
            <ShoppingCart className="w-4 h-4" /> Add to cart
          </button>
          <a
            href={productInquiry(data.name, data.product_code)}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full glass text-gold border-gold/30"
          >
            Inquire on WhatsApp
          </a>
        </div>
        <div className="mt-8 text-xs text-muted-foreground">
          Product code: <span className="text-foreground">{data.product_code}</span>
        </div>
      </div>
    </div>
  );
}

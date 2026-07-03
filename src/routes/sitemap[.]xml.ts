import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";

const BASE_URL = "https://farm-first-connect.lovable.app";

interface SitemapEntry {
  path: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: string;
  lastmod?: string;
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const entries: SitemapEntry[] = [
          { path: "/", changefreq: "weekly", priority: "1.0" },
          { path: "/products", changefreq: "daily", priority: "0.9" },
          { path: "/livestock", changefreq: "daily", priority: "0.9" },
          { path: "/real-estate", changefreq: "daily", priority: "0.9" },
          { path: "/contact", changefreq: "monthly", priority: "0.5" },
          { path: "/auth", changefreq: "yearly", priority: "0.3" },
          {
            path: "/blog/guide-to-buying-agricultural-land-tamil-nadu",
            changefreq: "monthly",
            priority: "0.7",
          },
        ];

        // Include dynamic detail routes from the Data API.
        try {
          const url = process.env.SUPABASE_URL;
          const key = process.env.SUPABASE_PUBLISHABLE_KEY;
          if (url && key) {
            const supa = createClient(url, key, {
              auth: { persistSession: false, autoRefreshToken: false },
            });
            const [products, livestock, realEstate] = await Promise.all([
              supa.from("products").select("product_code, created_at"),
              supa.from("livestock").select("livestock_code, created_at"),
              supa.from("real_estate").select("property_code, created_at"),
            ]);
            for (const row of products.data ?? []) {
              entries.push({
                path: `/products/${row.product_code}`,
                changefreq: "weekly",
                priority: "0.7",
                lastmod: row.created_at,
              });
            }
            for (const row of livestock.data ?? []) {
              entries.push({
                path: `/livestock/${row.livestock_code}`,
                changefreq: "weekly",
                priority: "0.7",
                lastmod: row.created_at,
              });
            }
            for (const row of realEstate.data ?? []) {
              entries.push({
                path: `/real-estate/${row.property_code}`,
                changefreq: "weekly",
                priority: "0.7",
                lastmod: row.created_at,
              });
            }
          }
        } catch {
          // Skip dynamic entries if the Data API is unreachable.
        }

        const urls = entries.map((e) =>
          [
            `  <url>`,
            `    <loc>${BASE_URL}${e.path}</loc>`,
            e.lastmod ? `    <lastmod>${e.lastmod}</lastmod>` : null,
            e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
            e.priority ? `    <priority>${e.priority}</priority>` : null,
            `  </url>`,
          ]
            .filter(Boolean)
            .join("\n"),
        );

        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
          ...urls,
          `</urlset>`,
        ].join("\n");

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});

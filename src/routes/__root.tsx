import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import logoAsset from "@/assets/logo.png.asset.json";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { Toaster } from "sonner";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { WhatsAppFab } from "@/components/WhatsAppFab";
import { BackToTop } from "@/components/BackToTop";
import { CartDrawer } from "@/components/CartDrawer";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold gold-text">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
        >
          Back home
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold text-foreground">Something went wrong</h1>
        <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
        <div className="mt-6 flex gap-2 justify-center">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
          >
            Try again
          </button>
          <Link to="/" className="rounded-md border border-border px-4 py-2 text-sm">
            Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Dhandapani Farms" },
      {
        name: "description",
        content:
          "Premium agriculture marketplace for fresh farm produce, native livestock and verified real estate in Tamil Nadu.",
      },
      { name: "author", content: "Dhandapani Farms" },
      { property: "og:site_name", content: "Dhandapani Farms" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "icon", type: "image/png", href: logoAsset.url },
      { rel: "apple-touch-icon", href: logoAsset.url },
      { rel: "stylesheet", href: appCss },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600;700;800&family=Inter:wght@400;500;600;700&display=swap",
      },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Organization",
              "@id": "https://farm-first-connect.lovable.app/#organization",
              name: "Dhandapani Farms",
              url: "https://farm-first-connect.lovable.app",
              logo: "https://farm-first-connect.lovable.app/favicon.png",
              email: "supreetsupreet443@gmail.com",
              telephone: "+91 91766 77275",
              foundingDate: "1985",
            },
            {
              "@type": "LocalBusiness",
              "@id": "https://farm-first-connect.lovable.app/#localbusiness",
              name: "Dhandapani Farms",
              url: "https://farm-first-connect.lovable.app",
              image: "https://farm-first-connect.lovable.app/favicon.png",
              telephone: "+91 91766 77275",
              email: "supreetsupreet443@gmail.com",
              priceRange: "₹",
              address: {
                "@type": "PostalAddress",
                streetAddress: "Dhandapani Thootam Amman Oil Mill Opposite",
                addressLocality: "Muthur, Kangayam Taluk",
                addressRegion: "Tamil Nadu",
                postalCode: "638105",
                addressCountry: "IN",
              },
            },
          ],
        }),
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <HeadContent />
      </head>
      <body className="dark">
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen flex flex-col bg-background text-foreground">
        <Navbar />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
        <WhatsAppFab />
        <BackToTop />
        <CartDrawer />
        <Toaster
          theme="dark"
          position="top-right"
          toastOptions={{
            style: {
              background: "oklch(0.21 0.014 150)",
              color: "oklch(0.97 0.01 90)",
              border: "1px solid oklch(1 0 0 / 0.1)",
            },
          }}
        />
      </div>
    </QueryClientProvider>
  );
}

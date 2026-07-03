import logoAsset from "@/assets/logo.png.asset.json";
import { Link } from "@tanstack/react-router";
import { Menu, ShoppingCart, X, LogOut, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/stores/cart";
import { useAuth } from "@/hooks/use-auth";
import { waLink } from "@/lib/whatsapp";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/products", label: "Products" },
  { to: "/livestock", label: "Livestock" },
  { to: "/real-estate", label: "Real Estate" },
  { to: "/contact", label: "Contact" },
] as const;

export function Navbar() {
  const [open, setOpen] = useState(false);
  const cartCount = useCart((s) => s.count());
  const openCart = useCart((s) => s.open);
  const { user, isAdmin } = useAuth();

  async function signOut() {
    await supabase.auth.signOut();
    toast.success("Signed out");
  }

  return (
    <header className="sticky top-0 z-40 border-b border-navbar-border bg-navbar text-navbar-foreground shadow-nav backdrop-blur-xl">
      <div className="mx-auto grid h-16 max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-3 sm:px-6">
        <Link to="/" className="group flex min-w-0 items-center gap-2">
          <img
            src={logoAsset.url}
            alt="Dhandapani Farms logo"
            className="h-9 w-9 shrink-0 rounded-lg object-cover shadow-glow"
          />
          <div className="min-w-0 leading-tight">
            <div className="truncate font-display text-sm font-bold tracking-tight text-navbar-foreground">
              DhandapaniFarmer
            </div>
            <div className="truncate font-display text-sm font-bold tracking-tight text-gold">
              Marketplace
            </div>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: item.to === "/" }}
              className="rounded-md px-4 py-2 text-sm font-medium text-navbar-muted transition-colors hover:bg-secondary hover:text-navbar-foreground"
              activeProps={{ className: "text-gold" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-1 sm:gap-2">
          <a
            href={waLink("Hello Dhandapani Farms!")}
            target="_blank"
            rel="noreferrer"
            className="hidden items-center gap-2 rounded-md bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground transition hover:opacity-90 md:inline-flex"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
              <path d="M20.5 3.5A12 12 0 0 0 3.3 19l-1.3 4.8 5-1.3a12 12 0 0 0 13.6-19zm-8.5 18a10 10 0 0 1-5-1.3l-.4-.2-3 .8.8-2.9-.2-.4A10 10 0 1 1 22 12a10 10 0 0 1-10 9.5zm5.5-7c-.3-.2-1.8-.9-2-1s-.5-.2-.7.1-.8 1-1 1.2-.4.2-.7 0-1.3-.5-2.5-1.5a9 9 0 0 1-1.6-2c-.2-.3 0-.5.1-.6l.4-.5.2-.4c.1-.2 0-.3 0-.5l-.7-1.7c-.2-.5-.4-.4-.5-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-1 2.2c0 1.3 1 2.6 1.1 2.7s2 3 4.8 4.2c.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.5-.1 1.7-.7 2-1.4s.3-1.2.2-1.3z" />
            </svg>
            WhatsApp
          </a>

          <button
            onClick={openCart}
            className="relative rounded-md p-2 text-navbar-foreground transition hover:bg-secondary"
            aria-label="Open cart"
          >
            <ShoppingCart className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-gold text-gold-foreground text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>

          {user ? (
            <>
              {isAdmin && (
                <Link
                  to="/admin"
                  className="hidden items-center gap-1 rounded-md border border-navbar-border px-3 py-2 text-sm font-semibold text-gold hover:bg-secondary sm:inline-flex"
                >
                  <ShieldCheck className="w-4 h-4" /> Admin
                </Link>
              )}
              <button
                onClick={signOut}
                className="rounded-md p-2 text-navbar-foreground hover:bg-secondary"
                aria-label="Sign out"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </>
          ) : (
            <Link
              to="/auth"
              className="hidden rounded-md border border-navbar-border px-3 py-2 text-sm font-semibold text-navbar-foreground hover:bg-secondary sm:inline-flex"
            >
              Sign in
            </Link>
          )}

          <button
            onClick={() => setOpen(true)}
            className="rounded-md border border-navbar-border bg-secondary p-2 text-navbar-foreground hover:bg-accent lg:hidden"
            aria-label="Menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm lg:hidden"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.25 }}
              className="fixed right-0 top-0 bottom-0 z-50 flex w-[86%] max-w-sm flex-col border-l border-navbar-border bg-navbar-panel text-navbar-panel-foreground shadow-2xl lg:hidden"
            >
              <div className="flex items-center justify-between border-b border-navbar-border p-4">
                <span className="font-display text-lg font-bold text-gold">Menu</span>
                <button
                  onClick={() => setOpen(false)}
                  className="rounded-md bg-secondary p-2 text-navbar-panel-foreground hover:bg-accent"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <nav className="flex min-h-0 flex-1 flex-col gap-1.5 overflow-hidden p-3">
                {NAV.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setOpen(false)}
                    className="rounded-md border border-navbar-border bg-background/35 px-3 py-2.5 text-sm font-semibold text-navbar-panel-foreground hover:bg-gold hover:text-gold-foreground"
                  >
                    {item.label}
                  </Link>
                ))}
                {!user && (
                  <Link
                    to="/auth"
                    onClick={() => setOpen(false)}
                    className="mt-1 rounded-md border border-navbar-border bg-gold px-3 py-2.5 text-sm font-bold text-gold-foreground"
                  >
                    Sign in
                  </Link>
                )}
                {isAdmin && (
                  <Link
                    to="/admin"
                    onClick={() => setOpen(false)}
                    className="mt-1 rounded-md border border-navbar-border bg-background/35 px-3 py-2.5 text-sm font-bold text-gold"
                  >
                    Admin Dashboard
                  </Link>
                )}
              </nav>

            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}

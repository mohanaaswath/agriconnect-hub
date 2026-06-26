import { Link } from "@tanstack/react-router";
import { Menu, ShoppingCart, X, LogOut, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/stores/cart";
import { useAuth } from "@/hooks/use-auth";
import { BUSINESS } from "@/lib/constants";
import { waLink } from "@/lib/whatsapp";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/products", label: "Products" },
  { to: "/livestock", label: "Livestock" },
  { to: "/farm-land", label: "Farm Land" },
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
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-background/70 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-[oklch(0.45_0.16_150)] flex items-center justify-center shadow-glow">
            <span className="text-primary-foreground font-bold font-display">D</span>
          </div>
          <div className="leading-tight">
            <div className="font-display font-bold text-base">{BUSINESS.name}</div>
            <div className="text-[10px] uppercase tracking-widest text-gold">Farm Marketplace</div>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: item.to === "/" }}
              className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-md"
              activeProps={{ className: "text-gold" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={waLink("Hello Dhandapani Farms!")}
            target="_blank"
            rel="noreferrer"
            className="hidden md:inline-flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium bg-[oklch(0.55_0.18_150)] text-primary-foreground hover:opacity-90 transition"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M20.5 3.5A12 12 0 0 0 3.3 19l-1.3 4.8 5-1.3a12 12 0 0 0 13.6-19zm-8.5 18a10 10 0 0 1-5-1.3l-.4-.2-3 .8.8-2.9-.2-.4A10 10 0 1 1 22 12a10 10 0 0 1-10 9.5zm5.5-7c-.3-.2-1.8-.9-2-1s-.5-.2-.7.1-.8 1-1 1.2-.4.2-.7 0-1.3-.5-2.5-1.5a9 9 0 0 1-1.6-2c-.2-.3 0-.5.1-.6l.4-.5.2-.4c.1-.2 0-.3 0-.5l-.7-1.7c-.2-.5-.4-.4-.5-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-1 2.2c0 1.3 1 2.6 1.1 2.7s2 3 4.8 4.2c.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.5-.1 1.7-.7 2-1.4s.3-1.2.2-1.3z"/></svg>
            WhatsApp
          </a>

          <button
            onClick={openCart}
            className="relative p-2 rounded-md hover:bg-accent transition"
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
                  className="hidden sm:inline-flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium border border-gold/40 text-gold hover:bg-gold/10"
                >
                  <ShieldCheck className="w-4 h-4" /> Admin
                </Link>
              )}
              <button onClick={signOut} className="p-2 rounded-md hover:bg-accent" aria-label="Sign out">
                <LogOut className="w-5 h-5" />
              </button>
            </>
          ) : (
            <Link
              to="/auth"
              className="hidden sm:inline-flex px-3 py-2 rounded-md text-sm font-medium border border-border hover:bg-accent"
            >
              Sign in
            </Link>
          )}

          <button onClick={() => setOpen(true)} className="lg:hidden p-2 rounded-md hover:bg-accent" aria-label="Menu">
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background/95 backdrop-blur-xl lg:hidden"
          >
            <div className="flex justify-between items-center p-4 border-b border-border">
              <span className="font-display font-bold">Menu</span>
              <button onClick={() => setOpen(false)} className="p-2 rounded-md hover:bg-accent">
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="flex flex-col p-4 gap-1">
              {NAV.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className="px-4 py-3 text-base font-medium rounded-md hover:bg-accent"
                >
                  {item.label}
                </Link>
              ))}
              {!user && (
                <Link
                  to="/auth"
                  onClick={() => setOpen(false)}
                  className="px-4 py-3 text-base font-medium rounded-md border border-border mt-2"
                >
                  Sign in
                </Link>
              )}
              {isAdmin && (
                <Link
                  to="/admin"
                  onClick={() => setOpen(false)}
                  className="px-4 py-3 text-base font-medium rounded-md border border-gold/40 text-gold mt-2"
                >
                  Admin Dashboard
                </Link>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

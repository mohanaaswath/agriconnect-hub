import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Leaf, ShieldCheck, Sprout } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden" style={{ background: "var(--gradient-hero)" }}>
      <div
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1920&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          maskImage: "linear-gradient(180deg, black, transparent 80%)",
        }}
      />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-24 pb-32 md:pt-32 md:pb-40 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="mt-6 font-display text-4xl sm:text-6xl md:text-7xl font-bold leading-[1.05] max-w-4xl mx-auto tracking-wide"
        >
          Dhandapani Farms — Premium Agriculture Marketplace
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-4 inline-flex items-center gap-2 text-sm sm:text-base text-muted-foreground"
        >
          <span className="text-gold">📍</span>
          Dhandapani Thootam, Muthur, Tamil Nadu
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-6 text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto"
        >
          Connect with trusted farmers for premium agricultural products, quality livestock, and
          fertile Real estate. Experience the authentic taste of nature with our verified
          agricultural marketplace.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-8 flex flex-wrap justify-center gap-3"
        >
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-primary to-[color:var(--dark-gold)] text-primary-foreground font-medium shadow-glow hover:shadow-glow"
          >
            Shop produce <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/real-estate"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full glass text-gold font-medium border-gold/30"
          >
            Browse real estate
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-14 grid grid-cols-3 max-w-2xl mx-auto gap-2 sm:gap-6"
        >
          {[
            { icon: ShieldCheck, label: "Verified sellers" },
            { icon: Leaf, label: "Organic farms" },
            { icon: Sprout, label: "Native breeds" },
          ].map((t) => (
            <div
              key={t.label}
              className="glass rounded-xl px-3 py-3 flex flex-col items-center gap-2"
            >
              <t.icon className="w-5 h-5 text-gold" />
              <span className="text-xs sm:text-sm text-muted-foreground">{t.label}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

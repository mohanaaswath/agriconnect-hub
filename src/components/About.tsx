import { BUSINESS } from "@/lib/constants";
import { Leaf, Tractor, Users } from "lucide-react";

export function About() {
  return (
    <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 grid md:grid-cols-2 gap-12 items-center">
      <div>
        <div className="text-xs uppercase tracking-widest text-gold">Our Story</div>
        <h2 className="mt-3 font-display text-3xl sm:text-4xl font-bold">
          Four decades of <span className="green-text">honest farming</span>.
        </h2>
        <p className="mt-5 text-muted-foreground leading-relaxed">
          {BUSINESS.name} began in {BUSINESS.established} as a small family farm in Tamil Nadu and
          grew into a trusted agriculture marketplace. We sell what we and our partner farmers grow
          — fresh produce, healthy native livestock, and well-cared agricultural land — without
          middlemen, without compromise.
        </p>
        <div className="mt-8 grid sm:grid-cols-3 gap-4">
          {[
            { icon: Tractor, title: "Direct from farm", body: "No middlemen." },
            { icon: Leaf, title: "Organic-first", body: "Soil to shelf." },
            { icon: Users, title: "Family run", body: "Three generations." },
          ].map((c) => (
            <div key={c.title} className="glass rounded-xl p-4">
              <c.icon className="w-5 h-5 text-gold" />
              <div className="mt-2 font-semibold text-sm">{c.title}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{c.body}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="relative">
        <img
          src="https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=1200&q=80"
          alt="Farm at sunset"
          className="w-full aspect-[4/3] object-cover rounded-2xl shadow-elegant"
          loading="lazy"
        />
        <div className="absolute -bottom-4 -left-4 glass rounded-xl px-5 py-3 hidden sm:block">
          <div className="text-xs uppercase tracking-widest text-gold">Heritage</div>
          <div className="font-display text-2xl font-bold">est. {BUSINESS.established}</div>
        </div>
      </div>
    </section>
  );
}

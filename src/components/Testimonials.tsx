import { Star } from "lucide-react";

const items = [
  {
    name: "Karthik R.",
    role: "Restaurant owner, Coimbatore",
    text: "Their bananas and groundnut are the freshest I've sourced in years. Direct delivery, fair price.",
  },
  {
    name: "Meena S.",
    role: "Dairy farmer, Erode",
    text: "Bought a Kangayam cow last spring. Healthy, well-documented, and the seller was responsive over WhatsApp.",
  },
  {
    name: "Vignesh P.",
    role: "Investor, Chennai",
    text: "Bought a 25-acre organic estate through Dhandapani Farms. Verified land records and a smooth handover.",
  },
];

export function Testimonials() {
  return (
    <section className="py-20 bg-[oklch(0.14_0.012_150)] border-y border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <div className="text-xs uppercase tracking-widest text-gold">Voices from the field</div>
          <h2 className="mt-2 font-display text-3xl sm:text-4xl font-bold">
            Trusted by buyers across Tamil Nadu
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {items.map((t) => (
            <div key={t.name} className="glass rounded-2xl p-6">
              <div className="flex gap-0.5 text-gold mb-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">"{t.text}"</p>
              <div className="mt-5">
                <div className="font-semibold text-sm">{t.name}</div>
                <div className="text-xs text-muted-foreground">{t.role}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

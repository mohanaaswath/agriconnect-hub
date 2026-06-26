import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { BadgeCheck, Droplets, MapPin, Maximize, Phone } from "lucide-react";
import type { RealEstate } from "@/lib/types";
import { propertyInquiry } from "@/lib/whatsapp";

export function RealEstateCard({ item }: { item: RealEstate }) {
  return (
    <motion.div whileHover={{ y: -4 }} className="glass rounded-2xl overflow-hidden flex flex-col">
      <Link to="/farm-land/$code" params={{ code: item.property_code }} className="relative aspect-[16/9] overflow-hidden bg-secondary block">
        {item.images?.[0] && (
          <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover hover:scale-105 transition duration-500" loading="lazy" />
        )}
        {item.verified && (
          <span className="absolute top-3 right-3 px-2 py-0.5 text-[10px] font-bold uppercase rounded-full bg-gold text-gold-foreground flex items-center gap-1">
            <BadgeCheck className="w-3 h-3" /> Verified
          </span>
        )}
      </Link>

      <div className="p-5 flex-1 flex flex-col">
        <Link to="/farm-land/$code" params={{ code: item.property_code }}>
          <h3 className="font-display text-xl font-semibold hover:text-gold transition">{item.name}</h3>
        </Link>
        <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
          <MapPin className="w-3 h-3" /> {item.location}
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center gap-1.5 text-muted-foreground"><Maximize className="w-3 h-3 text-primary" /> {item.size}</div>
          <div className="flex items-center gap-1.5 text-muted-foreground"><Droplets className="w-3 h-3 text-primary" /> {item.water_source}</div>
        </div>

        {item.amenities && item.amenities.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {item.amenities.slice(0, 3).map((a) => (
              <span key={a} className="text-[10px] px-2 py-0.5 rounded-full bg-accent text-accent-foreground">
                {a}
              </span>
            ))}
          </div>
        )}

        <div className="mt-auto pt-4 flex items-end justify-between">
          <div>
            <div className="text-2xl font-bold gold-text">₹{(item.price / 100000).toFixed(1)}L</div>
            {item.price_per_acre && (
              <div className="text-[10px] text-muted-foreground">
                ₹{(item.price_per_acre / 100000).toFixed(2)}L / acre
              </div>
            )}
          </div>
          <a
            href={propertyInquiry(item.name, item.property_code)}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[oklch(0.55_0.18_150)] text-primary-foreground text-sm font-medium hover:opacity-90"
          >
            <Phone className="w-3.5 h-3.5" /> Contact
          </a>
        </div>
      </div>
    </motion.div>
  );
}

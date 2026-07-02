import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { CheckCircle2, MapPin, Phone } from "lucide-react";
import type { Livestock } from "@/lib/types";
import { livestockInquiry } from "@/lib/whatsapp";
import { AdminRowControls } from "@/components/admin/AdminControls";

export function LivestockCard({ item }: { item: Livestock }) {
  return (
    <motion.div whileHover={{ y: -4 }} className="glass rounded-2xl overflow-hidden flex flex-col">
      <Link
        to="/livestock/$code"
        params={{ code: item.livestock_code }}
        className="relative aspect-[4/3] overflow-hidden bg-secondary block"
      >
        {item.images?.[0] && (
          <img
            src={item.images[0]}
            alt={item.name}
            className="w-full h-full object-cover hover:scale-105 transition duration-500"
            loading="lazy"
          />
        )}
        {item.featured && (
          <span className="absolute top-3 left-3 px-2 py-0.5 text-[10px] font-bold uppercase rounded-full bg-gold text-gold-foreground">
            Featured
          </span>
        )}
        {item.seller_verified && (
          <span className="absolute top-3 right-3 px-2 py-0.5 text-[10px] font-bold uppercase rounded-full bg-success/90 text-success-foreground flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Verified
          </span>
        )}
      </Link>

      <div className="p-4 flex-1 flex flex-col">
        <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
          {item.breed} · {item.category}
        </div>
        <Link to="/livestock/$code" params={{ code: item.livestock_code }}>
          <h3 className="mt-1 font-display text-lg font-semibold hover:text-gold transition">
            {item.name}
          </h3>
        </Link>
        <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-muted-foreground">
          <div>
            Age: <span className="text-foreground">{item.age}</span>
          </div>
          <div>
            Weight: <span className="text-foreground">{item.weight}</span>
          </div>
          {item.milk_yield && (
            <div className="col-span-2">
              Milk: <span className="text-foreground">{item.milk_yield}</span>
            </div>
          )}
        </div>
        <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
          <MapPin className="w-3 h-3" /> {item.location}
        </div>

        <div className="mt-auto pt-4 flex items-end justify-between">
          <div>
            <div className="text-2xl font-bold gold-text">
              ₹{item.price.toLocaleString("en-IN")}
            </div>
          </div>
          <a
            href={livestockInquiry(item.name, item.livestock_code)}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[oklch(0.55_0.18_150)] text-primary-foreground text-sm font-medium hover:opacity-90"
          >
            <Phone className="w-3.5 h-3.5" /> Inquire
          </a>
        </div>
      </div>
      <AdminRowControls kind="livestock" item={item} />
    </motion.div>
  );
}

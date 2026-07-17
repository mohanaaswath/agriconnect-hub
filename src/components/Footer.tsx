import { Link } from "@tanstack/react-router";
import { BUSINESS } from "@/lib/constants";
import { Mail, MapPin, Phone } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 grid md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-[oklch(0.45_0.16_150)] flex items-center justify-center">
              <span className="text-primary-foreground font-bold font-display">D</span>
            </div>
            <span className="font-display font-bold">{BUSINESS.name}</span>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            Premium farm produce, native livestock and fertile agriculture land — sourced direct
            from the farmer since {BUSINESS.established}.
          </p>
        </div>

        <div>
          <h4 className="font-display font-semibold text-gold mb-3">Marketplace</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              <Link to="/products" className="hover:text-foreground">
                Products
              </Link>
            </li>
            <li>
              <Link to="/livestock" className="hover:text-foreground">
                Livestock
              </Link>
            </li>
            <li>
              <Link to="/real-estate" className="hover:text-foreground">
                Real Estate
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-foreground">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-display font-semibold text-gold mb-3">Reach Us</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <MapPin className="w-4 h-4 mt-0.5 text-primary" /> {BUSINESS.address}
            </li>
            <li className="flex items-start gap-2">
              <Phone className="w-4 h-4 mt-0.5 text-primary" /> {BUSINESS.phoneDisplay}
            </li>
            <li className="flex items-start gap-2">
              <Mail className="w-4 h-4 mt-0.5 text-primary" /> {BUSINESS.email}
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-display font-semibold text-gold mb-3">Trust</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>40+ years of farming heritage</li>
            <li>Verified livestock & land</li>
            <li>Direct-from-farmer pricing</li>
            <li>WhatsApp-first support</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border py-5 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} {BUSINESS.name}. All rights reserved.
      </div>
    </footer>
  );
}

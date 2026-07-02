import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, MapPin, Phone, Send, type LucideIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { BUSINESS } from "@/lib/constants";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Dhandapani Farms" },
      {
        name: "description",
        content:
          "Get in touch with Dhandapani Farms for produce, livestock or real estate inquiries.",
      },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [f, setF] = useState({ name: "", email: "", phone: "", message: "" });
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!f.name.trim() || !f.email.trim() || !f.message.trim()) {
      toast.error("Please fill in the required fields.");
      return;
    }
    setLoading(true);
    const { error } = await supabase.from("contact_messages").insert(f);
    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Message sent! We'll reply within one business day.");
    setF({ name: "", email: "", phone: "", message: "" });
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 grid md:grid-cols-2 gap-10">
      <div>
        <div className="text-xs uppercase tracking-widest text-gold">Get in touch</div>
        <h1 className="mt-2 font-display text-4xl font-bold">Let's grow together.</h1>
        <p className="mt-4 text-muted-foreground">
          Whether you're after a kilo of bananas or 50 acres of farmland, we'd love to hear from
          you.
        </p>

        <div className="mt-8 space-y-4">
          <Info icon={MapPin} label="Visit" value={BUSINESS.address} />
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 text-gold flex items-center justify-center shrink-0">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs uppercase tracking-widest text-muted-foreground">
                Call / WhatsApp
              </div>
              <div className="font-medium">Primary: {BUSINESS.phonePrimary}</div>
              <div className="text-sm text-muted-foreground">
                Secondary: {BUSINESS.phoneSecondary}
              </div>
            </div>
          </div>
          <Info icon={Mail} label="Email" value={BUSINESS.email} />
        </div>

        <div className="mt-8 rounded-2xl overflow-hidden border border-border shadow-elegant h-64 md:h-72">
          <iframe
            src={BUSINESS.mapUrl}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Dhandapani Farms location"
            className="grayscale-[20%] hover:grayscale-0 transition duration-500"
          />
        </div>
      </div>

      <form onSubmit={submit} className="glass rounded-2xl p-6 space-y-4">
        <h2 className="font-display text-2xl font-semibold">Send a message</h2>
        <input
          value={f.name}
          onChange={(e) => setF({ ...f, name: e.target.value })}
          placeholder="Your name *"
          className="w-full px-4 py-3 bg-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <input
          type="email"
          value={f.email}
          onChange={(e) => setF({ ...f, email: e.target.value })}
          placeholder="Email *"
          className="w-full px-4 py-3 bg-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <input
          value={f.phone}
          onChange={(e) => setF({ ...f, phone: e.target.value })}
          placeholder="Phone"
          className="w-full px-4 py-3 bg-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <textarea
          value={f.message}
          onChange={(e) => setF({ ...f, message: e.target.value })}
          rows={5}
          placeholder="How can we help? *"
          className="w-full px-4 py-3 bg-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <button
          disabled={loading}
          className="w-full inline-flex justify-center items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-primary to-[oklch(0.55_0.16_150)] text-primary-foreground font-medium shadow-glow disabled:opacity-50"
        >
          <Send className="w-4 h-4" /> {loading ? "Sending…" : "Send message"}
        </button>
      </form>
    </div>
  );
}

function Info({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-10 h-10 rounded-lg bg-primary/10 text-gold flex items-center justify-center shrink-0">
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <div className="text-xs uppercase tracking-widest text-muted-foreground">{label}</div>
        <div className="font-medium">{value}</div>
      </div>
    </div>
  );
}

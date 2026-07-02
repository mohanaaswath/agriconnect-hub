import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useCart } from "@/stores/cart";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { discountedPrice } from "@/lib/types";
import { toast } from "sonner";

export function CheckoutModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { items, total, clear, close } = useCart();
  const { user } = useAuth();
  const [form, setForm] = useState({ name: "", phone: "", address: "" });
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim() || !form.address.trim()) {
      toast.error("Please fill in all fields");
      return;
    }
    setLoading(true);
    try {
      const { data: order, error } = await supabase
        .from("orders")
        .insert({
          user_id: user?.id ?? null,
          customer_name: form.name,
          customer_phone: form.phone,
          customer_address: form.address,
          total_amount: total(),
        })
        .select()
        .single();
      if (error) throw error;
      const rows = items.map((i) => ({
        order_id: order.id,
        product_id: i.product.id,
        quantity: i.quantity,
        price: discountedPrice(i.product),
      }));
      const { error: itemsErr } = await supabase.from("order_items").insert(rows);
      if (itemsErr) throw itemsErr;
      toast.success("Order placed! We'll contact you shortly.");
      clear();
      close();
      onClose();
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60]"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-[61] flex items-center justify-center p-4"
            onClick={onClose}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md glass rounded-2xl p-6 relative"
            >
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-1.5 rounded-md hover:bg-accent"
              >
                <X className="w-5 h-5" />
              </button>
              <h2 className="font-display text-2xl font-bold mb-1">Checkout</h2>
              <p className="text-sm text-muted-foreground mb-5">
                Total: <span className="gold-text font-bold">₹{total()}</span>
              </p>
              <form onSubmit={submit} className="space-y-3">
                <input
                  placeholder="Full name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-2.5 bg-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <input
                  placeholder="Phone number"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full px-4 py-2.5 bg-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <textarea
                  placeholder="Delivery address"
                  rows={3}
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  className="w-full px-4 py-2.5 bg-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button
                  disabled={loading}
                  className="w-full py-3 rounded-md bg-gradient-to-r from-primary to-[oklch(0.55_0.16_150)] text-primary-foreground font-medium shadow-glow disabled:opacity-50"
                >
                  {loading ? "Placing order…" : "Place order"}
                </button>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

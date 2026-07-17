import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/stores/cart";
import { discountedPrice } from "@/lib/types";
import { CheckoutModal } from "./CheckoutModal";

export function CartDrawer() {
  const { isOpen, close, items, remove, setQty, total, clear } = useCart();
  const [checkout, setCheckout] = useState(false);

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={close}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
            />
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="fixed right-0 top-0 bottom-0 w-full sm:w-[420px] bg-card z-50 flex flex-col border-l border-border"
            >
              <div className="flex items-center justify-between p-5 border-b border-border">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-gold" />
                  <h3 className="font-display text-lg font-semibold">Your Cart</h3>
                </div>
                <button onClick={close} className="p-1.5 rounded-md hover:bg-accent">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                {items.length === 0 ? (
                  <div className="text-center py-20 text-muted-foreground">
                    <ShoppingBag className="w-12 h-12 mx-auto opacity-30" />
                    <p className="mt-4 text-sm">Your cart is empty.</p>
                  </div>
                ) : (
                  items.map((it) => {
                    const price = discountedPrice(it.product);
                    return (
                      <div key={it.product.id} className="flex gap-3 p-3 glass rounded-lg">
                        <img
                          src={it.product.image_url ?? ""}
                          alt={it.product.name}
                          className="w-16 h-16 rounded-md object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm truncate">{it.product.name}</div>
                          <div className="text-xs text-muted-foreground">{it.product.unit}</div>
                          <div className="mt-1 flex items-center justify-between">
                            <div className="text-gold font-semibold">₹{price * it.quantity}</div>
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => setQty(it.product.id, it.quantity - 1)}
                                className="w-6 h-6 rounded border border-border flex items-center justify-center hover:bg-accent"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="w-6 text-center text-sm">{it.quantity}</span>
                              <button
                                onClick={() => setQty(it.product.id, it.quantity + 1)}
                                className="w-6 h-6 rounded border border-border flex items-center justify-center hover:bg-accent"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                              <button
                                onClick={() => remove(it.product.id)}
                                className="ml-1 w-6 h-6 rounded text-destructive hover:bg-destructive/10 flex items-center justify-center"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {items.length > 0 && (
                <div className="border-t border-border p-5 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-display font-bold text-xl gold-text">₹{total()}</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => clear()}
                      className="flex-1 py-2.5 rounded-md border border-border text-sm hover:bg-accent"
                    >
                      Clear
                    </button>
                    <button
                      onClick={() => setCheckout(true)}
                      className="flex-1 py-2.5 rounded-md bg-gradient-to-r from-primary to-[color:var(--dark-gold)] text-primary-foreground font-medium shadow-glow"
                    >
                      Checkout
                    </button>
                  </div>
                </div>
              )}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
      <CheckoutModal open={checkout} onClose={() => setCheckout(false)} />
    </>
  );
}

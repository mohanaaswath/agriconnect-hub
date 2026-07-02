import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { ShoppingCart, Star } from "lucide-react";
import type { Product } from "@/lib/types";
import { discountedPrice } from "@/lib/types";
import { useCart } from "@/stores/cart";
import { toast } from "sonner";
import { AdminRowControls } from "@/components/admin/AdminControls";

export function ProductCard({ product }: { product: Product }) {
  const add = useCart((s) => s.add);
  const price = discountedPrice(product);

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="glass rounded-2xl overflow-hidden group flex flex-col"
    >
      <Link
        to="/products/$code"
        params={{ code: product.product_code }}
        className="block relative aspect-[4/3] overflow-hidden bg-secondary"
      >
        {product.image_url && (
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
            loading="lazy"
          />
        )}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.featured && (
            <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full bg-gold text-gold-foreground">
              Featured
            </span>
          )}
          {product.organic && (
            <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full bg-success/90 text-success-foreground">
              Organic
            </span>
          )}
        </div>
        {product.discount_percent > 0 && (
          <span className="absolute top-3 right-3 px-2 py-1 text-xs font-bold rounded-full bg-destructive text-destructive-foreground">
            -{product.discount_percent}%
          </span>
        )}
      </Link>

      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-center justify-between text-[10px] uppercase tracking-wider text-muted-foreground">
          <span>{product.category}</span>
          {product.rating > 0 && (
            <span className="flex items-center gap-0.5 text-gold">
              <Star className="w-3 h-3 fill-current" />
              {product.rating} ({product.reviews})
            </span>
          )}
        </div>
        <Link to="/products/$code" params={{ code: product.product_code }}>
          <h3 className="mt-1.5 font-display text-lg font-semibold line-clamp-1 hover:text-gold transition">
            {product.name}
          </h3>
        </Link>
        <p className="mt-1 text-xs text-muted-foreground line-clamp-2 flex-1">
          {product.description}
        </p>

        <div className="mt-3 flex items-end justify-between">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold gold-text">₹{price}</span>
              {product.discount_percent > 0 && (
                <span className="text-xs line-through text-muted-foreground">₹{product.price}</span>
              )}
            </div>
            <div className="text-[10px] text-muted-foreground">{product.unit}</div>
          </div>
          <button
            onClick={() => {
              add(product);
              toast.success(`${product.name} added to cart`);
            }}
            className="p-2.5 rounded-lg bg-primary text-primary-foreground hover:opacity-90 shadow-glow"
            aria-label="Add to cart"
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
        </div>
      </div>
      <AdminRowControls kind="product" item={product} />
    </motion.div>
  );
}

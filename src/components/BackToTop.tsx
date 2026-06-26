import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

export function BackToTop() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const fn = () => setShow(window.scrollY > 400);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);
  if (!show) return null;
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Back to top"
      className="fixed bottom-24 right-6 z-30 w-11 h-11 rounded-full bg-gold text-gold-foreground shadow-gold flex items-center justify-center hover:scale-105 transition"
    >
      <ArrowUp className="w-5 h-5" />
    </button>
  );
}

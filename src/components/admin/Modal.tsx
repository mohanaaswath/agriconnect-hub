import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { ReactNode } from "react";

export function Modal({ open, onClose, title, children, wide }: { open: boolean; onClose: () => void; title: string; children: ReactNode; wide?: boolean }) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose} className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60]" />
          <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-[61] flex items-center justify-center p-4 overflow-y-auto">
            <div onClick={(e) => e.stopPropagation()} className={`w-full ${wide ? "max-w-2xl" : "max-w-md"} my-8 glass rounded-2xl p-6 relative`}>
              <button onClick={onClose} className="absolute top-4 right-4 p-1.5 rounded-md hover:bg-accent">
                <X className="w-5 h-5" />
              </button>
              <h2 className="font-display text-2xl font-bold mb-5">{title}</h2>
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

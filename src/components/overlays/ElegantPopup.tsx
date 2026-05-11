import { AnimatePresence, motion } from "framer-motion";

interface ElegantPopupProps {
  isOpen: boolean;
  message: string;
}

export function ElegantPopup({ isOpen, message }: ElegantPopupProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div className="pointer-events-none fixed inset-0 z-[10000] flex items-center justify-center px-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <motion.div
            className="max-w-lg rounded-2xl border border-white/20 bg-slate-900/55 px-6 py-4 text-center text-sm font-medium text-slate-100 shadow-2xl backdrop-blur-md"
            initial={{ opacity: 0, y: 10, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            {message}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
import { AnimatePresence, motion } from "framer-motion";
import { LoggedAreaFrameProps } from "@/types/props";

export function LoggedAreaFrame({ viewport, activeTab, children }: LoggedAreaFrameProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0F172A] to-[#020617] px-4 pb-24 pt-2 text-slate-100 md:flex md:items-center md:justify-center md:pb-6 md:pt-6" style={viewport.width >= 768 ? { minHeight: viewport.height } : undefined}>
      <div className="mx-auto w-full max-w-md md:flex md:min-h-[calc(100dvh-2.5rem)] md:flex-col md:justify-center">
        <AnimatePresence mode="wait">
          <motion.section key={activeTab} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="space-y-4">
            {children}
          </motion.section>
        </AnimatePresence>
      </div>
    </div>
  );
}
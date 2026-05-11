import { motion } from "framer-motion";
import { IntroScreenProps } from "@/types/props";

export function IntroScreen({ viewport }: IntroScreenProps) {
  return (
    <div
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_top,#1e293b,#020617_65%)] px-6 text-white"
      style={viewport.width >= 768 ? { minHeight: viewport.height } : undefined}
    >
      <motion.div
        className="absolute h-72 w-72 rounded-full bg-sky-500/30 blur-3xl"
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ repeat: Number.POSITIVE_INFINITY, duration: 5 }}
      />
      <motion.div className="z-10 w-full max-w-sm md:max-w-[540px] lg:max-w-[620px]" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
        <img
          src="/header.png"
          alt="Header ABREF"
          className="mx-auto h-auto w-full max-w-[330px] object-contain md:max-w-[540px] lg:max-w-[620px]"
          onError={(e) => ((e.target as HTMLImageElement).style.display = "none")}
        />
      </motion.div>
    </div>
  );
}
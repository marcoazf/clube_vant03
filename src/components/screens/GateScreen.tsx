import { motion } from "framer-motion";
import { FaShieldAlt } from "react-icons/fa";
import { GateScreenProps } from "@/types/props";

export function GateScreen({ accessLabel }: GateScreenProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-white">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
        <FaShieldAlt className="mx-auto mb-4 text-4xl text-emerald-400" />
        <h2 className="text-2xl font-bold">Voce e um usuario {accessLabel}.</h2>
        <p className="mt-2 text-slate-300">Acesso permitido.</p>
      </motion.div>
    </div>
  );
}
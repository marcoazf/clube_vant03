import { motion } from "framer-motion";
import { FaGem } from "react-icons/fa";

export function ExclusiveTab() {
  return (
    <div className="flex min-h-[calc(100dvh-12rem)] flex-col space-y-3 rounded-2xl border border-indigo-700/50 bg-slate-900/80 p-4">
      <img src="/exclusive-banner.png" alt="Campanha exclusiva" className="h-44 w-full rounded-2xl object-cover" />
      <h2 className="flex items-center gap-2 text-xl font-semibold text-indigo-300">
        <FaGem />
        Canal Exclusivo
      </h2>
      <p className="text-sm text-slate-300">Sorteios mensais, descontos progressivos e campanhas premium para associados ativos do sindicato.</p>
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div className="rounded-xl bg-indigo-500/20 p-3 text-indigo-100">Cashback em rede parceira</div>
        <div className="rounded-xl bg-emerald-500/20 p-3 text-emerald-100">Cupom aniversario automatico</div>
      </div>
      <motion.div animate={{ x: [0, 8, 0] }} transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2.4 }} className="rounded-xl bg-indigo-500/20 p-3 text-sm text-indigo-200">
        Proximo sorteio em 07 dias. Continue usando seu cartao para acumular participacoes e dobrar chances.
      </motion.div>
      <div className="mt-auto rounded-xl border border-indigo-700/40 bg-indigo-500/10 p-4 text-sm text-indigo-100">
        Beneficio-chave: usar o cartao semanalmente aumenta relevancia para campanhas e libera ofertas personalizadas por cidade e sindicato.
      </div>
    </div>
  );
}
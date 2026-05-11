import { FaLock } from "react-icons/fa";
import { SecureMaskOverlayProps } from "@/types/props";

export function SecureMaskOverlay({ onDisable }: SecureMaskOverlayProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/95 text-center text-slate-200">
      <div>
        <FaLock className="mx-auto mb-3 text-3xl text-rose-400" />
        <p className="font-semibold">Conteudo protegido para demonstracao.</p>
        <p className="text-xs text-slate-400">Protecao visual anti-captura simulada para o prototipo.</p>
        <button className="mt-4 rounded-lg bg-sky-600 px-4 py-2 text-sm" onClick={onDisable}>
          Desativar mascara
        </button>
      </div>
    </div>
  );
}
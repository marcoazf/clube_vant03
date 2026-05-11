import { ReactNode } from "react";
import { FaBell, FaBuilding, FaClock, FaIdCard, FaQrcode, FaUser, FaUserCheck } from "react-icons/fa";
import { HomeTabProps } from "@/types/props";
import { cardTheme } from "@/utils/app-formatters";

export function HomeTab({
  sessionUser,
  currentSyndicate,
  clock,
  unreadCount,
  deferredInstall,
  onOpenNotices,
  onInstallPwa,
  onToggleSecureMask,
  onLogout,
  onGenerateCard,
}: HomeTabProps) {
  return (
    <>
      <div className="px-1 text-sm font-semibold text-slate-100">
        {currentSyndicate?.nome ?? "Sindicato nao definido"} {currentSyndicate ? `- ${currentSyndicate.cidade}/${currentSyndicate.estado}` : ""}
      </div>
      <div className={`flex min-h-[calc(100dvh-8.8rem)] flex-col overflow-hidden rounded-3xl bg-gradient-to-br ${cardTheme(sessionUser.role)} p-0 shadow-2xl md:min-h-[min(760px,calc(100dvh-7.6rem))]`}>
        <div className="rounded-b-[2.2rem] bg-white/95 px-5 pb-5 pt-4 text-slate-900">
          <div className="mb-3 flex items-center justify-between border-b border-slate-300 pb-2 text-slate-700">
            <p className="flex items-center gap-2 text-sm font-semibold">
              <FaClock />
              {clock.toLocaleTimeString("pt-BR")}
            </p>
            <div className="flex items-center gap-2">
              <button className="relative rounded-lg bg-slate-200 p-2 text-slate-700" onClick={onOpenNotices}>
                <FaBell />
                {unreadCount > 0 && <span className="absolute -right-1 -top-1 rounded-full bg-rose-500 px-1.5 text-[10px] font-bold text-white">{unreadCount}</span>}
              </button>
              {deferredInstall && (
                <button className="rounded-lg border border-slate-400 px-2 py-1 text-[11px]" onClick={onInstallPwa}>
                  Instalar
                </button>
              )}
              <button className="rounded-lg border border-slate-300 px-2 py-1 text-[11px]" onClick={onToggleSecureMask}>
                Seguro
              </button>
              <button className="rounded-lg bg-slate-200 px-3 py-1 text-xs font-bold tracking-wide text-rose-600" onClick={onLogout}>
                SAIR
              </button>
            </div>
          </div>
          <img src="/logo_cartao_blue.png" alt="Logo cartao azul" className="mx-auto h-auto w-full max-w-[250px] object-contain md:max-w-[320px]" onError={(e) => ((e.target as HTMLImageElement).style.display = "none")} />
        </div>

        <div className="flex flex-1 flex-col p-4">
          <div className="mb-2 flex items-center gap-3">
            {sessionUser.foto ? <img src={sessionUser.foto} alt="Perfil" className="h-16 w-16 rounded-2xl border border-white/30 object-cover" /> : <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-black/30 text-xl"><FaUser /></div>}
            <div className="text-xs text-slate-100">
              <p>ID visual do associado</p>
              <p className="text-sm font-semibold uppercase">{sessionUser.cardId ?? "PENDENTE"}</p>
            </div>
          </div>

          <div className="space-y-1.5 text-xs">
            {([
              { label: "ID", value: sessionUser.cardId ?? "PENDENTE", icon: <FaIdCard /> },
              {
                label: "NOME E CATEGORIA",
                value: `${sessionUser.nome} - ${sessionUser.role === "empresa" ? "EMPRESARIAL - SOCIO" : "COLABORADOR - SOCIO"}`,
                icon: <FaUser />,
              },
              ...(sessionUser.role === "empresa"
                ? [
                    { label: "RAZAO SOCIAL", value: sessionUser.razaoSocial ?? "-", icon: <FaBuilding /> },
                    { label: "CNPJ", value: sessionUser.cnpj ?? "-", icon: <FaBuilding /> },
                  ]
                : [{ label: "CPF", value: sessionUser.cpf ?? "-", icon: <FaIdCard /> }]),
              { label: "CIDADE E ESTADO", value: `${sessionUser.cidade} / ${sessionUser.estado}`, icon: <FaBuilding /> },
            ] as Array<{ label: string; value: string; icon: ReactNode }>).map((field) => (
              <div key={field.label} className="rounded-lg border border-white/25 bg-black/20 p-1.5">
                <p className="mb-1 flex items-center gap-1 uppercase text-[10px] tracking-wide text-slate-200">
                  {field.icon}
                  {field.label}
                </p>
                <p className="text-xs font-semibold uppercase text-white">{field.value}</p>
              </div>
            ))}

            <div className="grid grid-cols-2 gap-1.5">
              <div className="rounded-lg border border-white/25 bg-black/20 p-1.5">
                <p className="mb-1 flex items-center gap-1 uppercase text-[10px] tracking-wide text-slate-200">
                  <FaClock />
                  VALIDADE
                </p>
                <p className="text-xs font-semibold uppercase text-white">{sessionUser.validade ?? "PENDENTE"}</p>
              </div>
              <div className="rounded-lg border border-white/25 bg-black/20 p-1.5">
                <p className="mb-1 flex items-center gap-1 uppercase text-[10px] tracking-wide text-slate-200">
                  <FaIdCard />
                  DATA NASC
                </p>
                <p className="text-xs font-semibold uppercase text-white">{sessionUser.dataNasc}</p>
              </div>
            </div>

            <div className="rounded-lg border border-white/25 bg-black/20 p-1.5">
              <p className="mb-1 flex items-center gap-1 uppercase text-[10px] tracking-wide text-slate-200">
                <FaUserCheck />
                STATUS
              </p>
              <p className="text-xs font-semibold uppercase text-white">{sessionUser.status}</p>
            </div>
          </div>

          <div className="mt-auto flex items-center justify-between rounded-xl bg-black/35 p-3 text-xs">
            <div>
              <p className="font-semibold">SEU CARTAO VIRTUAL</p>
              <p>Valido com documento de identificacao</p>
            </div>
            <FaQrcode className="text-2xl" />
          </div>
          {!sessionUser.cardGenerated && (
            <button className="mt-4 w-full rounded-xl bg-emerald-500 py-2 font-semibold" onClick={onGenerateCard}>
              Gerar Cartao
            </button>
          )}
        </div>
      </div>
    </>
  );
}
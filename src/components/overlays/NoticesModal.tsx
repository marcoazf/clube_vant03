import { NoticesModalProps } from "@/types/props";

export function NoticesModal({ visibleNotices, onClose }: NoticesModalProps) {
  return (
    <div className="fixed inset-0 z-40 bg-slate-950/85 p-4">
      <div className="mx-auto max-h-[82vh] w-full max-w-md overflow-y-auto rounded-2xl border border-slate-700 bg-slate-900 p-4">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-sky-300">Notificacoes</h3>
          <button className="rounded bg-slate-800 px-2 py-1 text-xs" onClick={onClose}>
            Fechar
          </button>
        </div>
        <div className="space-y-3">
          {visibleNotices.length === 0 && <p className="text-xs text-slate-400">Nenhuma novidade no momento.</p>}
          {visibleNotices.map((notice) => (
            <div key={notice.id} className="rounded-xl border border-slate-700 bg-slate-800/70 p-3 text-xs">
              <p className="font-semibold text-slate-100">{notice.titulo}</p>
              <p className="mt-1 text-slate-300">{notice.texto}</p>
              {notice.destaque && <p className="mt-2 text-cyan-300">Destaque: {notice.destaque}</p>}
              {notice.midia && <img src={notice.midia} alt="Midia da novidade" className="mt-2 h-28 w-full rounded-lg object-cover" />}
              {notice.link && (
                <a className="mt-2 inline-block text-sky-300 underline" href={notice.link} target="_blank" rel="noreferrer">
                  Abrir link
                </a>
              )}
              <p className="mt-2 text-[11px] text-slate-400">Publicado por {notice.createdBy} em {new Date(notice.createdAt).toLocaleString("pt-BR")}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
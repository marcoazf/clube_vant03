import { FaExternalLinkAlt, FaHeart, FaSearch } from "react-icons/fa";
import { BenefitsTabProps } from "@/types/props";

export function BenefitsTab({
  visibleBenefits,
  searchBenefits,
  setSearchBenefits,
  benefitFilter,
  setBenefitFilter,
  showCategoryFilter,
  setShowCategoryFilter,
  cidades,
  categorias,
  favoriteIds,
  onToggleFavorite,
}: BenefitsTabProps) {
  return (
    <div className="flex h-[calc(100vh-12rem)] flex-col overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/40">
      <div className="sticky top-0 z-10 space-y-3 border-b border-slate-800 bg-slate-950/95 p-3 backdrop-blur">
        <p className="text-sm text-slate-300">
          Comercios encontrados: <span className="font-semibold text-sky-300">{visibleBenefits.length}</span>
        </p>
        <div className="relative">
          <FaSearch className="pointer-events-none absolute left-3 top-3 text-slate-400" />
          <input className="w-full rounded-xl border border-slate-700 bg-slate-900 p-3 pl-10" placeholder="Buscar comercio, categoria ou beneficio" value={searchBenefits} onChange={(e) => setSearchBenefits(e.target.value)} />
        </div>
        <div className="grid grid-cols-3 gap-2 text-xs">
          <select className="rounded-lg border border-slate-700 bg-slate-900 p-2" value={benefitFilter.ordem} onChange={(e) => setBenefitFilter((v) => ({ ...v, ordem: e.target.value }))}>
            <option value="recentes">Recentes</option>
            <option value="antigos">Antigos</option>
            <option value="az">A-Z</option>
            <option value="za">Z-A</option>
            {favoriteIds.length > 0 && <option value="favoritos">Favoritos</option>}
          </select>
          <select className="rounded-lg border border-slate-700 bg-slate-900 p-2" value={benefitFilter.cidade} onChange={(e) => setBenefitFilter((v) => ({ ...v, cidade: e.target.value }))}>
            <option value="">Cidade</option>
            {cidades.map((city) => (
              <option key={city}>{city}</option>
            ))}
          </select>
          <div className="relative">
            <button className="w-full rounded-lg border border-slate-700 bg-slate-900 p-2 text-left" onClick={() => setShowCategoryFilter((prev) => !prev)}>
              {benefitFilter.categoria || "Categoria"}
            </button>
            {showCategoryFilter && (
              <div className="absolute left-0 top-11 z-20 max-h-[15rem] w-full overflow-y-auto rounded-lg border border-slate-700 bg-slate-900 p-1 scroll-smooth">
                <button
                  className="w-full rounded p-2 text-left hover:bg-slate-800"
                  onClick={() => {
                    setBenefitFilter((v) => ({ ...v, categoria: "" }));
                    setShowCategoryFilter(false);
                  }}
                >
                  Todas
                </button>
                {categorias.map((cat) => (
                  <button
                    key={cat}
                    className="block w-full rounded p-2 text-left hover:bg-slate-800"
                    onClick={() => {
                      setBenefitFilter((v) => ({ ...v, categoria: cat }));
                      setShowCategoryFilter(false);
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="min-h-0 flex-1 space-y-3 overflow-y-auto p-3 scroll-smooth">
        {visibleBenefits.map((c) => {
          const highlight = /([3-9][0-9])%/.test(c.beneficio);
          const isFav = favoriteIds.includes(c.id);
          return (
            <div key={c.id} className={`rounded-2xl border ${highlight ? "border-emerald-500/70" : "border-slate-800"} bg-slate-900/75 p-3`}>
              <div className="mb-1 flex items-center justify-between">
                <p className="font-semibold text-slate-100">{c.razaoSocial}</p>
                <button onClick={() => onToggleFavorite(c.id, isFav)}>
                  <FaHeart className={isFav ? "text-rose-400" : "text-slate-500"} />
                </button>
              </div>
              <p className="text-xs text-slate-400">
                {c.cidade}/{c.estado} - <span className="font-semibold text-fuchsia-300">{c.categoria}</span>
              </p>
              <p className="mt-1 text-sm text-emerald-300">{c.beneficio}</p>
              <p className="mt-1 text-xs text-slate-300">{c.endereco}</p>
              <p className="mt-1 text-xs text-slate-400">{c.saibaMais}</p>
              {c.linkLoja && (
                <a href={c.linkLoja} target="_blank" rel="noreferrer" className="mt-1 inline-flex items-center gap-1 text-xs text-sky-300 underline">
                  Acessar loja <FaExternalLinkAlt />
                </a>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
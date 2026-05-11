import { useMemo, useState } from "react";
import { FaDownload } from "react-icons/fa";
import { UF_LIST } from "@/constants/app";
import { ConfigTabProps } from "@/types/props";
import { maskCNPJ } from "@/utils/app-formatters";

export function ConfigTab({
  sessionUser,
  db,
  setDb,
  setToast,
  passwordInUse,
  sindicatoForm,
  setSindicatoForm,
  editingSindicatoId,
  setEditingSindicatoId,
  addSindicato,
  removeSindicato,
  comercioForm,
  setComercioForm,
  editingComercioId,
  setEditingComercioId,
  addComercio,
  removeComercio,
  newCategory,
  setNewCategory,
  novidadeForm,
  setNovidadeForm,
  publishNovidade,
  exportData,
  showAdminPasswords,
  setShowAdminPasswords,
}: ConfigTabProps) {
  const [birthdayFilters, setBirthdayFilters] = useState({ role: "todos", month: "", sindicatoId: "", cidade: "" });
  const [raffleCount, setRaffleCount] = useState(1);
  const [raffleResults, setRaffleResults] = useState<Array<{ nome: string; cardId: string; sindicato: string; cidade: string; estado: string }>>([]);

  const monthOptions = [
    "Janeiro",
    "Fevereiro",
    "Marco",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ];

  const birthdayRows = useMemo(() => {
    const targetUsers = db.users.filter((u) => u.role === "empresa" || u.role === "colaborador");
    const rows = targetUsers
      .filter((u) => (birthdayFilters.role === "todos" ? true : u.role === birthdayFilters.role))
      .filter((u) => (birthdayFilters.month ? new Date(u.dataNasc).getMonth() === Number(birthdayFilters.month) : true))
      .filter((u) => (birthdayFilters.sindicatoId ? u.sindicatoId === birthdayFilters.sindicatoId : true))
      .filter((u) => (birthdayFilters.cidade ? u.cidade === birthdayFilters.cidade : true))
      .map((u) => {
        const sind = db.sindicatos.find((s) => s.id === u.sindicatoId);
        return {
          nome: u.nome,
          tipo: u.role === "empresa" ? "Empresa" : "Colaborador",
          dataNasc: u.dataNasc,
          sindicato: sind?.nome ?? "Nao definido",
          cidadeEstado: `${u.cidade} / ${u.estado}`,
        };
      })
      .sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"));

    return rows;
  }, [db.users, db.sindicatos, birthdayFilters]);

  const downloadContent = (content: string, extension: string, mime: string, prefix: string) => {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${prefix}.${extension}`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const drawAsImage = (title: string, lines: string[], fileName: string) => {
    const canvas = document.createElement("canvas");
    const width = 1200;
    const lineHeight = 34;
    const height = Math.max(500, 170 + lines.length * lineHeight);
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = "#020617";
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = "#e2e8f0";
    ctx.font = "bold 34px Inter, sans-serif";
    ctx.fillText(title, 48, 68);
    ctx.font = "20px Inter, sans-serif";
    ctx.fillStyle = "#38bdf8";
    lines.forEach((line, index) => ctx.fillText(line, 48, 120 + index * lineHeight));

    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${fileName}.jpg`;
      link.click();
      URL.revokeObjectURL(url);
    }, "image/jpeg", 0.92);
  };

  const exportBirthdayList = (format: "pdf" | "jpg" | "xml" | "json" | "xls") => {
    const lines = birthdayRows.map((row, index) => `${index + 1}. ${row.nome} - ${row.tipo} - ${row.dataNasc} - ${row.sindicato} - ${row.cidadeEstado}`);

    if (format === "json") {
      downloadContent(JSON.stringify(birthdayRows, null, 2), "json", "application/json", "aniversariantes");
      return;
    }
    if (format === "xml") {
      const xml = `<aniversariantes>${birthdayRows
        .map((row, index) => `<item><ordem>${index + 1}</ordem><nome>${row.nome}</nome><tipo>${row.tipo}</tipo><data>${row.dataNasc}</data><sindicato>${row.sindicato}</sindicato><cidadeEstado>${row.cidadeEstado}</cidadeEstado></item>`)
        .join("")}</aniversariantes>`;
      downloadContent(xml, "xml", "application/xml", "aniversariantes");
      return;
    }
    if (format === "xls") {
      const xls = ["ordem\tnome\ttipo\tdataNasc\tsindicato\tcidadeEstado", ...birthdayRows.map((row, index) => `${index + 1}\t${row.nome}\t${row.tipo}\t${row.dataNasc}\t${row.sindicato}\t${row.cidadeEstado}`)].join("\n");
      downloadContent(xls, "xls", "application/vnd.ms-excel", "aniversariantes");
      return;
    }
    if (format === "jpg") {
      drawAsImage("Lista de Aniversariantes", lines, "aniversariantes");
      return;
    }
    downloadContent(`Lista de Aniversariantes\n\n${lines.join("\n")}`, "pdf", "application/pdf", "aniversariantes");
  };

  const shareBirthdayList = async () => {
    const text = birthdayRows.map((row, index) => `${index + 1}. ${row.nome} - ${row.tipo} - ${row.dataNasc} - ${row.cidadeEstado}`).join("\n");
    if (navigator.share) {
      await navigator.share({ title: "Lista de Aniversariantes", text });
      return;
    }
    downloadContent(text, "txt", "text/plain;charset=utf-8", "aniversariantes");
  };

  const runRaffle = () => {
    const pool = db.users.filter((u) => u.cardId || u.id);
    if (pool.length === 0) return;
    const shuffled = [...pool].sort(() => Math.random() - 0.5).slice(0, Math.min(Math.max(1, raffleCount), pool.length));
    const data = shuffled.map((u) => {
      const sind = db.sindicatos.find((s) => s.id === u.sindicatoId);
      return {
        nome: u.nome,
        cardId: u.cardId ?? u.id,
        sindicato: sind?.nome ?? "Nao definido",
        cidade: u.cidade,
        estado: u.estado,
      };
    });
    setRaffleResults(data);
  };

  const exportRaffle = (format: "pdf" | "jpg") => {
    const lines = raffleResults.map((item, index) => `${index + 1}. ${item.nome} - ID ${item.cardId} - ${item.sindicato} - ${item.cidade} / ${item.estado}`);
    if (format === "jpg") {
      drawAsImage("Resultado de Sorteio", lines, "sorteio");
      return;
    }
    downloadContent(`Resultado de Sorteio\n\n${lines.join("\n")}`, "pdf", "application/pdf", "sorteio");
  };

  const shareRaffle = async () => {
    const text = raffleResults.map((item, index) => `${index + 1}. ${item.nome} - ID ${item.cardId} - ${item.cidade} / ${item.estado}`).join("\n");
    if (navigator.share) {
      await navigator.share({ title: "Resultado de Sorteio", text });
      return;
    }
    downloadContent(text, "txt", "text/plain;charset=utf-8", "sorteio");
  };

  return (
    <div className="space-y-4">
      {/*
        Centro administrativo por perfil:
        - Adm: cadastro de sindicatos/comercios.
        - Master Adm: inclui dashboard e exportacoes.
        - Desenvolvedor: inclui governanca total, inclusive senhas internas.
        Estrutura separada por blocos para adicao de modulos sem efeito colateral.
      */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
        <h3 className="mb-2 text-sm font-semibold text-sky-300">Cadastrar Sindicato</h3>
        <form onSubmit={addSindicato} className="space-y-2">
          <input required className="w-full rounded-lg border border-slate-700 bg-slate-900 p-2" placeholder="Nome do sindicato" value={sindicatoForm.nome} onChange={(e) => setSindicatoForm((v) => ({ ...v, nome: e.target.value }))} />
          <div className="grid grid-cols-2 gap-2">
            <input required className="rounded-lg border border-slate-700 bg-slate-900 p-2" placeholder="Cidade" value={sindicatoForm.cidade} onChange={(e) => setSindicatoForm((v) => ({ ...v, cidade: e.target.value }))} />
            <select required className="rounded-lg border border-slate-700 bg-slate-900 p-2" value={sindicatoForm.estado} onChange={(e) => setSindicatoForm((v) => ({ ...v, estado: e.target.value }))}>
              <option value="">UF</option>
              {UF_LIST.map((uf) => (
                <option key={uf}>{uf}</option>
              ))}
            </select>
          </div>
          <button className="w-full rounded-lg bg-sky-600 py-2 text-sm">{editingSindicatoId ? "Atualizar sindicato" : "Salvar sindicato"}</button>
        </form>
        <div className="mt-3 space-y-2">
          {db.sindicatos.map((s) => (
            <div key={s.id} className="flex items-center justify-between rounded-lg bg-slate-800 p-2 text-xs">
              <p>
                {s.nome} - {s.cidade}/{s.estado}
              </p>
              <div className="flex gap-2">
                <button
                  className="rounded bg-slate-700 px-2 py-1"
                  onClick={() => {
                    setEditingSindicatoId(s.id);
                    setSindicatoForm({ nome: s.nome, cidade: s.cidade, estado: s.estado });
                  }}
                >
                  Editar
                </button>
                <button className="rounded bg-rose-700 px-2 py-1" onClick={() => removeSindicato(s.id)}>
                  Excluir
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
        <h3 className="mb-2 text-sm font-semibold text-sky-300">Cadastrar Comercio Conveniado</h3>
        <form onSubmit={addComercio} className="space-y-2">
          <select required className="w-full rounded-lg border border-slate-700 bg-slate-900 p-2" value={comercioForm.sindicatoId} onChange={(e) => setComercioForm((v) => ({ ...v, sindicatoId: e.target.value }))}>
            <option value="">Sindicato</option>
            {db.sindicatos.map((s) => (
              <option key={s.id} value={s.id}>
                {s.nome}
              </option>
            ))}
          </select>
          <input required className="w-full rounded-lg border border-slate-700 bg-slate-900 p-2" placeholder="Razao social" value={comercioForm.razaoSocial} onChange={(e) => setComercioForm((v) => ({ ...v, razaoSocial: e.target.value }))} />
          <input required className="w-full rounded-lg border border-slate-700 bg-slate-900 p-2" placeholder="Endereco" value={comercioForm.endereco} onChange={(e) => setComercioForm((v) => ({ ...v, endereco: e.target.value }))} />
          <div className="grid grid-cols-2 gap-2">
            <input required className="rounded-lg border border-slate-700 bg-slate-900 p-2" placeholder="Cidade" value={comercioForm.cidade} onChange={(e) => setComercioForm((v) => ({ ...v, cidade: e.target.value }))} />
            <select required className="rounded-lg border border-slate-700 bg-slate-900 p-2" value={comercioForm.estado} onChange={(e) => setComercioForm((v) => ({ ...v, estado: e.target.value }))}>
              <option value="">UF</option>
              {UF_LIST.map((uf) => (
                <option key={uf}>{uf}</option>
              ))}
            </select>
          </div>
          <input required className="w-full rounded-lg border border-slate-700 bg-slate-900 p-2" placeholder="CNPJ" value={comercioForm.cnpj} onChange={(e) => setComercioForm((v) => ({ ...v, cnpj: maskCNPJ(e.target.value) }))} />
          <select required className="w-full rounded-lg border border-slate-700 bg-slate-900 p-2" value={comercioForm.categoria} onChange={(e) => setComercioForm((v) => ({ ...v, categoria: e.target.value }))}>
            <option value="">Categoria</option>
            {db.categorias.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
          <input required className="w-full rounded-lg border border-slate-700 bg-slate-900 p-2" placeholder="Beneficio" value={comercioForm.beneficio} onChange={(e) => setComercioForm((v) => ({ ...v, beneficio: e.target.value }))} />
          <input required className="w-full rounded-lg border border-slate-700 bg-slate-900 p-2" placeholder="Saiba mais" value={comercioForm.saibaMais} onChange={(e) => setComercioForm((v) => ({ ...v, saibaMais: e.target.value }))} />
          <input className="w-full rounded-lg border border-slate-700 bg-slate-900 p-2" placeholder="Link da loja" value={comercioForm.linkLoja} onChange={(e) => setComercioForm((v) => ({ ...v, linkLoja: e.target.value }))} />
          <button className="w-full rounded-lg bg-indigo-600 py-2 text-sm">{editingComercioId ? "Atualizar comercio" : "Salvar comercio"}</button>
        </form>

        <div className="mt-4 flex gap-2">
          <input className="w-full rounded-lg border border-slate-700 bg-slate-900 p-2" placeholder="Nova categoria" value={newCategory} onChange={(e) => setNewCategory(e.target.value)} />
          <button
            className="rounded-lg bg-emerald-600 px-3"
            onClick={() => {
              if (!newCategory) return;
              setDb((prev) => ({ ...prev, categorias: [...new Set([...prev.categorias, newCategory])] }));
              setNewCategory("");
            }}
          >
            +
          </button>
        </div>

        <div className="mt-3 space-y-2">
          {db.comercios.map((c) => (
            <div key={c.id} className="rounded-lg bg-slate-800 p-2 text-xs">
              <div className="flex items-center justify-between gap-2">
                <p>
                  {c.razaoSocial} - {c.cidade}/{c.estado}
                </p>
                <div className="flex gap-2">
                  <button
                    className="rounded bg-slate-700 px-2 py-1"
                    onClick={() => {
                      setEditingComercioId(c.id);
                      setComercioForm({
                        sindicatoId: c.sindicatoId,
                        razaoSocial: c.razaoSocial,
                        endereco: c.endereco,
                        cidade: c.cidade,
                        estado: c.estado,
                        cnpj: c.cnpj,
                        categoria: c.categoria,
                        beneficio: c.beneficio,
                        saibaMais: c.saibaMais,
                        linkLoja: c.linkLoja ?? "",
                      });
                    }}
                  >
                    Editar
                  </button>
                  <button className="rounded bg-rose-700 px-2 py-1" onClick={() => removeComercio(c.id)}>
                    Excluir
                  </button>
                </div>
              </div>
              <p className="text-slate-400">{c.beneficio}</p>
            </div>
          ))}
        </div>
      </div>

      {(sessionUser.role === "adm" || sessionUser.role === "masteradm" || sessionUser.role === "desenvolvedor") && (
        <div className="rounded-2xl border border-cyan-700/40 bg-slate-900/80 p-4">
          <h3 className="mb-2 text-sm font-semibold text-cyan-300">Novidades</h3>
          <form onSubmit={publishNovidade} className="space-y-2">
            <label className="flex items-center gap-2 text-xs">
              <input type="checkbox" checked={novidadeForm.paraTodos} onChange={(e) => setNovidadeForm((prev) => ({ ...prev, paraTodos: e.target.checked }))} />
              Publicar para todas as cidades e sindicatos
            </label>
            {!novidadeForm.paraTodos && (
              <>
                <select required className="w-full rounded-lg border border-slate-700 bg-slate-900 p-2 text-xs" value={novidadeForm.sindicatoId} onChange={(e) => setNovidadeForm((prev) => ({ ...prev, sindicatoId: e.target.value }))}>
                  <option value="">Sindicato alvo</option>
                  {db.sindicatos.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.nome}
                    </option>
                  ))}
                </select>
                <input required className="w-full rounded-lg border border-slate-700 bg-slate-900 p-2 text-xs" placeholder="Cidade alvo" value={novidadeForm.cidade} onChange={(e) => setNovidadeForm((prev) => ({ ...prev, cidade: e.target.value }))} />
              </>
            )}
            <input required className="w-full rounded-lg border border-slate-700 bg-slate-900 p-2 text-xs" placeholder="Titulo" value={novidadeForm.titulo} onChange={(e) => setNovidadeForm((prev) => ({ ...prev, titulo: e.target.value }))} />
            <textarea required className="w-full rounded-lg border border-slate-700 bg-slate-900 p-2 text-xs" placeholder="Texto da novidade" value={novidadeForm.texto} onChange={(e) => setNovidadeForm((prev) => ({ ...prev, texto: e.target.value }))} />
            <input className="w-full rounded-lg border border-slate-700 bg-slate-900 p-2 text-xs" placeholder="Link" value={novidadeForm.link} onChange={(e) => setNovidadeForm((prev) => ({ ...prev, link: e.target.value }))} />
            <input className="w-full rounded-lg border border-slate-700 bg-slate-900 p-2 text-xs" placeholder="URL de midia" value={novidadeForm.midia} onChange={(e) => setNovidadeForm((prev) => ({ ...prev, midia: e.target.value }))} />
            <input className="w-full rounded-lg border border-slate-700 bg-slate-900 p-2 text-xs" placeholder="Frase de destaque" value={novidadeForm.destaque} onChange={(e) => setNovidadeForm((prev) => ({ ...prev, destaque: e.target.value }))} />
            <button className="w-full rounded-lg bg-cyan-600 py-2 text-sm">Publicar novidade</button>
          </form>
        </div>
      )}

      {(sessionUser.role === "masteradm" || sessionUser.role === "desenvolvedor") && (
        <div className="rounded-2xl border border-emerald-700/40 bg-slate-900/80 p-4">
          <h3 className="mb-3 text-sm font-semibold text-emerald-300">Dashboard e Exportacao</h3>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="rounded-lg bg-slate-800 p-2">Usuarios: {db.users.length}</div>
            <div className="rounded-lg bg-slate-800 p-2">Sindicatos: {db.sindicatos.length}</div>
            <div className="rounded-lg bg-slate-800 p-2">Cidades: {[...new Set(db.users.map((u) => u.cidade))].length}</div>
            <div className="rounded-lg bg-slate-800 p-2">Comercios: {db.comercios.length}</div>
          </div>
          <p className="mt-3 text-xs text-slate-300">
            Aniversariantes do mes: {db.users.filter((u) => new Date(u.dataNasc).getMonth() === new Date().getMonth()).map((u) => u.nome).join(", ") || "Nenhum"}
          </p>
          <div className="mt-3 flex gap-2">
            <button className="rounded-lg bg-sky-700 px-3 py-1 text-xs" onClick={() => exportData("json")}>
              <FaDownload className="inline" /> JSON
            </button>
            <button className="rounded-lg bg-sky-700 px-3 py-1 text-xs" onClick={() => exportData("csv")}>
              <FaDownload className="inline" /> CSV
            </button>
            <button className="rounded-lg bg-sky-700 px-3 py-1 text-xs" onClick={() => exportData("xml")}>
              <FaDownload className="inline" /> XML
            </button>
          </div>
        </div>
      )}

      {sessionUser.role === "desenvolvedor" && (
        <div className="rounded-2xl border border-violet-700/40 bg-slate-900/80 p-4">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-violet-300">Controle de Senhas Internas</h3>
            <button className="rounded bg-slate-700 px-2 py-1 text-xs" onClick={() => setShowAdminPasswords((prev) => !prev)}>
              {showAdminPasswords ? "Ocultar" : "Mostrar"}
            </button>
          </div>
          {db.users
            .filter((u) => ["desenvolvedor", "masteradm", "adm"].includes(u.role))
            .map((u) => (
              <div key={u.id} className="mb-2 flex items-center gap-2">
                <p className="w-24 text-xs">{u.accessLabel}</p>
                <input
                  type={showAdminPasswords ? "text" : "password"}
                  className="w-full rounded-lg border border-slate-700 bg-slate-900 p-2 text-xs"
                  defaultValue={u.senha}
                  onBlur={(e) => {
                    const newPass = e.target.value.trim();
                    if (newPass.length < 5 || passwordInUse(newPass, u.id)) {
                      setToast("Senha invalida ou repetida.");
                      return;
                    }
                    setDb((prev) => ({ ...prev, users: prev.users.map((item) => (item.id === u.id ? { ...item, senha: newPass } : item)) }));
                  }}
                />
              </div>
            ))}
        </div>
      )}

      {(sessionUser.role === "masteradm" || sessionUser.role === "desenvolvedor") && (
        <div className="rounded-2xl border border-slate-700 bg-slate-900/80 p-4">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-200">Gestao de Usuarios</h3>
            <button className="rounded bg-slate-700 px-2 py-1 text-xs" onClick={() => setShowAdminPasswords((prev) => !prev)}>
              {showAdminPasswords ? "Ocultar" : "Mostrar"}
            </button>
          </div>
          <div className="mb-2 flex gap-2">
            <button
              className="rounded bg-rose-700 px-3 py-1 text-xs"
              onClick={() => {
                if (!confirm("Remover todos colaboradores e empresas?")) return;
                setDb((prev) => ({ ...prev, users: prev.users.filter((u) => ["desenvolvedor", "masteradm", "adm"].includes(u.role)) }));
                setToast("Remocao em massa concluida.");
              }}
            >
              Remover em massa
            </button>
          </div>
          <div className="space-y-2">
            {db.users
              .filter((u) => (sessionUser.role === "masteradm" ? u.role !== "desenvolvedor" : true))
              .map((u) => (
                <div key={u.id} className="rounded-lg bg-slate-800 p-2 text-xs">
                  <p className="mb-2">
                    {u.nome} ({u.accessLabel})
                  </p>
                  <div className="flex items-center gap-2">
                    <input
                      type={showAdminPasswords ? "text" : "password"}
                      className="w-full rounded border border-slate-700 bg-slate-900 p-1"
                      defaultValue={u.senha}
                      onBlur={(e) => {
                        const pass = e.target.value.trim();
                        if (pass.length < 5 || passwordInUse(pass, u.id)) {
                          setToast("Senha invalida ou duplicada.");
                          return;
                        }
                        setDb((prev) => ({ ...prev, users: prev.users.map((item) => (item.id === u.id ? { ...item, senha: pass } : item)) }));
                      }}
                    />
                    <button
                      className={`rounded px-2 py-1 ${u.status === "ativo" ? "bg-emerald-700" : "bg-amber-700"}`}
                      onClick={() => setDb((prev) => ({ ...prev, users: prev.users.map((item) => (item.id === u.id ? { ...item, status: item.status === "ativo" ? "inativo" : "ativo" } : item)) }))}
                    >
                      {u.status === "ativo" ? "Ativo" : "Inativo"}
                    </button>
                    <button
                      className="rounded bg-rose-700 px-2 py-1"
                      onClick={() => {
                        if (["desenvolvedor", "masteradm", "adm"].includes(u.role) && sessionUser.role !== "desenvolvedor") return;
                        if (!confirm("Confirmar exclusao do usuario?")) return;
                        setDb((prev) => ({ ...prev, users: prev.users.filter((item) => item.id !== u.id) }));
                      }}
                    >
                      Excluir
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      <div className="rounded-2xl border border-cyan-800/50 bg-slate-900/80 p-4">
        <h3 className="mb-3 text-sm font-semibold text-cyan-300">Gerar Lista de Aniversariantes</h3>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <select className="rounded border border-slate-700 bg-slate-900 p-2" value={birthdayFilters.role} onChange={(e) => setBirthdayFilters((prev) => ({ ...prev, role: e.target.value }))}>
            <option value="todos">Empresa e Colaborador</option>
            <option value="empresa">Empresa</option>
            <option value="colaborador">Colaborador</option>
          </select>
          <select className="rounded border border-slate-700 bg-slate-900 p-2" value={birthdayFilters.month} onChange={(e) => setBirthdayFilters((prev) => ({ ...prev, month: e.target.value }))}>
            <option value="">Mes</option>
            {monthOptions.map((month, index) => (
              <option key={month} value={index}>
                {month}
              </option>
            ))}
          </select>
          <select className="rounded border border-slate-700 bg-slate-900 p-2" value={birthdayFilters.sindicatoId} onChange={(e) => setBirthdayFilters((prev) => ({ ...prev, sindicatoId: e.target.value }))}>
            <option value="">Sindicato</option>
            {db.sindicatos.map((s) => (
              <option key={s.id} value={s.id}>
                {s.nome}
              </option>
            ))}
          </select>
          <select className="rounded border border-slate-700 bg-slate-900 p-2" value={birthdayFilters.cidade} onChange={(e) => setBirthdayFilters((prev) => ({ ...prev, cidade: e.target.value }))}>
            <option value="">Cidade</option>
            {[...new Set(db.users.map((u) => u.cidade))].sort((a, b) => a.localeCompare(b, "pt-BR")).map((city) => (
              <option key={city}>{city}</option>
            ))}
          </select>
        </div>

        <div className="mt-3 max-h-48 space-y-1 overflow-y-auto rounded-lg border border-slate-700 bg-slate-950/60 p-2 text-xs">
          {birthdayRows.length === 0 && <p className="text-slate-400">Nenhum aniversariante para o filtro selecionado.</p>}
          {birthdayRows.map((row, index) => (
            <p key={`${row.nome}-${index}`} className="rounded bg-slate-800 px-2 py-1 text-slate-200">
              {index + 1}. {row.nome} - {row.tipo} - {row.dataNasc} - {row.sindicato} - {row.cidadeEstado}
            </p>
          ))}
        </div>

        <div className="mt-3 flex flex-wrap gap-2 text-xs">
          <button className="rounded bg-cyan-700 px-3 py-1" onClick={shareBirthdayList}>Compartilhar</button>
          <button className="rounded bg-slate-700 px-3 py-1" onClick={() => exportBirthdayList("pdf")}>PDF</button>
          <button className="rounded bg-slate-700 px-3 py-1" onClick={() => exportBirthdayList("jpg")}>JPG</button>
          <button className="rounded bg-slate-700 px-3 py-1" onClick={() => exportBirthdayList("xml")}>XML</button>
          <button className="rounded bg-slate-700 px-3 py-1" onClick={() => exportBirthdayList("json")}>JSON</button>
          <button className="rounded bg-slate-700 px-3 py-1" onClick={() => exportBirthdayList("xls")}>XLS</button>
        </div>
      </div>

      <div className="rounded-2xl border border-fuchsia-800/50 bg-slate-900/80 p-4">
        <h3 className="mb-3 text-sm font-semibold text-fuchsia-300">Sistema de Sorteio por ID</h3>
        <div className="flex gap-2 text-xs">
          <input type="number" min={1} className="w-full rounded border border-slate-700 bg-slate-900 p-2" value={raffleCount} onChange={(e) => setRaffleCount(Number(e.target.value || 1))} />
          <button className="rounded bg-fuchsia-700 px-3 py-1" onClick={runRaffle}>Sortear</button>
        </div>

        <div className="mt-3 max-h-48 space-y-1 overflow-y-auto rounded-lg border border-slate-700 bg-slate-950/60 p-2 text-xs">
          {raffleResults.length === 0 && <p className="text-slate-400">Ainda nao houve sorteio.</p>}
          {raffleResults.map((item, index) => (
            <p key={`${item.cardId}-${index}`} className="rounded bg-slate-800 px-2 py-1 text-slate-200">
              {index + 1}. {item.nome} - ID {item.cardId} - {item.sindicato} - {item.cidade} / {item.estado}
            </p>
          ))}
        </div>

        <div className="mt-3 flex flex-wrap gap-2 text-xs">
          <button className="rounded bg-fuchsia-700 px-3 py-1" onClick={shareRaffle}>Compartilhar</button>
          <button className="rounded bg-slate-700 px-3 py-1" onClick={() => exportRaffle("jpg")}>Salvar JPG</button>
          <button className="rounded bg-slate-700 px-3 py-1" onClick={() => exportRaffle("pdf")}>Salvar PDF</button>
        </div>
      </div>
    </div>
  );
}
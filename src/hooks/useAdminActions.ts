import { Dispatch, FormEvent, SetStateAction } from "react";
import { AppDB, Novidade, Role, User } from "@/types/app";
import { ComercioForm, ExportFormat, NovidadeForm, SindicatoForm } from "@/types/forms";
import { uid } from "@/utils/app-formatters";

interface UseAdminActionsParams {
  db: AppDB;
  setDb: Dispatch<SetStateAction<AppDB>>;
  setToast: Dispatch<SetStateAction<string>>;
  sessionUser: User | null;
  addLog: (actor: string, role: Role, action: string) => void;
  sindicatoForm: SindicatoForm;
  setSindicatoForm: Dispatch<SetStateAction<SindicatoForm>>;
  editingSindicatoId: string | null;
  setEditingSindicatoId: Dispatch<SetStateAction<string | null>>;
  comercioForm: ComercioForm;
  setComercioForm: Dispatch<SetStateAction<ComercioForm>>;
  editingComercioId: string | null;
  setEditingComercioId: Dispatch<SetStateAction<string | null>>;
  novidadeForm: NovidadeForm;
  setNovidadeForm: Dispatch<SetStateAction<NovidadeForm>>;
}

export function useAdminActions({
  db,
  setDb,
  setToast,
  sessionUser,
  addLog,
  sindicatoForm,
  setSindicatoForm,
  editingSindicatoId,
  setEditingSindicatoId,
  comercioForm,
  setComercioForm,
  editingComercioId,
  setEditingComercioId,
  novidadeForm,
  setNovidadeForm,
}: UseAdminActionsParams) {
  const playNotificationTone = () => {
    try {
      const AudioContextClass = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextClass) return;

      const ctx = new AudioContextClass();
      const now = ctx.currentTime;
      const sequence = [880, 1174, 988];

      sequence.forEach((freq, index) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.value = freq;
        osc.connect(gain);
        gain.connect(ctx.destination);

        const start = now + index * 0.12;
        gain.gain.setValueAtTime(0.0001, start);
        gain.gain.exponentialRampToValueAtTime(0.12, start + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.09);

        osc.start(start);
        osc.stop(start + 0.1);
      });

      setTimeout(() => {
        void ctx.close();
      }, 600);
    } catch {
      // Silent fallback when browser blocks autoplay audio.
    }
  };

  const publishNovidade = (event: FormEvent) => {
    event.preventDefault();
    if (!sessionUser) return;

    const notice: Novidade = {
      id: uid(),
      createdBy: sessionUser.nome,
      sindicatoId: novidadeForm.paraTodos ? "" : novidadeForm.sindicatoId,
      cidade: novidadeForm.paraTodos ? "" : novidadeForm.cidade,
      paraTodos: novidadeForm.paraTodos,
      titulo: novidadeForm.titulo,
      texto: novidadeForm.texto,
      link: novidadeForm.link,
      midia: novidadeForm.midia,
      destaque: novidadeForm.destaque,
      createdAt: new Date().toISOString(),
    };

    setDb((prev) => ({ ...prev, novidades: [notice, ...prev.novidades] }));
    setNovidadeForm({ sindicatoId: "", cidade: "", paraTodos: false, titulo: "", texto: "", link: "", midia: "", destaque: "" });
    setToast("Novidade publicada com sucesso.");
    if (sessionUser.role === "adm" || sessionUser.role === "masteradm") {
      playNotificationTone();
    }
  };

  const exportData = (format: ExportFormat) => {
    let text = "";
    if (format === "json") text = JSON.stringify(db, null, 2);
    if (format === "csv") {
      text = [
        "nome,email,role,cidade,estado,sindicato,createdAt",
        ...db.users.map((u) => `${u.nome},${u.email},${u.role},${u.cidade},${u.estado},${u.sindicatoId},${u.createdAt}`),
      ].join("\n");
    }
    if (format === "xml") {
      text = `<users>${db.users
        .map((u) => `<user><nome>${u.nome}</nome><email>${u.email}</email><role>${u.role}</role><cidade>${u.cidade}</cidade></user>`)
        .join("")}</users>`;
    }
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `abref-export.${format}`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const addSindicato = (event: FormEvent) => {
    event.preventDefault();
    if (!sessionUser) return;

    if (editingSindicatoId) {
      setDb((prev) => ({
        ...prev,
        sindicatos: prev.sindicatos.map((s) => (s.id === editingSindicatoId ? { ...s, ...sindicatoForm } : s)),
      }));
      addLog(sessionUser.nome, sessionUser.role, `Sindicato ${sindicatoForm.nome} editado`);
      setToast("Sindicato atualizado.");
      setEditingSindicatoId(null);
    } else {
      const sindicato = { id: uid(), ...sindicatoForm, createdBy: sessionUser.role };
      setDb((prev) => ({ ...prev, sindicatos: [...prev.sindicatos, sindicato] }));
      addLog(sessionUser.nome, sessionUser.role, `Sindicato ${sindicato.nome} cadastrado`);
      setToast("Sindicato cadastrado.");
    }

    setSindicatoForm({ nome: "", cidade: "", estado: "" });
  };

  const addComercio = (event: FormEvent) => {
    event.preventDefault();
    if (!sessionUser) return;

    if (editingComercioId) {
      setDb((prev) => ({
        ...prev,
        comercios: prev.comercios.map((c) => (c.id === editingComercioId ? { ...c, ...comercioForm } : c)),
      }));
      addLog(sessionUser.nome, sessionUser.role, `Comercio ${comercioForm.razaoSocial} editado`);
      setToast("Comercio atualizado.");
      setEditingComercioId(null);
    } else {
      const comercio = { id: uid(), ...comercioForm, createdAt: new Date().toISOString() };
      setDb((prev) => ({ ...prev, comercios: [...prev.comercios, comercio] }));
      addLog(sessionUser.nome, sessionUser.role, `Comercio ${comercio.razaoSocial} cadastrado`);
      setToast("Comercio cadastrado.");
    }

    setComercioForm({ sindicatoId: "", razaoSocial: "", endereco: "", cidade: "", estado: "", cnpj: "", categoria: "", beneficio: "", saibaMais: "", linkLoja: "" });
  };

  const removeSindicato = (id: string) => {
    if (!sessionUser || !confirm("Confirma excluir sindicato?")) return;
    setDb((prev) => ({ ...prev, sindicatos: prev.sindicatos.filter((s) => s.id !== id) }));
    addLog(sessionUser.nome, sessionUser.role, `Sindicato removido: ${id}`);
  };

  const removeComercio = (id: string) => {
    if (!sessionUser || !confirm("Confirma excluir comercio?")) return;
    setDb((prev) => ({ ...prev, comercios: prev.comercios.filter((c) => c.id !== id) }));
    addLog(sessionUser.nome, sessionUser.role, `Comercio removido: ${id}`);
  };

  return {
    publishNovidade,
    exportData,
    addSindicato,
    addComercio,
    removeSindicato,
    removeComercio,
  };
}
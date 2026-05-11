import { ChangeEvent, Dispatch, SetStateAction } from "react";
import { AppDB, BeforeInstallPromptEvent, Role, Tab, User } from "@/types/app";

type Stage = "intro" | "auth" | "gate" | "app";

interface UseUserActionsParams {
  sessionUser: User | null;
  setDb: Dispatch<SetStateAction<AppDB>>;
  setToast: Dispatch<SetStateAction<string>>;
  addLog: (actor: string, role: Role, action: string) => void;
  visibleNoticeIds: string[];
  setShowNotices: Dispatch<SetStateAction<boolean>>;
  deferredInstall: BeforeInstallPromptEvent | null;
  setDeferredInstall: Dispatch<SetStateAction<BeforeInstallPromptEvent | null>>;
  setSessionUserId: Dispatch<SetStateAction<string | null>>;
  setStage: Dispatch<SetStateAction<Stage>>;
  setActiveTab: Dispatch<SetStateAction<Tab>>;
  showElegantPopup: (message: string, durationMs: number) => void;
}

export function useUserActions({
  sessionUser,
  setDb,
  setToast,
  addLog,
  visibleNoticeIds,
  setShowNotices,
  deferredInstall,
  setDeferredInstall,
  setSessionUserId,
  setStage,
  setActiveTab,
  showElegantPopup,
}: UseUserActionsParams) {
  const setCurrentUser = (updater: (user: User) => User) => {
    if (!sessionUser) return;
    setDb((prev) => ({ ...prev, users: prev.users.map((u) => (u.id === sessionUser.id ? updater(u) : u)) }));
  };

  const openNotices = () => {
    setShowNotices(true);
    if (!sessionUser) return;
    setCurrentUser((user) => ({ ...user, readNotices: [...new Set([...user.readNotices, ...visibleNoticeIds])] }));
  };

  const generateCard = () => {
    if (!sessionUser) return;
    if (sessionUser.cardGenerated) {
      setToast("Cartao ja gerado para este perfil.");
      return;
    }
    /*
      Regra de emissao de cartao:
      O cartao e gerado uma unica vez por usuario no prototipo.
      ID aleatorio de 7 digitos e validade de 1 ano a partir da emissao.
    */
    const validade = new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().slice(0, 10);
    setCurrentUser((user) => ({ ...user, cardGenerated: true, cardId: String(Math.floor(1000000 + Math.random() * 9000000)), validade }));
    addLog(sessionUser.nome, sessionUser.role, "Cartao virtual gerado");
    setToast("Cartao gerado com sucesso.");
    showElegantPopup("Cartao Gerado com Sucesso", 4000);
  };

  const installPwa = async () => {
    if (!deferredInstall) return;
    await deferredInstall.prompt();
    setDeferredInstall(null);
  };

  const logout = () => {
    if (!sessionUser) return;
    if (!confirm("Deseja realmente sair da aplicacao?")) return;
    addLog(sessionUser.nome, sessionUser.role, "Logout efetuado");
    setSessionUserId(null);
    setStage("auth");
    setActiveTab("home");
  };

  const updatePhoto = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setCurrentUser((user) => ({ ...user, foto: String(reader.result) }));
      setToast("Foto atualizada.");
    };
    reader.readAsDataURL(file);
  };

  return { setCurrentUser, openNotices, generateCard, installPwa, logout, updatePhoto };
}
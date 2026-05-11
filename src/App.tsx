import { useEffect, useRef, useState } from "react";
import {
  FaCog,
  FaGift,
  FaHome,
  FaStar,
  FaUser,
} from "react-icons/fa";
import { NoticesModal } from "@/components/overlays/NoticesModal";
import { SecureMaskOverlay } from "@/components/overlays/SecureMaskOverlay";
import { ElegantPopup } from "@/components/overlays/ElegantPopup";
import { BottomNav } from "@/components/layout/BottomNav";
import { LoggedAreaFrame } from "@/components/layout/LoggedAreaFrame";
import { BenefitsTab } from "@/components/tabs/BenefitsTab";
import { ConfigTab } from "@/components/tabs/ConfigTab";
import { ExclusiveTab } from "@/components/tabs/ExclusiveTab";
import { HomeTab } from "@/components/tabs/HomeTab";
import { ProfileTab } from "@/components/tabs/ProfileTab";
import { AuthScreen } from "@/components/screens/AuthScreen";
import { GateScreen } from "@/components/screens/GateScreen";
import { IntroScreen } from "@/components/screens/IntroScreen";
import { SESSION_KEY } from "@/constants/app";
import { bootstrapDB } from "@/data/bootstrap";
import { useAutoDismissToast } from "@/hooks/useAutoDismissToast";
import { useAuthActions } from "@/hooks/useAuthActions";
import { useBenefits } from "@/hooks/useBenefits";
import { useClock } from "@/hooks/useClock";
import { useIntroStage } from "@/hooks/useIntroStage";
import { useAdminActions } from "@/hooks/useAdminActions";
import { useNotices } from "@/hooks/useNotices";
import { useDbPersistence, useSessionPersistence } from "@/hooks/usePersistence";
import { usePwaSecurityEvents } from "@/hooks/usePwaSecurityEvents";
import { useUserActions } from "@/hooks/useUserActions";
import { useViewport } from "@/hooks/useViewport";
import { AppDB, BeforeInstallPromptEvent, Role, Tab } from "@/types/app";
import { AuthMode, BenefitFilter, ComercioForm, LoginData, NovidadeForm, RegisterData, RegisterRole, SindicatoForm, Stage } from "@/types/forms";
import { BottomNavItem } from "@/types/props";
import { uid } from "@/utils/app-formatters";

export default function App() {
  /*
    Orquestrador principal da SPA:
    - Mantem dados e sessao em estado unico para simplificar o prototipo.
    - Espelha persistencia em LocalStorage para operacao offline.
    - Controla o ciclo visual Intro -> Auth -> Gate -> App.
    Em futura migracao para backend, os setters centrais podem ser trocados
    por chamadas de API sem alterar o restante da interface.
  */
  const [db, setDb] = useState<AppDB>(() => bootstrapDB());
  const [sessionUserId, setSessionUserId] = useState<string | null>(() => localStorage.getItem(SESSION_KEY));
  const [authMode, setAuthMode] = useState<AuthMode>("login");
  const [stage, setStage] = useState<Stage>("intro");
  const [activeTab, setActiveTab] = useState<Tab>("home");
  const clock = useClock();
  const [toast, setToast] = useState<string>("");
  const [secureMask, setSecureMask] = useState(false);
  const [deferredInstall, setDeferredInstall] = useState<BeforeInstallPromptEvent | null>(null);

  const [loginData, setLoginData] = useState<LoginData>({ identifier: "", senha: "" });
  const [forgotValue, setForgotValue] = useState("");
  const [registerRole, setRegisterRole] = useState<RegisterRole>("empresa");
  const [registerData, setRegisterData] = useState<RegisterData>({
    sindicatoId: "",
    razaoSocial: "",
    nome: "",
    dataNasc: "",
    cnpj: "",
    cpf: "",
    cidade: "",
    estado: "",
    whatsapp: "",
    email: "",
    senha: "",
  });

  const [sindicatoForm, setSindicatoForm] = useState<SindicatoForm>({ nome: "", cidade: "", estado: "" });
  const [editingSindicatoId, setEditingSindicatoId] = useState<string | null>(null);
  const [comercioForm, setComercioForm] = useState<ComercioForm>({
    sindicatoId: "",
    razaoSocial: "",
    endereco: "",
    cidade: "",
    estado: "",
    cnpj: "",
    categoria: "",
    beneficio: "",
    saibaMais: "",
    linkLoja: "",
  });
  const [editingComercioId, setEditingComercioId] = useState<string | null>(null);
  const [newCategory, setNewCategory] = useState("");
  const [searchBenefits, setSearchBenefits] = useState("");
  const [benefitFilter, setBenefitFilter] = useState<BenefitFilter>({ cidade: "", categoria: "", ordem: "recentes" });
  const [showCategoryFilter, setShowCategoryFilter] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const viewport = useViewport();
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showAdminPasswords, setShowAdminPasswords] = useState(false);
  const [showNotices, setShowNotices] = useState(false);
  const [novidadeForm, setNovidadeForm] = useState<NovidadeForm>({ sindicatoId: "", cidade: "", paraTodos: false, titulo: "", texto: "", link: "", midia: "", destaque: "" });
  const [elegantPopup, setElegantPopup] = useState<{ id: number; message: string; durationMs: number } | null>(null);

  const sessionUser = db.users.find((u) => u.id === sessionUserId) ?? null;
  const privileged = sessionUser && ["desenvolvedor", "masteradm", "adm"].includes(sessionUser.role);

  useDbPersistence(db);
  useSessionPersistence(sessionUserId);
  useIntroStage(sessionUserId, setStage);
  useAutoDismissToast(toast, setToast);
  usePwaSecurityEvents({ setDeferredInstall, setSecureMask, setToast });

  useEffect(() => {
    if (!elegantPopup) return;
    const timeout = setTimeout(() => setElegantPopup(null), elegantPopup.durationMs);
    return () => clearTimeout(timeout);
  }, [elegantPopup]);

  const showElegantPopup = (message: string, durationMs: number) => {
    setElegantPopup({ id: Date.now(), message, durationMs });
  };

  const addLog = (actor: string, role: Role, action: string) => {
    setDb((prev) => ({ ...prev, logs: [{ id: uid(), actor, role, action, timestamp: new Date().toISOString() }, ...prev.logs] }));
  };

  const passwordInUse = (senha: string, ignoreId?: string) => db.users.some((user) => user.senha === senha && user.id !== ignoreId);

  const { handleLogin, handleForgot, handleRegister } = useAuthActions({
    db,
    setDb,
    loginData,
    setLoginData,
    forgotValue,
    registerRole,
    registerData,
    setRegisterData,
    setToast,
    setSessionUserId,
    setStage,
    setAuthMode,
    addLog,
    passwordInUse,
    showElegantPopup,
  });

  const currentSyndicate = sessionUser ? db.sindicatos.find((s) => s.id === sessionUser.sindicatoId) ?? null : null;
  const { visibleNotices, unreadCount } = useNotices({ novidades: db.novidades, sessionUser });
  const { visibleBenefits, cities } = useBenefits({
    comercios: db.comercios,
    searchBenefits,
    benefitFilter,
    sessionUser,
  });

  const { setCurrentUser, openNotices, generateCard, installPwa, logout, updatePhoto } = useUserActions({
    sessionUser,
    setDb,
    setToast,
    addLog,
    visibleNoticeIds: visibleNotices.map((notice) => notice.id),
    setShowNotices,
    deferredInstall,
    setDeferredInstall,
    setSessionUserId,
    setStage,
    setActiveTab,
    showElegantPopup,
  });


  const { publishNovidade, exportData, addSindicato, addComercio, removeSindicato, removeComercio } = useAdminActions({
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
  });

  if (stage === "intro") return <IntroScreen viewport={viewport} />;

  if (stage === "gate" && sessionUser) return <GateScreen accessLabel={sessionUser.accessLabel} />;

  if (stage === "auth") {
    return (
      <AuthScreen
        viewport={viewport}
        authMode={authMode}
        setAuthMode={setAuthMode}
        loginData={loginData}
        setLoginData={setLoginData}
        showLoginPassword={showLoginPassword}
        toggleLoginPassword={() => setShowLoginPassword((prev) => !prev)}
        forgotValue={forgotValue}
        setForgotValue={setForgotValue}
        registerRole={registerRole}
        setRegisterRole={setRegisterRole}
        registerData={registerData}
        setRegisterData={setRegisterData}
        showRegisterPassword={showRegisterPassword}
        toggleRegisterPassword={() => setShowRegisterPassword((prev) => !prev)}
        sindicatos={[...db.sindicatos].sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"))}
        toast={toast}
        onLoginSubmit={handleLogin}
        onRegisterSubmit={handleRegister}
        onForgotPassword={handleForgot}
      />
    );
  }

  if (!sessionUser) return null;

  const navItems: BottomNavItem[] = [
    { id: "home" as Tab, icon: <FaHome />, label: "Home" },
    { id: "beneficios" as Tab, icon: <FaGift />, label: "Beneficios" },
    { id: "exclusivo" as Tab, icon: <FaStar />, label: "Exclusivo" },
    { id: "perfil" as Tab, icon: <FaUser />, label: "Perfil" },
    ...(privileged ? [{ id: "config" as Tab, icon: <FaCog />, label: "Config" }] : []),
  ];

  return (
    <>
      <LoggedAreaFrame viewport={viewport} activeTab={activeTab}>
            {activeTab === "home" && (
              <HomeTab
                sessionUser={sessionUser}
                currentSyndicate={currentSyndicate}
                clock={clock}
                unreadCount={unreadCount}
                deferredInstall={deferredInstall}
                onOpenNotices={openNotices}
                onInstallPwa={installPwa}
                onToggleSecureMask={() => setSecureMask((v) => !v)}
                onLogout={logout}
                onGenerateCard={generateCard}
              />
            )}

            {activeTab === "beneficios" && (
              <BenefitsTab
                visibleBenefits={visibleBenefits}
                searchBenefits={searchBenefits}
                setSearchBenefits={setSearchBenefits}
                benefitFilter={benefitFilter}
                setBenefitFilter={setBenefitFilter}
                showCategoryFilter={showCategoryFilter}
                setShowCategoryFilter={setShowCategoryFilter}
                cidades={cities}
                categorias={[...db.categorias].sort((a, b) => a.localeCompare(b, "pt-BR"))}
                favoriteIds={sessionUser.favoritos}
                onToggleFavorite={(comercioId, isFav) =>
                  setCurrentUser((u) => ({
                    ...u,
                    favoritos: isFav ? u.favoritos.filter((id) => id !== comercioId) : [...u.favoritos, comercioId],
                  }))
                }
              />
            )}

            {activeTab === "exclusivo" && <ExclusiveTab />}

            {activeTab === "perfil" && (
              <ProfileTab
                sessionUser={sessionUser}
                currentSyndicate={currentSyndicate}
                fileInputRef={fileInputRef}
                updatePhoto={updatePhoto}
                setCurrentUser={setCurrentUser}
                logsCount={db.logs.filter((log) => log.actor === sessionUser.nome).length}
                setToast={setToast}
              />
            )}

            {activeTab === "config" && privileged && (
              <ConfigTab
                sessionUser={sessionUser}
                db={db}
                setDb={setDb}
                setToast={setToast}
                passwordInUse={passwordInUse}
                sindicatoForm={sindicatoForm}
                setSindicatoForm={setSindicatoForm}
                editingSindicatoId={editingSindicatoId}
                setEditingSindicatoId={setEditingSindicatoId}
                addSindicato={addSindicato}
                removeSindicato={removeSindicato}
                comercioForm={comercioForm}
                setComercioForm={setComercioForm}
                editingComercioId={editingComercioId}
                setEditingComercioId={setEditingComercioId}
                addComercio={addComercio}
                removeComercio={removeComercio}
                newCategory={newCategory}
                setNewCategory={setNewCategory}
                novidadeForm={novidadeForm}
                setNovidadeForm={setNovidadeForm}
                publishNovidade={publishNovidade}
                exportData={exportData}
                showAdminPasswords={showAdminPasswords}
                setShowAdminPasswords={setShowAdminPasswords}
              />
            )}
      </LoggedAreaFrame>

      <BottomNav items={navItems} activeTab={activeTab} onChange={setActiveTab} />

      {showNotices && <NoticesModal visibleNotices={visibleNotices} onClose={() => setShowNotices(false)} />}

      {secureMask && <SecureMaskOverlay onDisable={() => setSecureMask(false)} />}

      <ElegantPopup key={elegantPopup?.id ?? 0} isOpen={Boolean(elegantPopup)} message={elegantPopup?.message ?? ""} />

      {toast && <div className="fixed bottom-24 left-1/2 z-40 -translate-x-1/2 rounded-lg bg-slate-100 px-4 py-2 text-xs text-slate-900">{toast}</div>}
    </>
  );
}

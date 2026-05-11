import { ChangeEvent, Dispatch, FormEvent, ReactNode, RefObject, SetStateAction } from "react";
import { AppDB, BeforeInstallPromptEvent, Comercio, Novidade, Sindicato, Tab, User } from "@/types/app";
import { AuthMode, BenefitFilter, ComercioForm, ExportFormat, LoginData, NovidadeForm, RegisterData, RegisterRole, SindicatoForm } from "@/types/forms";

export interface Viewport {
  width: number;
  height: number;
}

export interface IntroScreenProps {
  viewport: Viewport;
}

export interface GateScreenProps {
  accessLabel: string;
}

export interface AuthScreenProps {
  viewport: Viewport;
  authMode: AuthMode;
  setAuthMode: (mode: AuthMode) => void;
  loginData: LoginData;
  setLoginData: Dispatch<SetStateAction<LoginData>>;
  showLoginPassword: boolean;
  toggleLoginPassword: () => void;
  forgotValue: string;
  setForgotValue: (value: string) => void;
  registerRole: RegisterRole;
  setRegisterRole: (role: RegisterRole) => void;
  registerData: RegisterData;
  setRegisterData: Dispatch<SetStateAction<RegisterData>>;
  showRegisterPassword: boolean;
  toggleRegisterPassword: () => void;
  sindicatos: Sindicato[];
  toast: string;
  onLoginSubmit: (event: FormEvent) => void;
  onRegisterSubmit: (event: FormEvent) => void;
  onForgotPassword: () => void;
}

export interface HomeTabProps {
  sessionUser: User;
  currentSyndicate: Sindicato | null;
  clock: Date;
  unreadCount: number;
  deferredInstall: BeforeInstallPromptEvent | null;
  onOpenNotices: () => void;
  onInstallPwa: () => void;
  onToggleSecureMask: () => void;
  onLogout: () => void;
  onGenerateCard: () => void;
}

export interface BenefitsTabProps {
  visibleBenefits: Comercio[];
  searchBenefits: string;
  setSearchBenefits: (value: string) => void;
  benefitFilter: BenefitFilter;
  setBenefitFilter: Dispatch<SetStateAction<BenefitFilter>>;
  showCategoryFilter: boolean;
  setShowCategoryFilter: Dispatch<SetStateAction<boolean>>;
  cidades: string[];
  categorias: string[];
  favoriteIds: string[];
  onToggleFavorite: (comercioId: string, isFav: boolean) => void;
}

export interface ProfileTabProps {
  sessionUser: User;
  currentSyndicate: Sindicato | null;
  fileInputRef: RefObject<HTMLInputElement | null>;
  updatePhoto: (event: ChangeEvent<HTMLInputElement>) => void;
  setCurrentUser: (updater: (user: User) => User) => void;
  logsCount: number;
  setToast: Dispatch<SetStateAction<string>>;
}

export interface ConfigTabProps {
  sessionUser: User;
  db: AppDB;
  setDb: Dispatch<SetStateAction<AppDB>>;
  setToast: Dispatch<SetStateAction<string>>;
  passwordInUse: (senha: string, ignoreId?: string) => boolean;
  sindicatoForm: SindicatoForm;
  setSindicatoForm: Dispatch<SetStateAction<SindicatoForm>>;
  editingSindicatoId: string | null;
  setEditingSindicatoId: Dispatch<SetStateAction<string | null>>;
  addSindicato: (event: FormEvent) => void;
  removeSindicato: (id: string) => void;
  comercioForm: ComercioForm;
  setComercioForm: Dispatch<SetStateAction<ComercioForm>>;
  editingComercioId: string | null;
  setEditingComercioId: Dispatch<SetStateAction<string | null>>;
  addComercio: (event: FormEvent) => void;
  removeComercio: (id: string) => void;
  newCategory: string;
  setNewCategory: Dispatch<SetStateAction<string>>;
  novidadeForm: NovidadeForm;
  setNovidadeForm: Dispatch<SetStateAction<NovidadeForm>>;
  publishNovidade: (event: FormEvent) => void;
  exportData: (format: ExportFormat) => void;
  showAdminPasswords: boolean;
  setShowAdminPasswords: Dispatch<SetStateAction<boolean>>;
}

export interface BottomNavItem {
  id: Tab;
  icon: ReactNode;
  label: string;
}

export interface BottomNavProps {
  items: BottomNavItem[];
  activeTab: Tab;
  onChange: (tab: Tab) => void;
}

export interface LoggedAreaFrameProps {
  viewport: Viewport;
  activeTab: Tab;
  children: ReactNode;
}

export interface NoticesModalProps {
  visibleNotices: Novidade[];
  onClose: () => void;
}

export interface SecureMaskOverlayProps {
  onDisable: () => void;
}
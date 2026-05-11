export type Role = "desenvolvedor" | "masteradm" | "adm" | "empresa" | "colaborador";
export type Tab = "home" | "beneficios" | "exclusivo" | "perfil" | "config";

export interface User {
  id: string;
  role: Role;
  accessLabel: string;
  nome: string;
  email: string;
  whatsapp: string;
  senha: string;
  dataNasc: string;
  cidade: string;
  estado: string;
  sindicatoId: string;
  razaoSocial?: string;
  cnpj?: string;
  cpf?: string;
  foto?: string;
  cardId?: string;
  cardGenerated: boolean;
  createdAt: string;
  validade?: string;
  favoritos: string[];
  status: "ativo" | "inativo";
  readNotices: string[];
}

export interface Sindicato {
  id: string;
  nome: string;
  cidade: string;
  estado: string;
  createdBy: Role;
}

export interface Comercio {
  id: string;
  sindicatoId: string;
  razaoSocial: string;
  endereco: string;
  cidade: string;
  estado: string;
  cnpj: string;
  categoria: string;
  beneficio: string;
  saibaMais: string;
  linkLoja?: string;
  createdAt: string;
}

export interface ActionLog {
  id: string;
  actor: string;
  role: Role;
  action: string;
  timestamp: string;
}

export interface Novidade {
  id: string;
  createdBy: string;
  sindicatoId: string;
  cidade: string;
  paraTodos: boolean;
  titulo: string;
  texto: string;
  link: string;
  midia: string;
  destaque: string;
  createdAt: string;
}

export interface AppDB {
  users: User[];
  sindicatos: Sindicato[];
  comercios: Comercio[];
  categorias: string[];
  logs: ActionLog[];
  novidades: Novidade[];
}

export interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}
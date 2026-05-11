export type Stage = "intro" | "auth" | "gate" | "app";
export type AuthMode = "login" | "cadastro";
export type RegisterRole = "empresa" | "colaborador";
export type ExportFormat = "json" | "csv" | "xml";

export interface LoginData {
  identifier: string;
  senha: string;
}

export interface RegisterData {
  sindicatoId: string;
  razaoSocial: string;
  nome: string;
  dataNasc: string;
  cnpj: string;
  cpf: string;
  cidade: string;
  estado: string;
  whatsapp: string;
  email: string;
  senha: string;
}

export interface SindicatoForm {
  nome: string;
  cidade: string;
  estado: string;
}

export interface ComercioForm {
  sindicatoId: string;
  razaoSocial: string;
  endereco: string;
  cidade: string;
  estado: string;
  cnpj: string;
  categoria: string;
  beneficio: string;
  saibaMais: string;
  linkLoja: string;
}

export interface NovidadeForm {
  sindicatoId: string;
  cidade: string;
  paraTodos: boolean;
  titulo: string;
  texto: string;
  link: string;
  midia: string;
  destaque: string;
}

export interface BenefitFilter {
  cidade: string;
  categoria: string;
  ordem: string;
}
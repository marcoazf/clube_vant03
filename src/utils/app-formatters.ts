import { Role } from "@/types/app";

export const uid = () => `${Date.now()}${Math.floor(Math.random() * 9999)}`;

const maskDigits = (value: string) => value.replace(/\D/g, "");

export const maskCNPJ = (value: string) => {
  const digits = maskDigits(value).slice(0, 14);
  return digits
    .replace(/^(\d{2})(\d)/, "$1.$2")
    .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1/$2")
    .replace(/(\d{4})(\d)/, "$1-$2");
};

export const maskCPF = (value: string) => {
  const digits = maskDigits(value).slice(0, 11);
  return digits.replace(/^(\d{3})(\d)/, "$1.$2").replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3").replace(/\.(\d{3})(\d)/, ".$1-$2");
};

export const maskWhatsapp = (value: string) => {
  const digits = maskDigits(value).slice(0, 11);
  if (digits.length <= 10) return digits.replace(/^(\d{2})(\d)/, "($1) $2").replace(/(\d{4})(\d)/, "$1-$2");
  return digits.replace(/^(\d{2})(\d)/, "($1) $2").replace(/(\d{5})(\d)/, "$1-$2");
};

export const cardTheme = (role: Role) => {
  if (role === "empresa") return "from-amber-500 via-yellow-700 to-amber-950";
  if (role === "colaborador") return "from-sky-500 via-blue-700 to-indigo-950";
  if (role === "desenvolvedor") return "from-violet-500 via-indigo-700 to-slate-950";
  if (role === "masteradm") return "from-emerald-500 via-cyan-700 to-slate-950";
  return "from-orange-500 via-red-700 to-slate-950";
};
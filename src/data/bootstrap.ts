import { DB_KEY, DEFAULT_CATEGORIES } from "@/constants/app";
import { AppDB, Comercio, Sindicato, User } from "@/types/app";

/*
  Base local de dados do prototipo:
  Mantem colecoes separadas para facilitar migracao futura para API/DB,
  preservando contratos simples de leitura/escrita.
*/
export const bootstrapDB = (): AppDB => {
  const raw = localStorage.getItem(DB_KEY);
  if (raw) {
    const parsed = JSON.parse(raw) as Partial<AppDB>;
    const users = (parsed.users ?? []).map((user) => ({
      ...user,
      status: user.status ?? "ativo",
      readNotices: user.readNotices ?? [],
    })) as User[];

    return {
      users,
      sindicatos: parsed.sindicatos ?? [],
      comercios: parsed.comercios ?? [],
      categorias: parsed.categorias ?? DEFAULT_CATEGORIES,
      logs: parsed.logs ?? [],
      novidades: parsed.novidades ?? [],
    };
  }

  const seedSindicatos: Sindicato[] = [
    { id: "s1", nome: "Sindicato ABREF", cidade: "Cuiaba", estado: "MT", createdBy: "masteradm" },
  ];
  const now = new Date().toISOString();

  const seedUsers: User[] = [
    {
      id: "u-dev",
      role: "desenvolvedor",
      accessLabel: "Desenvolvedor",
      nome: "Usuario Desenvolvedor",
      email: "desenvolvedor@abref.local",
      whatsapp: "55999990001",
      senha: "dev1357",
      dataNasc: "1990-01-10",
      cidade: "Cuiaba",
      estado: "MT",
      sindicatoId: "s1",
      cardGenerated: false,
      createdAt: now,
      favoritos: [],
      status: "ativo",
      readNotices: [],
    },
    {
      id: "u-master",
      role: "masteradm",
      accessLabel: "Master Adm",
      nome: "Usuario Master Adm",
      email: "masteradm@abref.local",
      whatsapp: "55999990002",
      senha: "madm135",
      dataNasc: "1988-04-15",
      cidade: "Cuiaba",
      estado: "MT",
      sindicatoId: "s1",
      cardGenerated: false,
      createdAt: now,
      favoritos: [],
      status: "ativo",
      readNotices: [],
    },
    {
      id: "u-adm",
      role: "adm",
      accessLabel: "Adm",
      nome: "Usuario Adm",
      email: "adm@abref.local",
      whatsapp: "55999990003",
      senha: "adm12345",
      dataNasc: "1992-08-21",
      cidade: "Cuiaba",
      estado: "MT",
      sindicatoId: "s1",
      cardGenerated: false,
      createdAt: now,
      favoritos: [],
      status: "ativo",
      readNotices: [],
    },
  ];

  const seedComercios: Comercio[] = [
    {
      id: "c1",
      sindicatoId: "s1",
      razaoSocial: "Loja Central MT",
      endereco: "Av. Brasil, 1200",
      cidade: "Cuiaba",
      estado: "MT",
      cnpj: "05525650000168",
      categoria: "Moda",
      beneficio: "25% OFF em toda linha casual",
      saibaMais: "Valido para compras acima de R$ 100.",
      createdAt: now,
    },
    {
      id: "c2",
      sindicatoId: "s1",
      razaoSocial: "Saude Prime",
      endereco: "Rua das Flores, 85",
      cidade: "Cuiaba",
      estado: "MT",
      cnpj: "11223344000199",
      categoria: "Clinica",
      beneficio: "40% OFF em consulta inicial",
      saibaMais: "Agendamento via WhatsApp com codigo ABREF.",
      createdAt: now,
    },
  ];

  return {
    users: seedUsers,
    sindicatos: seedSindicatos,
    comercios: seedComercios,
    categorias: DEFAULT_CATEGORIES,
    logs: [],
    novidades: [],
  };
};
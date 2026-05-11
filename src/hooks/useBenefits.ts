import { useMemo } from "react";
import { Comercio, User } from "@/types/app";
import { BenefitFilter } from "@/types/forms";

interface UseBenefitsParams {
  comercios: Comercio[];
  searchBenefits: string;
  benefitFilter: BenefitFilter;
  sessionUser: User | null;
}

export function useBenefits({ comercios, searchBenefits, benefitFilter, sessionUser }: UseBenefitsParams) {
  const visibleBenefits = useMemo(() => {
    /*
      Motor de busca e filtro local:
      Concentra regras de descoberta de beneficios em um unico ponto,
      facilitando evolucao para filtros server-side no futuro.
    */
    let data = [...comercios];
    if (searchBenefits) {
      const term = searchBenefits.toLowerCase();
      data = data.filter((c) => [c.razaoSocial, c.categoria, c.beneficio].join(" ").toLowerCase().includes(term));
    }
    if (benefitFilter.cidade) data = data.filter((c) => c.cidade === benefitFilter.cidade);
    if (benefitFilter.categoria) data = data.filter((c) => c.categoria === benefitFilter.categoria);
    if (benefitFilter.ordem === "recentes") data.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
    if (benefitFilter.ordem === "antigos") data.sort((a, b) => +new Date(a.createdAt) - +new Date(b.createdAt));
    if (benefitFilter.ordem === "az") data.sort((a, b) => a.razaoSocial.localeCompare(b.razaoSocial));
    if (benefitFilter.ordem === "za") data.sort((a, b) => b.razaoSocial.localeCompare(a.razaoSocial));
    if (benefitFilter.ordem === "favoritos" && sessionUser) data = data.filter((c) => sessionUser.favoritos.includes(c.id));
    return data;
  }, [comercios, searchBenefits, benefitFilter, sessionUser]);

  const cities = useMemo(() => [...new Set(comercios.map((c) => c.cidade))], [comercios]);

  return { visibleBenefits, cities };
}
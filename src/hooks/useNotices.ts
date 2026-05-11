import { useMemo } from "react";
import { Novidade, User } from "@/types/app";

interface UseNoticesParams {
  novidades: Novidade[];
  sessionUser: User | null;
}

export function useNotices({ novidades, sessionUser }: UseNoticesParams) {
  const visibleNotices = useMemo(() => {
    if (!sessionUser) return [];
    return novidades.filter((notice) => {
      if (notice.paraTodos) return true;
      const matchSindicato = notice.sindicatoId ? notice.sindicatoId === sessionUser.sindicatoId : true;
      const matchCidade = notice.cidade ? notice.cidade.toLowerCase() === sessionUser.cidade.toLowerCase() : true;
      return matchSindicato && matchCidade;
    });
  }, [novidades, sessionUser]);

  const unreadCount = sessionUser ? visibleNotices.filter((notice) => !sessionUser.readNotices.includes(notice.id)).length : 0;

  return { visibleNotices, unreadCount };
}
import { useEffect } from "react";
import { DB_KEY, SESSION_KEY } from "@/constants/app";

export function useDbPersistence<T>(db: T) {
  useEffect(() => {
    localStorage.setItem(DB_KEY, JSON.stringify(db));
  }, [db]);
}

export function useSessionPersistence(sessionUserId: string | null) {
  useEffect(() => {
    if (sessionUserId) localStorage.setItem(SESSION_KEY, sessionUserId);
    else localStorage.removeItem(SESSION_KEY);
  }, [sessionUserId]);

  useEffect(() => {
    const onBeforeUnload = () => {
      localStorage.removeItem(SESSION_KEY);
    };

    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, []);
}
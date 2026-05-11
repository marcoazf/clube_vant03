import { useEffect } from "react";

type Stage = "intro" | "auth" | "gate" | "app";

export function useIntroStage(sessionUserId: string | null, setStage: (stage: Stage) => void) {
  useEffect(() => {
    const introTimer = setTimeout(() => setStage(sessionUserId ? "app" : "auth"), 3400);
    return () => clearTimeout(introTimer);
  }, [sessionUserId, setStage]);
}
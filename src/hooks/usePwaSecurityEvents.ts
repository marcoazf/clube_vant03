import { Dispatch, SetStateAction, useEffect } from "react";
import { BeforeInstallPromptEvent } from "@/types/app";

interface UsePwaSecurityEventsParams {
  setDeferredInstall: Dispatch<SetStateAction<BeforeInstallPromptEvent | null>>;
  setSecureMask: Dispatch<SetStateAction<boolean>>;
  setToast: Dispatch<SetStateAction<string>>;
}

export function usePwaSecurityEvents({ setDeferredInstall, setSecureMask, setToast }: UsePwaSecurityEventsParams) {
  useEffect(() => {
    const onBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setDeferredInstall(event as BeforeInstallPromptEvent);
    };

    const onPrintScreen = (event: KeyboardEvent) => {
      if (event.key === "PrintScreen") {
        setSecureMask(true);
        setToast("Modo seguro ativado: captura bloqueada visualmente.");
      }
    };

    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    window.addEventListener("keydown", onPrintScreen);
    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
      window.removeEventListener("keydown", onPrintScreen);
    };
  }, [setDeferredInstall, setSecureMask, setToast]);
}
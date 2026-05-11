import { Dispatch, SetStateAction, useEffect } from "react";

export function useAutoDismissToast(toast: string, setToast: Dispatch<SetStateAction<string>>) {
  useEffect(() => {
    if (!toast) return;
    const timeout = setTimeout(() => setToast(""), 2600);
    return () => clearTimeout(timeout);
  }, [toast, setToast]);
}
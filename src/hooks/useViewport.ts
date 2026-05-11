import { useEffect, useState } from "react";

interface Viewport {
  width: number;
  height: number;
}

export function useViewport(): Viewport {
  const [viewport, setViewport] = useState<Viewport>({ width: window.innerWidth, height: window.innerHeight });

  useEffect(() => {
    const onResize = () => setViewport({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return viewport;
}
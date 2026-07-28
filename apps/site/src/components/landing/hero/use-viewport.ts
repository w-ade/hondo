"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Breakpoint hook. The hero renders genuinely different component trees per
 * viewport rather than scaling one layout, so this drives structure, not just
 * styling. Returns null until mounted so SSR and the first client render agree.
 */
export function useMediaQuery(query: string): boolean | null {
  const [matches, setMatches] = useState<boolean | null>(null);

  useEffect(() => {
    const mql = window.matchMedia(query);
    const update = () => setMatches(mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, [query]);

  return matches;
}

/** Phone layout. Above this the desktop workspace tree renders. */
export const useIsMobile = () => useMediaQuery("(max-width: 767px)");

export function useReducedMotion(): boolean {
  return useMediaQuery("(prefers-reduced-motion: reduce)") ?? false;
}

/**
 * Scale factor that fits a fixed-width design into its container.
 *
 * Used to show the real desktop workspace, whole, on a phone: the window is
 * laid out at its true size and then scaled down, so every pane, row and label
 * keeps its designed proportion instead of being re-flowed into something else.
 *
 * CSS cannot divide a length by a length to produce the unitless number
 * `scale()` needs, so the factor is measured here.
 */
export function useFitScale(designWidth: number) {
  const [scale, setScale] = useState(0);
  const observer = useRef<ResizeObserver | null>(null);

  // A callback ref, not useRef + useEffect: the host only mounts once the
  // viewport is known to be a phone, which is after this component's mount
  // effect has already run. A callback ref measures the moment the node
  // attaches — during commit, so nothing full-size is ever painted.
  const ref = useCallback(
    (node: HTMLDivElement | null) => {
      observer.current?.disconnect();
      observer.current = null;
      if (!node) return;

      const measure = () => {
        const w = node.clientWidth;
        if (w > 0) setScale(w / designWidth);
      };

      measure();
      const ro = new ResizeObserver(measure);
      ro.observe(node);
      observer.current = ro;
    },
    [designWidth],
  );

  useEffect(() => () => observer.current?.disconnect(), []);

  return { ref, scale };
}

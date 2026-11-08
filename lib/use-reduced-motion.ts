"use client";

import { useSyncExternalStore } from "react";

const query = "(prefers-reduced-motion: reduce)";

function subscribe(onChange: () => void) {
  const media = window.matchMedia(query);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}

const getSnapshot = () => window.matchMedia(query).matches;
const getServerSnapshot = () => false;

/**
 * Use the same snapshot for SSR and the first hydration render, then read the
 * user's preference. Branching on a browser-only value during hydration can
 * replace a whole heading/section and cause React error 418. This also responds
 * when the preference changes while the page is open.
 */
export function useReducedMotion() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

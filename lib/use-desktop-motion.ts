"use client";

import { useSyncExternalStore } from "react";

// Hybrid touch devices also get the static treatment. Keep the server and
// first hydration render static; media changes are applied without remounts.
export const desktopMotionQuery = "(min-width: 640px) and (hover: hover) and (pointer: fine) and (not (any-pointer: coarse)) and (prefers-reduced-motion: no-preference)";

function subscribe(onChange: () => void) {
  const media = window.matchMedia(desktopMotionQuery);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}

const getSnapshot = () => window.matchMedia(desktopMotionQuery).matches;
const getServerSnapshot = () => false;

export function useDesktopMotion() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

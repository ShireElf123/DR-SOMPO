"use client";

import { lazy, Suspense, useSyncExternalStore } from "react";
import { useReducedMotion } from "@/lib/use-reduced-motion";

const Companion = lazy(() => import("./cursor-companion"));
const query = "(pointer: fine)";
const snapshot = () => window.matchMedia(query).matches;
const serverSnapshot = () => false;
function subscribe(listener: () => void) {
  const media = window.matchMedia(query);
  media.addEventListener("change", listener);
  return () => media.removeEventListener("change", listener);
}

/** Decorative desktop code is not part of the initial/mobile download. A live
 * preference change unmounts it, cancelling its RAF and pointer listeners. */
export function Cursor() {
  const fine = useSyncExternalStore(subscribe, snapshot, serverSnapshot);
  const reduce = useReducedMotion();
  return fine && !reduce ? (
    <Suspense fallback={null}>
      <Companion />
    </Suspense>
  ) : null;
}

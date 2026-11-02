"use client";

import { domAnimation, LazyMotion } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Load animation, viewport and gesture features without the unused drag/layout
 * engines. Keep features synchronous: an animation download must never delay
 * readable content or leave the mobile sheet waiting for its renderer.
 *
 * `strict` catches accidental full `motion` imports beneath this provider.
 * Server-rendered sections stay server components when passed as children.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      {children}
    </LazyMotion>
  );
}

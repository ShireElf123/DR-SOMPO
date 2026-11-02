"use client";

import { m, useScroll, useSpring, useTransform } from "framer-motion";
import { useReducedMotion } from "@/lib/use-reduced-motion";

/**
 * Hairline scroll-progress indicator pinned under the nav. Framer sites use this
 * constantly — it costs one compositor transform and makes long pages feel
 * measured rather than open-ended.
 */
export function ScrollProgress() {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const smooth = useSpring(scrollYProgress, { stiffness: 120, damping: 26, restDelta: 0.001 });
  const scaleX = useTransform(smooth, [0, 1], [0, 1]);

  if (reduce) return null;

  return (
    <m.div
      aria-hidden="true"
      style={{ scaleX }}
      className="pointer-events-none fixed inset-x-0 top-0 z-[75] h-[2px] origin-left bg-gradient-to-r from-forest via-fern to-gold"
    />
  );
}

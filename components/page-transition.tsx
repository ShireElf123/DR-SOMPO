"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";

/**
 * Site-wide page transition, modelled on Framer's global wipe:
 *  - outgoing page lifts up and is masked away from the bottom (offset -30%)
 *  - incoming page rises from below (+30%) with the same soft easing
 *  - a forest curtain sweeps across so the swap reads as one gesture
 *  - 0.6s, matching Framer's documented "smooth" preset
 * Under `prefers-reduced-motion` everything is instant — no curtain, no wipe.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const [showCurtain, setShowCurtain] = useState(false);

  useEffect(() => {
    if (reduce) return;
    setShowCurtain(true);
    const id = setTimeout(() => setShowCurtain(false), 640);
    return () => clearTimeout(id);
  }, [pathname, reduce]);

  return (
    <>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={pathname}
          initial={reduce ? undefined : { opacity: 0, y: 28 }}
          animate={reduce ? undefined : { opacity: 1, y: 0 }}
          exit={reduce ? undefined : { opacity: 0, y: -22 }}
          transition={{ duration: 0.62, ease: [0.16, 1, 0.3, 1] }}
        >
          {children}
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>
        {showCurtain && (
          <motion.div
            key={pathname}
            aria-hidden="true"
            className="pointer-events-none fixed inset-0 z-[80] origin-bottom bg-forest"
            initial={{ scaleY: 0 }}
            animate={{ scaleY: [0, 1, 1, 0] }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 0.62,
              times: [0, 0.42, 0.5, 1],
              ease: [0.76, 0, 0.24, 1],
            }}
            style={{ transformOrigin: "bottom" }}
          />
        )}
      </AnimatePresence>
    </>
  );
}

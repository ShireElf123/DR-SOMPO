"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";

/**
 * Site-wide page transition, modelled on Framer's global wipe:
 *  - the outgoing page lifts and fades (offset -30%)
 *  - a forest curtain sweeps up from the bottom, holding for a beat at full
 *    cover so the route swap is never visible
 *  - the incoming page rises from below (+30%) on the same soft curve
 *  - 0.62s in, 0.86s out, matching Framer's documented "smooth" preset
 *
 * The curtain is painted from the page background colour rather than white, so
 * there is no flash between breakpoints. Under `prefers-reduced-motion` the
 * whole thing is bypassed.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const [curtain, setCurtain] = useState(false);

  useEffect(() => {
    if (reduce) return;
    setCurtain(true);
    const id = setTimeout(() => setCurtain(false), 900);
    return () => clearTimeout(id);
  }, [pathname, reduce]);

  return (
    <>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={pathname}
          initial={reduce ? false : { opacity: 0, y: 26 }}
          animate={reduce ? undefined : { opacity: 1, y: 0 }}
          exit={reduce ? undefined : { opacity: 0, y: -18 }}
          transition={{ duration: 0.62, ease: [0.16, 1, 0.3, 1] }}
        >
          {children}
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>
        {curtain && (
          <motion.div
            key={`${pathname}-curtain`}
            aria-hidden="true"
            className="pointer-events-none fixed inset-0 z-[80] origin-bottom bg-forest"
            initial={{ scaleY: 0 }}
            animate={{ scaleY: [0, 1, 1, 0] }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 0.9,
              times: [0, 0.3, 0.46, 1],
              ease: [0.76, 0, 0.24, 1],
            }}
            style={{ transformOrigin: "bottom" }}
          >
            {/* Wordmark ghosted on the curtain so the wipe has a subject. */}
            <span className="absolute inset-0 grid place-items-center">
              <span className="text-[clamp(1.4rem,4vw,2.6rem)] font-light tracking-[-0.04em] text-white/25">
                Dr CM Ngwey-Sompo
              </span>
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

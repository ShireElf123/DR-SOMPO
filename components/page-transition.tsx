"use client";

import { AnimatePresence, m } from "framer-motion";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";

/**
 * The curtain owns the route transition; the content wrapper stays mounted.
 * App Router children update through router context, even inside an exiting
 * AnimatePresence child. Keying that wrapper by pathname mounted the incoming
 * page once in the departing wrapper, then again when its exit completed.
 * That restarted the home hero's entrance and produced a second zoom.
 *
 * Keep the initial presence boundary so server-rendered content is readable
 * before hydration. Only the decorative curtain is keyed and animated out.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const [transition, setTransition] = useState({
    path: pathname,
    active: false,
  });
  if (transition.path !== pathname) {
    setTransition({ path: pathname, active: !reduce });
  } else if (reduce && transition.active) {
    setTransition({ path: pathname, active: false });
  }
  const curtain = transition.active && !reduce;

  useEffect(() => {
    if (!transition.active) return;
    const id = setTimeout(
      () =>
        setTransition((current) =>
          current.path === transition.path
            ? { ...current, active: false }
            : current,
        ),
      900,
    );
    return () => clearTimeout(id);
  }, [transition.path, transition.active]);

  return (
    <>
      <AnimatePresence initial={false}>
        <div key="page-content">{children}</div>
      </AnimatePresence>

      <AnimatePresence>
        {curtain && (
          <m.div
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
          </m.div>
        )}
      </AnimatePresence>
    </>
  );
}

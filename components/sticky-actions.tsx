"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { practice } from "@/lib/practice";

/**
 * A discreet, always-available conversion path. On mobile it becomes a sticky
 * call/enquiry bar — for a medical practice, the phone must never be more than
 * one thumb away.
 */
export function StickyActions() {
  const [visible, setVisible] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 700);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* Mobile action bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 lg:hidden">
        <AnimatePresence>
          {visible && (
            <motion.div
              initial={reduce ? undefined : { y: 80 }}
              animate={reduce ? undefined : { y: 0 }}
              exit={reduce ? undefined : { y: 80 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="mx-3 mb-3 flex items-center gap-2 rounded-2xl border border-forest/10 bg-white/90 p-2 shadow-[0_-8px_40px_-20px_rgba(23,77,60,0.5)] backdrop-blur-xl"
            >
              <a
                href={practice.phoneHref}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-forest/15 py-2.5 text-[0.8125rem] font-medium text-forest"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-forest" aria-hidden="true" />
                Call
              </a>
              <a
                href="#contact"
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-forest py-2.5 text-[0.8125rem] font-medium text-ivory"
              >
                Book an Appointment
              </a>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Desktop back-to-top */}
      <AnimatePresence>
        {visible && (
          <motion.button
            type="button"
            initial={reduce ? undefined : { opacity: 0, scale: 0.9 }}
            animate={reduce ? undefined : { opacity: 1, scale: 1 }}
            exit={reduce ? undefined : { opacity: 0, scale: 0.9 }}
            onClick={() =>
              window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" })
            }
            aria-label="Back to top"
            className="fixed bottom-6 right-6 z-40 hidden h-11 w-11 items-center justify-center rounded-full border border-forest/15 bg-white/90 text-forest shadow-[var(--shadow-lift)] backdrop-blur-xl transition-colors hover:bg-white lg:flex"
          >
            <ArrowUp className="h-4 w-4" aria-hidden="true" />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}

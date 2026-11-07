"use client";

import { BookingLink } from "@/components/booking-link";
import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { AnimatePresence, m } from "framer-motion";
import { useReducedMotion } from "@/lib/use-reduced-motion";
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
      <nav
        aria-label="Quick appointment actions"
        className="fixed inset-x-0 bottom-0 z-50 lg:hidden"
      >
        <AnimatePresence>
          {visible && (
            <m.div
              initial={reduce ? undefined : { y: 80 }}
              animate={reduce ? undefined : { y: 0 }}
              exit={reduce ? undefined : { y: 80 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="glass mx-3 mb-[calc(0.75rem+env(safe-area-inset-bottom))] flex items-center gap-1.5 rounded-full p-1.5"
            >
              <a
                href={practice.phoneHref}
                className="flex flex-1 items-center justify-center gap-2 rounded-full border border-charcoal/12 py-3 text-[12px] font-medium text-ink"
              >
                <span
                  className="h-1.5 w-1.5 rounded-full bg-ember"
                  aria-hidden="true"
                />
                Call
              </a>
              <BookingLink
                className="flex flex-[1.4] items-center justify-center gap-2 rounded-full bg-ember py-3 text-[12px] font-semibold text-cream"
              >
                Book
                <span className="sr-only">an appointment</span>
              </BookingLink>
            </m.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Desktop back-to-top */}
      <AnimatePresence>
        {visible && (
          <m.button
            type="button"
            initial={reduce ? undefined : { opacity: 0, scale: 0.9 }}
            animate={reduce ? undefined : { opacity: 1, scale: 1 }}
            exit={reduce ? undefined : { opacity: 0, scale: 0.9 }}
            onClick={() =>
              window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" })
            }
            aria-label="Back to top"
            className="fixed bottom-6 right-6 z-40 hidden h-11 w-11 items-center justify-center rounded-full border border-charcoal/10 bg-cream text-ink shadow-float transition-colors hover:bg-cream lg:flex"
          >
            <ArrowUp className="h-4 w-4" aria-hidden="true" />
          </m.button>
        )}
      </AnimatePresence>
    </>
  );
}

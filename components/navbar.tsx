"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Menu, Phone, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Logo } from "@/components/logo";
import { nav, practice } from "@/lib/practice";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("#top");
  const reduce = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Highlight the section currently in view.
  useEffect(() => {
    const ids = nav.map((n) => n.href.replace("#", ""));
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));

    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(`#${visible.target.id}`);
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: [0, 0.25, 0.6] },
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  // Lock background scroll while the mobile sheet is open.
  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-colors duration-500",
        scrolled ? "bg-ivory/85 backdrop-blur-xl" : "bg-transparent",
      )}
    >
      <div className="shell">
        <div
          className={cn(
            "flex items-center justify-between gap-6 transition-all duration-500",
            scrolled ? "py-3" : "py-5",
          )}
        >
          <Logo />

          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {nav.map((item) => {
                const isActive = active === item.href;
                return (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      aria-current={isActive ? "true" : undefined}
                      className={cn(
                        "relative rounded-full px-3.5 py-2 text-[0.8125rem] font-medium tracking-[-0.01em] transition-colors duration-300",
                        isActive
                          ? "text-forest"
                          : "text-charcoal/68 hover:text-forest",
                      )}
                    >
                      {isActive && (
                        <motion.span
                          layoutId="nav-pill"
                          className="absolute inset-0 rounded-full bg-sage/70"
                          transition={
                            reduce
                              ? { duration: 0 }
                              : { type: "spring", stiffness: 420, damping: 34 }
                          }
                        />
                      )}
                      <span className="relative flex items-center gap-1.5">
                        {isActive && (
                          <span className="h-1 w-1 rounded-full bg-forest" aria-hidden="true" />
                        )}
                        {item.label}
                      </span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <a
              href={practice.phoneHref}
              className="hidden items-center gap-2 rounded-full border border-forest/15 px-3.5 py-2 text-[0.8125rem] font-medium text-forest transition-colors duration-300 hover:bg-white/70 md:inline-flex"
            >
              <Phone className="h-3.5 w-3.5" aria-hidden="true" />
              {practice.phone}
            </a>
            <a href="#contact" className="btn btn-primary group h-10 px-4 text-[0.8125rem]">
              Book an Appointment
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-ivory/15 transition-transform duration-300 group-hover:rotate-45">
                <ArrowUpRight className="h-3 w-3" />
              </span>
            </a>
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              aria-expanded={open}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-forest/15 text-forest lg:hidden"
            >
              <Menu className="h-4.5 w-4.5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[60] lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div
              className="absolute inset-0 bg-forest-ink/40 backdrop-blur-sm"
              onClick={() => setOpen(false)}
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Site menu"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-x-0 bottom-0 max-h-[92vh] overflow-y-auto rounded-t-[2rem] bg-ivory p-6 pb-10"
            >
              <div className="flex items-center justify-between">
                <Logo />
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close menu"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-forest/15 text-forest"
                >
                  <X className="h-4.5 w-4.5" aria-hidden="true" />
                </button>
              </div>

              <ul className="mt-8 space-y-1">
                {nav.map((item) => (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="flex items-center justify-between border-b border-forest/8 py-3.5 text-[1.375rem] font-medium tracking-[-0.03em] text-forest"
                    >
                      {item.label}
                      <ArrowUpRight className="h-4 w-4 text-forest/52" aria-hidden="true" />
                    </a>
                  </li>
                ))}
              </ul>

              <div className="mt-8 flex flex-col gap-2">
                <a
                  href="#contact"
                  onClick={() => setOpen(false)}
                  className="btn btn-primary w-full"
                >
                  Book an Appointment
                  <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                </a>
                <a href={practice.phoneHref} className="btn btn-ghost w-full">
                  <Phone className="h-4 w-4" aria-hidden="true" />
                  {practice.phone}
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

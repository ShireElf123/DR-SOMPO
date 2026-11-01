"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Menu, Phone, X } from "lucide-react";
import { useEffect, useState } from "react";
import { nav, practice } from "@/lib/practice";
import { cn } from "@/lib/utils";

const left = nav.slice(0, 3);
const right = nav.slice(3);

/** Wordmark: the reference's logotype, centred between two link clusters. */
function Wordmark({ onClick }: { onClick?: () => void }) {
  return (
    <a
      href="#top"
      onClick={onClick}
      className="group flex shrink-0 items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.14em] text-charcoal sm:text-[14px]"
    >
      <span className="relative block h-4 w-4">
        <span className="absolute inset-0 rounded-[50%_14%_50%_14%] bg-forest transition-transform duration-500 group-hover:rotate-45" />
        <span className="absolute left-[7px] top-[7px] h-3 w-3 rounded-[50%_14%_50%_14%] bg-fern/80" />
      </span>
      <span className="hidden xs:inline sm:inline">Dr CM Ngwey-Sompo</span>
      <span className="xs:hidden sm:hidden">Dr Somp</span>
    </a>
  );
}

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("#top");

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

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  const linkClass = (href: string) =>
    cn(
      "rounded-full px-3 py-1.5 text-[13px] transition-colors duration-300",
      active === href ? "text-charcoal" : "text-charcoal/55 hover:text-charcoal",
    );

  return (
    <header className="sticky top-0 z-50 bg-white/85 backdrop-blur-xl">
      <div className="shell">
        <div className="flex items-center justify-between gap-4 py-3">
          <nav aria-label="Primary" className="hidden flex-1 items-center gap-1 md:flex">
            {left.map((item) => (
              <a key={item.href} href={item.href} className={linkClass(item.href)}>
                {item.label}
              </a>
            ))}
          </nav>

          <Wordmark />

          <div className="flex flex-1 items-center justify-end gap-1">
            <nav aria-label="Secondary" className="hidden items-center gap-1 md:flex">
              {right.map((item) => (
                <a key={item.href} href={item.href} className={linkClass(item.href)}>
                  {item.label}
                </a>
              ))}
            </nav>
            <a href="#contact" className="btn ml-1 hidden shrink-0 sm:inline-flex">
              Book an appointment
              <i aria-hidden="true">
                <ArrowUpRight className="h-3 w-3" />
              </i>
            </a>
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              aria-expanded={open}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-charcoal/15 text-charcoal md:hidden"
            >
              <Menu className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      <div className="hairline" />

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[60] md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div
              className="absolute inset-0 bg-charcoal/30 backdrop-blur-sm"
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
              className="absolute inset-x-0 bottom-0 max-h-[92vh] overflow-y-auto rounded-t-[2rem] bg-white p-6 pb-10"
            >
              <div className="flex items-center justify-between">
                <Wordmark onClick={() => setOpen(false)} />
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close menu"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-charcoal/15"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>

              <ul className="mt-6">
                {nav.map((item) => (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="flex items-center justify-between border-b border-charcoal/8 py-3.5 text-[1.25rem] font-light tracking-[-0.02em] text-charcoal"
                    >
                      {item.label}
                      <ArrowUpRight className="h-4 w-4 text-charcoal/30" aria-hidden="true" />
                    </a>
                  </li>
                ))}
              </ul>

              <div className="mt-6 flex flex-col gap-2">
                <a href="#contact" onClick={() => setOpen(false)} className="btn justify-between">
                  Book an appointment
                  <i aria-hidden="true">
                    <ArrowUpRight className="h-3 w-3" />
                  </i>
                </a>
                <a
                  href={practice.phoneHref}
                  className="flex items-center justify-center gap-2 rounded-full border border-charcoal/15 py-2.5 text-[13px] font-medium text-charcoal"
                >
                  <Phone className="h-3.5 w-3.5" aria-hidden="true" />
                  {practice.phone}
                </a>
              </div>

              <p className="mt-6 text-center text-[11px] text-charcoal/40">
                {practice.hospital} · Primrose, Germiston
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </header>
  );
}

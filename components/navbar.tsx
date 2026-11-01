"use client";

import { AnimatePresence, m } from "framer-motion";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { ArrowUpRight, Menu, Phone, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { nav, practice } from "@/lib/practice";
import { cn } from "@/lib/utils";
import { lockScroll, unlockScroll } from "@/components/ui/smooth-scroll";

const left = nav.slice(0, 3);
const right = nav.slice(3);
const EASE = [0.16, 1, 0.3, 1] as const;

/** Wordmark: the reference's logotype, centred between two link clusters. */
function Wordmark({
  onClick,
  compact = false,
}: {
  onClick?: () => void;
  compact?: boolean;
}) {
  return (
    <Link
      href="/"
      onClick={onClick}
      className={cn(
        "group flex shrink-0 items-center gap-2 font-semibold uppercase text-charcoal",
        compact
          ? "text-[11.5px] tracking-[0.1em]"
          : "text-[13px] tracking-[0.14em] sm:text-[14px]",
      )}
    >
      <span className="relative block h-4 w-4 shrink-0">
        <span className="absolute inset-0 rounded-[50%_14%_50%_14%] bg-forest transition-transform duration-500 group-hover:rotate-45" />
        <span className="absolute left-[7px] top-[7px] h-3 w-3 rounded-[50%_14%_50%_14%] bg-fern/80" />
      </span>
      <span className="hidden sm:inline">Dr CM Ngwey-Sompo</span>
      <span className="sm:hidden">Dr Sompo</span>
    </Link>
  );
}

export function Navbar() {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const active = pathname ?? "/";
  const reduce = useReducedMotion();

  // Portals need the DOM. This also guarantees the sheet is never rendered
  // inside the header's own containing block.
  useEffect(() => {
    setMounted(true);
  }, []);

  // Closing on navigation is not enough on its own — the sheet also closes when
  // the route changes from anywhere else (back button, a link inside the sheet).
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    lockScroll();

    closeRef.current?.focus({ preventScroll: true });
    const desktop = window.matchMedia("(min-width: 1024px)");
    const onResize = () => {
      if (desktop.matches) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
      }
      if (event.key !== "Tab") return;
      const controls = dialogRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex="0"]',
      );
      if (!controls?.length) return;
      const first = controls[0];
      const last = controls[controls.length - 1];
      if (!dialogRef.current?.contains(document.activeElement)) {
        event.preventDefault();
        first.focus();
      } else if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    desktop.addEventListener("change", onResize);
    onResize();

    return () => {
      window.removeEventListener("keydown", onKey);
      desktop.removeEventListener("change", onResize);
      unlockScroll();
      if (triggerRef.current?.getClientRects().length) {
        triggerRef.current.focus({ preventScroll: true });
      }
    };
  }, [open]);

  const linkClass = (href: string) =>
    cn(
      "relative rounded-full px-3 py-1.5 text-[13px] transition-colors duration-300",
      active === href ? "bg-ivory text-charcoal" : "text-ink-soft hover:text-charcoal",
    );

  return (
    <>
      <header className="relative bg-white/88 backdrop-blur-xl">
        <div className="shell">
          <div className="flex items-center justify-between gap-2 py-2.5 sm:gap-3 sm:py-3">
            <nav
              aria-label="Primary"
              className="hidden flex-1 items-center gap-1 lg:flex"
            >
              {left.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active === item.href ? "page" : undefined}
                  className={linkClass(item.href)}
                >
                  <span className="relative">{item.label}</span>
                </Link>
              ))}
            </nav>

            <Wordmark />

            <div className="flex flex-1 items-center justify-end gap-1">
              <nav
                aria-label="Secondary"
                className="hidden items-center gap-1 lg:flex"
              >
                {right.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={active === item.href ? "page" : undefined}
                    className={linkClass(item.href)}
                  >
                    <span className="relative">{item.label}</span>
                  </Link>
                ))}
              </nav>
              <Link
                href="/contact"
                className="btn ml-1 hidden shrink-0 sm:inline-flex"
              >
                Book an appointment
                <i aria-hidden="true">
                  <ArrowUpRight className="h-3 w-3" />
                </i>
              </Link>
              {/* One-thumb call button — the single most useful control on a
                practice's phone header. */}
              <a
                href={practice.phoneHref}
                aria-label={`Call the practice on ${practice.phone}`}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-forest text-white lg:hidden"
              >
                <Phone className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
              <button
                type="button"
                onClick={() => setOpen(true)}
                ref={triggerRef}
                aria-label="Open menu"
                aria-expanded={open}
                aria-controls="mobile-menu"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-charcoal/15 text-charcoal lg:hidden"
              >
                <Menu className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>

        <div className="hairline" />
      </header>

      {/*
        Portalled to <body>. This is essential: the header carries
        `backdrop-blur`, and a filtered ancestor becomes the containing block
        for every `position: fixed` descendant — which is why the sheet was
        rendering inside a 56px-tall header box and appearing to slide up out
        of the viewport. A portal escapes that entirely.
      */}
      {mounted &&
        createPortal(
          <AnimatePresence>
            {open && (
              <m.div
                id="mobile-menu"
                className="fixed inset-0 z-[90] lg:hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
              >
                <div
                  className="absolute inset-0 bg-charcoal/35 backdrop-blur-sm"
                  onClick={() => setOpen(false)}
                />

                <m.div
                  ref={dialogRef}
                  role="dialog"
                  aria-modal="true"
                  aria-label="Site menu"
                  initial={reduce ? undefined : { y: "100%" }}
                  animate={reduce ? undefined : { y: 0 }}
                  exit={reduce ? undefined : { y: "100%" }}
                  transition={{ duration: 0.5, ease: EASE }}
                  className="absolute inset-x-0 bottom-0 flex max-h-[92dvh] flex-col overflow-hidden rounded-t-[1.75rem] bg-white"
                >
                  <div className="flex items-center justify-between border-b border-charcoal/8 px-5 py-4">
                    <Wordmark onClick={() => setOpen(false)} compact />
                    <button
                      type="button"
                      onClick={() => setOpen(false)}
                      ref={closeRef}
                      aria-label="Close menu"
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-charcoal/15 text-charcoal"
                    >
                      <X className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </div>

                  <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pb-2">
                    <ul>
                      {nav.map((item) => (
                        <li key={item.href}>
                          <Link
                            href={item.href}
                            aria-current={active === item.href ? "page" : undefined}
                            onClick={() => setOpen(false)}
                            className={cn(
                              "flex items-center justify-between border-b border-charcoal/8 py-3.5 text-[1.15rem] font-light tracking-[-0.02em]",
                              active === item.href
                                ? "text-forest"
                                : "text-charcoal",
                            )}
                          >
                            <span className="flex items-center gap-2.5">
                              {active === item.href && (
                                <span
                                  className="h-1.5 w-1.5 rounded-full bg-forest"
                                  aria-hidden="true"
                                />
                              )}
                              {item.label}
                            </span>
                            <ArrowUpRight
                              className="h-4 w-4 text-charcoal/30"
                              aria-hidden="true"
                            />
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex flex-col gap-2 border-t border-charcoal/8 px-5 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-4">
                    <Link
                      href="/contact"
                      onClick={() => setOpen(false)}
                      className="btn justify-between"
                    >
                      Book an appointment
                      <i aria-hidden="true">
                        <ArrowUpRight className="h-3 w-3" />
                      </i>
                    </Link>
                    <a
                      href={practice.phoneHref}
                      className="flex items-center justify-center gap-2 rounded-full border border-charcoal/15 py-3 text-[13px] font-medium text-charcoal"
                    >
                      <Phone className="h-3.5 w-3.5" aria-hidden="true" />
                      {practice.phone}
                    </a>
                    <p className="pt-1 text-center text-[10.5px] leading-relaxed text-ink-muted">
                      {practice.hospital} · Primrose, Germiston
                    </p>
                  </div>
                </m.div>
              </m.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </>
  );
}

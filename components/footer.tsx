"use client";

import { BookingLink } from "@/components/booking-link";
import Link from "next/link";

import { ArrowUpRight } from "lucide-react";
import { m } from "framer-motion";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { Marquee } from "@/components/ui/motion";
import { nav, practice } from "@/lib/practice";

const press = ["HPCSA", "SASOG", "CMSA", "SAMA", "FIGO 2025", "Wits"];

/**
 * Soft Blossom & Pearl closing band: a rosewater, peony and pearl silk wash
 * with plum-charcoal ink, carrying the rolling affiliations marquee, a
 * botanical flourish over the italic motto, the peony-rose booking CTA and a
 * sculpted rosewater letterpress wordmark.
 */
export function Footer() {
  const reduce = useReducedMotion();
  const year = new Date().getFullYear();
  const leftLinks = nav.slice(0, 4);

  return (
    <footer className="blossom-footer relative -mt-7 overflow-hidden rounded-t-[2.25rem] border-t border-ember/15 text-ink sm:rounded-t-[2.75rem]">
      {/* Rolling affiliations */}
      <div className="border-y-hairline border-ember/15 py-4">
        <Marquee label="Professional affiliations" trackClassName="font-display text-[20px] italic tracking-[-0.01em] text-ink">
          {press.map((item) => (
            <span key={item} className="mx-9 inline-block">
              {item}
            </span>
          ))}
        </Marquee>
      </div>

      <div className="shell">
        <div className="grid gap-8 py-10 sm:grid-cols-[1fr_1.3fr_1fr] sm:items-start sm:text-center">
          <ul className="grid gap-1.5 text-left sm:text-left">
            <li className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-ember-deep">Pages</li>
            {leftLinks.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="inline-flex min-h-[24px] items-center text-[12px] text-ink underline-offset-4 transition-colors hover:text-ember hover:underline"
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li className="mt-3 text-[11px] text-ink-soft">© {year} {practice.entity}</li>
          </ul>

          <div className="sm:px-4">
            <svg
              aria-hidden="true"
              viewBox="0 0 64 16"
              fill="none"
              className="mx-auto mb-2.5 hidden h-4 w-12 text-ember/75 sm:block"
            >
              <path d="M6 12C15 12 22 9 32 9C42 9 49 12 58 12" stroke="currentColor" strokeLinecap="round" />
              <path d="M32 9C30 5.5 30.3 2.5 32 1.2C33.7 2.5 34 5.5 32 9Z" stroke="currentColor" strokeLinejoin="round" />
              <circle cx="14" cy="11.2" r="1" fill="currentColor" />
              <circle cx="50" cy="11.2" r="1" fill="currentColor" />
            </svg>
            <p className="font-display text-[20px] italic leading-snug tracking-[-0.01em] text-ink sm:text-[23px]">
              Women&apos;s Health. Every Stage. Every Journey.
            </p>
            <BookingLink className="btn mx-auto mt-4">
              Book an appointment
              <i aria-hidden="true">
                <ArrowUpRight className="h-3 w-3" />
              </i>
            </BookingLink>
            <p className="mt-4 text-[11px] leading-relaxed text-ink-soft">
              General information only — not medical advice. In an emergency
              contact your nearest emergency department.
            </p>
          </div>

          <ul className="grid gap-1.5 text-left sm:text-right">
            <li className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-ember-deep">Contact</li>
            <li>
              <a href={practice.phoneHref} className="inline-flex min-h-[24px] items-center text-[12px] text-ink hover:text-ember hover:underline">
                {practice.phone}
              </a>
            </li>
            <li className="text-[12px] text-ink-soft">{practice.hospital}, Primrose</li>
            <li className="text-[12px] text-ink-soft">{practice.room}</li>
            <li className="text-[12px] text-ink-soft">English &amp; French</li>
            <li>
              <a
                href={`mailto:${practice.email}`}
                className="inline-flex min-h-[24px] items-center break-all text-[12px] text-ink hover:text-ember hover:underline"
              >
                {practice.email}
              </a>
            </li>
            <li className="text-[11px] text-ink-soft">POPIA-conscious handling</li>
          </ul>
        </div>
      </div>

      {/* Oversized wordmark — clipped in from the left on scroll. The observed
          element is the wrapper: a self-clipped target never reports an
          intersection, so the wipe would otherwise stay at its initial state. */}
      <m.div
        className="overflow-hidden px-4 pb-20 pt-1 sm:px-6 lg:pb-4"
        initial={reduce ? false : "hidden"}
        animate={reduce ? "show" : undefined}
        whileInView={reduce ? undefined : "show"}
        viewport={{ once: true, amount: 0.15 }}
      >
        <m.p
          variants={{
            hidden: { clipPath: "inset(0% 100% 0% 0%)" },
            show: { clipPath: "inset(0% 0% 0% 0%)" },
          }}
          transition={{ duration: 1.6, ease: [0.6, 0, 0.2, 1] }}
          aria-hidden="true"
          className="whitespace-nowrap bg-[linear-gradient(180deg,rgba(179,71,108,0.34),rgba(179,71,108,0.05))] bg-clip-text text-center text-[clamp(1.85rem,10.6vw,9.5rem)] font-bold leading-[1.02] tracking-[-0.045em] text-transparent"
        >
          DR SOMPO <span className="font-light">OBGYN</span>
        </m.p>
      </m.div>
    </footer>
  );
}

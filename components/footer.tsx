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
 * Warm apricot footer — no near-black or brown panel — with a rolling
 * affiliations band, a centred booking button and the oversized clipped
 * wordmark that closes the reference's pages. Every string is charcoal.
 */
export function Footer() {
  const reduce = useReducedMotion();
  const year = new Date().getFullYear();
  const leftLinks = nav.slice(0, 4);

  return (
    <footer className="ember-gradient relative -mt-7 overflow-hidden rounded-t-[2.25rem] text-ink sm:rounded-t-[2.75rem]">
      {/* Rolling affiliations */}
      <div className="border-y-hairline border-charcoal/15 py-4">
        <Marquee label="Professional affiliations" trackClassName="text-[18px] font-semibold tracking-[-0.02em]">
          {press.map((item) => (
            <span key={item} className="mx-10 inline-block">
              {item}
            </span>
          ))}
        </Marquee>
      </div>

      <div className="shell">
        <div className="grid gap-8 py-10 sm:grid-cols-[1fr_1.3fr_1fr] sm:items-start sm:text-center">
          <ul className="grid gap-1.5 text-left sm:text-left">
            <li className="mb-1.5 text-[11px] font-medium text-ink">Pages</li>
            {leftLinks.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="inline-flex min-h-[24px] items-center text-[12px] text-ink underline-offset-4 transition-colors hover:underline"
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li className="mt-3 text-[11px] text-ink">© {year} {practice.entity}</li>
          </ul>

          <div className="sm:px-4">
            <p className="font-display text-[17px] italic leading-snug tracking-[-0.01em] sm:text-[19px]">
              Women&apos;s Health. Every Stage. Every Journey.
            </p>
            <BookingLink className="btn btn-light mx-auto mt-4">
              Book an appointment
              <i aria-hidden="true">
                <ArrowUpRight className="h-3 w-3" />
              </i>
            </BookingLink>
            <p className="mt-4 text-[10px] leading-relaxed text-ink">
              General information only — not medical advice. In an emergency
              contact your nearest emergency department.
            </p>
          </div>

          <ul className="grid gap-1.5 text-right">
            <li className="mb-1.5 text-[11px] font-medium text-ink">Contact</li>
            <li>
              <a href={practice.phoneHref} className="inline-flex min-h-[24px] items-center text-[12px] text-ink hover:underline">
                {practice.phone}
              </a>
            </li>
            <li className="text-[12px] text-ink">Primrose, Germiston</li>
            <li className="text-[12px] text-ink">English &amp; French</li>
            <li>
              <a
                href={`mailto:${practice.email}`}
                className="inline-flex min-h-[24px] items-center break-all text-[12px] text-ink hover:underline"
              >
                {practice.email}
              </a>
            </li>
            <li className="text-[11px] text-ink">POPIA-conscious handling</li>
          </ul>
        </div>
      </div>

      {/* Oversized wordmark — clipped in from the left on scroll. The observed
          element is the wrapper: a self-clipped target never reports an
          intersection, so the wipe would otherwise stay at its initial state. */}
      <m.div
        className="overflow-hidden pb-2"
        initial={reduce ? undefined : "hidden"}
        whileInView={reduce ? undefined : "show"}
        viewport={{ once: true, amount: 0.4 }}
      >
        <m.p
          variants={{
            hidden: { clipPath: "inset(0% 100% 0% 0%)" },
            show: { clipPath: "inset(0% 0% 0% 0%)" },
          }}
          transition={{ duration: 1.6, ease: [0.6, 0, 0.2, 1] }}
          aria-hidden="true"
          className="whitespace-nowrap bg-[linear-gradient(180deg,rgba(38,34,31,0.92),rgba(38,34,31,0.06))] bg-clip-text text-center text-[clamp(2.6rem,13vw,11rem)] font-bold leading-[0.9] tracking-[-0.045em] text-transparent opacity-70"
        >
          DR SOMPO <span className="font-light">OBGYN</span>
        </m.p>
      </m.div>
    </footer>
  );
}

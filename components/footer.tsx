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
 * Forest footer with a rolling affiliations band, a centred booking button and
 * the oversized clipped wordmark that closes the reference's pages.
 */
export function Footer() {
  const reduce = useReducedMotion();
  const year = new Date().getFullYear();
  const leftLinks = nav.slice(0, 4);

  return (
    <footer className="relative -mt-7 overflow-hidden rounded-t-[2.25rem] bg-forest text-white sm:rounded-t-[2.75rem]">
      {/* Rolling affiliations */}
      <div className="border-y-hairline border-white/15 py-4 opacity-70">
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
            <li className="mb-1.5 text-[11px] text-white/80">Pages</li>
            {leftLinks.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-[12px] text-white/75 transition-colors hover:text-white"
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li className="mt-3 text-[11px] text-white/80">© {year} {practice.entity}</li>
          </ul>

          <div className="sm:px-4">
            <p className="text-[15px] leading-snug tracking-[-0.02em] sm:text-[17px]">
              Women&apos;s Health. Every Stage. Every Journey.
            </p>
            <BookingLink className="btn mx-auto mt-4 bg-white text-black">
              Book an appointment
              <i aria-hidden="true">
                <ArrowUpRight className="h-3 w-3" />
              </i>
            </BookingLink>
            <p className="mt-4 text-[10.5px] leading-relaxed text-white/80">
              General information only — not medical advice. In an emergency
              contact your nearest emergency department.
            </p>
          </div>

          <ul className="grid gap-1.5 text-right">
            <li className="mb-1.5 text-[11px] text-white/80">Contact</li>
            <li>
              <a href={practice.phoneHref} className="text-[12px] text-white/75 hover:text-white">
                {practice.phone}
              </a>
            </li>
            <li className="text-[12px] text-white/75">Primrose, Germiston</li>
            <li className="text-[12px] text-white/75">English &amp; French</li>
            <li>
              <a
                href={`mailto:${practice.email}`}
                className="break-all text-[12px] text-white/75 hover:text-white"
              >
                {practice.email}
              </a>
            </li>
            <li className="text-[11px] text-white/80">POPIA-conscious handling</li>
          </ul>
        </div>
      </div>

      {/* Oversized wordmark — clipped in from the left on scroll */}
      <div className="overflow-hidden pb-2">
        <m.p
          initial={reduce ? undefined : { clipPath: "inset(0 100% 0 0)" }}
          whileInView={reduce ? undefined : { clipPath: "inset(0 0% 0 0)" }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 1.6, ease: [0.6, 0, 0.2, 1] }}
          aria-hidden="true"
          className="whitespace-nowrap bg-[linear-gradient(180deg,#ffffff,rgba(255,255,255,0.08))] bg-clip-text text-center text-[clamp(2.6rem,13vw,11rem)] font-bold leading-[0.9] tracking-[-0.045em] text-transparent opacity-65"
        >
          DR SOMPO <span className="font-light">OBGYN</span>
        </m.p>
      </div>
    </footer>
  );
}

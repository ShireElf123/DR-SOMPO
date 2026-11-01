"use client";

import { ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";
import { LogoMark } from "@/components/logo";
import { motion, useReducedMotion } from "framer-motion";
import { nav, practice } from "@/lib/practice";

export function Footer() {
  const reduce = useReducedMotion();
  const year = new Date().getFullYear();

  return (
    <footer className="relative mt-4 bg-forest-deep text-ivory">
      <div className="shell">
        <div className="grid gap-10 py-14 sm:py-16 lg:grid-cols-[1.3fr_0.7fr_0.9fr] lg:gap-12">
          {/* Brand column */}
          <div>
            <div className="flex items-center gap-2.5 text-ivory">
              <motion.span
                whileHover={reduce ? undefined : { rotate: 45 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="inline-flex"
              >
                <LogoMark className="h-9 w-9" />
              </motion.span>
              <span className="flex flex-col leading-none">
                <span className="text-[1.0625rem] font-medium tracking-[-0.03em]">
                  Dr Ngwey-Sompo
                </span>
                <span className="mt-1 text-[0.5625rem] font-medium uppercase tracking-[0.18em] text-sage/68">
                  Obstetrics &amp; Gynaecology
                </span>
              </span>
            </div>

            <p className="mt-6 max-w-xs text-[1.0625rem] leading-snug tracking-[-0.02em] text-sage/80">
              Women&apos;s Health. <span className="serif-accent">Every Stage.</span>{" "}
              Every Journey.
            </p>

            <p className="mt-5 max-w-xs text-[0.75rem] leading-relaxed text-sage/60">
              {practice.entity} · Specialist Obstetrician &amp; Gynaecologist
              practising at {practice.hospital}, Primrose, Germiston.
            </p>

            <div className="mt-6 flex items-center gap-2">
              <span className="rounded-full border border-ivory/15 px-2.5 py-1 text-[0.5625rem] font-medium uppercase tracking-[0.14em] text-sage/68">
                HPCSA registered
              </span>
              <span className="rounded-full border border-ivory/15 px-2.5 py-1 text-[0.5625rem] font-medium uppercase tracking-[0.14em] text-sage/68">
                English · French
              </span>
            </div>
          </div>

          {/* Sitemap */}
          <nav aria-label="Footer">
            <h2 className="text-[0.5625rem] font-semibold uppercase tracking-[0.18em] text-sage/55">
              Explore
            </h2>
            <ul className="mt-4 space-y-2.5">
              {nav.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="group inline-flex items-center gap-1.5 text-[0.8125rem] text-sage/75 transition-colors duration-300 hover:text-ivory"
                  >
                    {item.label}
                    <ArrowUpRight className="h-3 w-3 opacity-0 transition-all duration-300 group-hover:opacity-60" aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact */}
          <div>
            <h2 className="text-[0.5625rem] font-semibold uppercase tracking-[0.18em] text-sage/55">
              Practice
            </h2>
            <ul className="mt-4 space-y-3.5">
              <li className="flex gap-2.5">
                <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-sage/58" aria-hidden="true" />
                <address className="not-italic text-[0.8125rem] leading-relaxed text-sage/75">
                  {practice.hospital}
                  <br />
                  {practice.addressLines[0]}
                  <br />
                  {practice.addressLines[1]}, {practice.city}
                </address>
              </li>
              <li className="flex gap-2.5">
                <Phone className="mt-0.5 h-3.5 w-3.5 shrink-0 text-sage/58" aria-hidden="true" />
                <a
                  href={practice.phoneHref}
                  className="text-[0.8125rem] text-sage/75 transition-colors hover:text-ivory"
                >
                  {practice.phone}
                </a>
              </li>
              <li className="flex gap-2.5">
                <Mail className="mt-0.5 h-3.5 w-3.5 shrink-0 text-sage/58" aria-hidden="true" />
                <a
                  href={`mailto:${practice.email}`}
                  className="break-all text-[0.8125rem] text-sage/75 transition-colors hover:text-ivory"
                >
                  {practice.email}
                </a>
              </li>
            </ul>

            <a
              href="#contact"
              className="group mt-6 inline-flex items-center gap-2 rounded-full bg-ivory px-4 py-2.5 text-[0.75rem] font-medium text-forest transition-transform duration-500 hover:-translate-y-0.5"
            >
              Book an Appointment
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:rotate-45" />
            </a>
          </div>
        </div>

        <div className="hairline bg-gradient-to-r from-transparent via-sage/20 to-transparent" />

        <div className="flex flex-col gap-4 pt-6 pb-24 sm:flex-row sm:items-center sm:justify-between lg:pb-6">
          <p className="text-[0.6875rem] leading-relaxed text-sage/55">
            © {year} {practice.entity}. All rights reserved. Practice number to be
            confirmed before publication.
          </p>
          <p className="max-w-lg text-[0.6875rem] leading-relaxed text-sage/55">
            This website provides general information only. It is not medical
            advice and does not replace a consultation. In an emergency, contact
            your nearest emergency department.
          </p>
        </div>
      </div>
    </footer>
  );
}

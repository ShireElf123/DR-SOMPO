"use client";

import { ArrowUpRight, Baby, Scissors, Sparkles, Stethoscope } from "lucide-react";
import Image from "next/image";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/motion";
import { serviceGroups } from "@/lib/practice";
import { cn } from "@/lib/utils";

const iconFor: Record<string, typeof Baby> = {
  obstetrics: Baby,
  gynaecology: Stethoscope,
  fertility: Sparkles,
  surgery: Scissors,
};

/**
 * Services gallery — a bento of white "content surfaces" on the ivory sheet,
 * mirroring the reference composition: icon chip, headline, supporting copy,
 * and a quiet "Learn more" affordance. One tile per discipline, with the
 * fertility tile carrying the practice's special-interest emphasis.
 */
export function Services() {
  const [obstetrics, gynaecology, fertility, surgery] = serviceGroups;

  return (
    <section id="services" className="relative py-16 sm:py-20 lg:py-24" aria-labelledby="services-heading">
      <div className="shell">
        <div className="mx-auto max-w-2xl text-center">
          <Reveal>
            <span className="eyebrow">What we care for</span>
          </Reveal>
          <Reveal delay={0.06}>
            <h2
              id="services-heading"
              className="display mt-5 text-[clamp(2rem,4.4vw,3.25rem)] text-forest"
            >
              Everything you need.{" "}
              <span className="serif-accent">Nothing you don&apos;t.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mx-auto mt-4 max-w-xl text-[0.9375rem] leading-relaxed text-charcoal/68">
              Comprehensive obstetric and gynaecological care, designed around
              clarity, dignity and clinical rigour — from a first consultation
              to pregnancy, surgery and beyond.
            </p>
          </Reveal>
        </div>

        <RevealGroup
          className="mt-12 grid gap-4 sm:gap-5 lg:grid-cols-3"
          stagger={0.1}
          amount={0.15}
        >
          {/* Obstetrics — large image tile */}
          <RevealItem className="lg:col-span-2">
            <article className="group relative h-full overflow-hidden rounded-[1.75rem] border border-forest/8 bg-forest text-ivory shadow-[var(--shadow-lift)]">
              <div className="grid h-full sm:grid-cols-[1.05fr_0.95fr]">
                <div className="flex flex-col justify-between p-7 sm:p-9">
                  <div>
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-ivory/10 text-ivory">
                      <Baby className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <h3 className="mt-6 text-[1.5rem] font-medium tracking-[-0.03em] sm:text-[1.75rem]">
                      Obstetrics
                    </h3>
                    <p className="mt-2.5 max-w-sm text-[0.875rem] leading-relaxed text-sage/78">
                      {obstetrics.intro}
                    </p>
                    <ul className="mt-6 flex flex-wrap gap-1.5">
                      {obstetrics.services.flatMap((s) => s.items).slice(0, 4).map((item) => (
                        <li
                          key={item}
                          className="rounded-full border border-ivory/15 px-2.5 py-1 text-[0.6875rem] text-sage/85"
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <a
                    href="#obstetrics"
                    className="mt-8 inline-flex items-center gap-2 text-[0.8125rem] font-medium text-ivory"
                  >
                    <span className="relative">
                      Explore obstetric care
                      <span className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-ivory/60 transition-transform duration-500 group-hover:scale-x-100" />
                    </span>
                    <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </a>
                </div>
                <div className="relative min-h-[13rem] overflow-hidden sm:min-h-full">
                  <Image
                    src="/images/antenatal.jpg"
                    alt="Expectant mother resting calmly in a sunlit consultation room"
                    fill
                    sizes="(max-width: 640px) 92vw, 30vw"
                    className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-forest/45 via-transparent to-transparent sm:from-forest/60" />
                </div>
              </div>
            </article>
          </RevealItem>

          {/* Fertility — special interest */}
          <RevealItem>
            <article className="group relative flex h-full flex-col justify-between overflow-hidden rounded-[1.75rem] border border-forest/10 bg-mint p-7 shadow-[var(--shadow-lift)] transition-colors duration-500 hover:bg-sage/60 sm:p-8">
              <div className="pointer-events-none absolute -right-10 -top-12 h-36 w-36 rounded-full bg-[radial-gradient(circle,rgba(23,77,60,0.14),transparent_70%)]" />
              <div className="relative">
                <div className="flex items-start justify-between">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-forest text-ivory">
                    <Sparkles className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <span className="rounded-full border border-forest/20 bg-white/70 px-2.5 py-1 text-[0.5625rem] font-semibold uppercase tracking-[0.14em] text-forest">
                    Special interest
                  </span>
                </div>
                <h3 className="mt-6 text-[1.375rem] font-medium tracking-[-0.03em] text-forest">
                  Fertility
                </h3>
                <p className="mt-2.5 text-[0.875rem] leading-relaxed text-charcoal/70">
                  Assessment and consultation with an individualised care
                  pathway — explained honestly, at your pace.
                </p>
              </div>
              <a
                href="#fertility"
                className="mt-8 inline-flex items-center gap-2 text-[0.8125rem] font-medium text-forest"
              >
                <span className="relative">
                  Learn more
                  <span className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-forest transition-transform duration-500 group-hover:scale-x-100" />
                </span>
                <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            </article>
          </RevealItem>

          {/* Gynaecology */}
          <RevealItem>
            <article className="group relative flex h-full flex-col justify-between overflow-hidden rounded-[1.75rem] border border-forest/8 bg-white p-7 shadow-[var(--shadow-lift)] sm:p-8">
              <div>
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-sage text-forest">
                  <Stethoscope className="h-5 w-5" aria-hidden="true" />
                </span>
                <h3 className="mt-6 text-[1.375rem] font-medium tracking-[-0.03em] text-forest">
                  Gynaecology
                </h3>
                <p className="mt-2.5 text-[0.875rem] leading-relaxed text-charcoal/70">
                  Consultations, contraception, screening and menstrual health —
                  handled with discretion and dignity.
                </p>
                <ul className="mt-5 space-y-1.5">
                  {gynaecology.services.flatMap((s) => s.items).slice(0, 3).map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2 text-[0.8125rem] text-charcoal/66"
                    >
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-forest/45" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <a
                href="#gynaecology"
                className="mt-8 inline-flex items-center gap-2 text-[0.8125rem] font-medium text-forest"
              >
                <span className="relative">
                  Learn more
                  <span className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-forest transition-transform duration-500 group-hover:scale-x-100" />
                </span>
                <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            </article>
          </RevealItem>

          {/* Surgery — image tile */}
          <RevealItem className="lg:col-span-2">
            <article className="group relative h-full overflow-hidden rounded-[1.75rem] border border-forest/8 bg-white shadow-[var(--shadow-lift)]">
              <div className="grid h-full sm:grid-cols-[0.95fr_1.05fr]">
                <div className="relative min-h-[12rem] overflow-hidden sm:min-h-full">
                  <Image
                    src="/images/surgery.jpg"
                    alt="Modern minimally invasive surgical equipment in a clean theatre suite"
                    fill
                    sizes="(max-width: 640px) 92vw, 30vw"
                    className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04]"
                  />
                </div>
                <div className="flex flex-col justify-between p-7 sm:p-9">
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-sage text-forest">
                        <Scissors className="h-5 w-5" aria-hidden="true" />
                      </span>
                      <span className="text-[0.625rem] font-medium uppercase tracking-[0.16em] text-forest/60">
                        Theatre
                      </span>
                    </div>
                    <h3 className="mt-5 text-[1.5rem] font-medium tracking-[-0.03em] text-forest sm:text-[1.75rem]">
                      Minimally invasive &amp; open surgery
                    </h3>
                    <p className="mt-2.5 max-w-sm text-[0.875rem] leading-relaxed text-charcoal/70">
                      {surgery.intro}
                    </p>
                  </div>
                  <div className="mt-7 flex flex-wrap items-center gap-x-4 gap-y-2">
                    {surgery.services[0].items.slice(0, 4).map((item) => (
                      <span
                        key={item}
                        className="text-[0.75rem] font-medium text-charcoal/62"
                      >
                        {item}
                      </span>
                    ))}
                    <a
                      href="#surgery"
                      className="ml-auto inline-flex items-center gap-1.5 text-[0.8125rem] font-medium text-forest"
                    >
                      Learn more
                      <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </a>
                  </div>
                </div>
              </div>
            </article>
          </RevealItem>
        </RevealGroup>

        <Reveal delay={0.1}>
          <p
            className={cn(
              "mx-auto mt-8 max-w-2xl text-center text-[0.75rem] leading-relaxed text-charcoal/55",
            )}
          >
            All listed services and procedures are subject to confirmation
            against Dr Somp&apos;s current practice and hospital privileges.
            Nothing on this website is a guarantee of a clinical outcome.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

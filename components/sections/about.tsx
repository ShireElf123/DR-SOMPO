"use client";

import Image from "next/image";
import { ArrowUpRight, Check, Globe2, Sparkles } from "lucide-react";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/motion";
import { affiliations, biography, biographyAside, credentials, practice } from "@/lib/practice";

export function About() {
  return (
    <section id="about" className="relative py-16 sm:py-20 lg:py-28" aria-labelledby="about-heading">
      <div className="shell">
        <div className="grid gap-10 lg:grid-cols-[0.86fr_1.14fr] lg:gap-14">
          {/* Portrait */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            <Reveal y={30}>
              <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-sage">
                <Image
                  src="/images/portrait-somp.jpg"
                  alt="Portrait of Dr CM Ngwey-Sompo"
                  fill
                  sizes="(max-width: 1024px) 92vw, 40vw"
                  className="object-cover"
                />
              </div>
            </Reveal>

            <Reveal delay={0.12}>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-forest/8 bg-white p-4">
                  <Globe2 className="h-4 w-4 text-forest/60" aria-hidden="true" />
                  <p className="mt-2.5 text-[0.625rem] font-medium uppercase tracking-[0.14em] text-forest/60">
                    Consultations
                  </p>
                  <p className="mt-1 text-[0.8125rem] font-medium text-forest">
                    {practice.languages.join(" · ")}
                  </p>
                </div>
                <div className="rounded-2xl border border-forest/8 bg-white p-4">
                  <Sparkles className="h-4 w-4 text-forest/60" aria-hidden="true" />
                  <p className="mt-2.5 text-[0.625rem] font-medium uppercase tracking-[0.14em] text-forest/60">
                    Special interests
                  </p>
                  <p className="mt-1 text-[0.8125rem] font-medium leading-snug text-forest">
                    Fertility · Cervical health
                  </p>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Biography */}
          <div>
            <Reveal>
              <span className="eyebrow">Meet your specialist</span>
            </Reveal>

            <Reveal delay={0.06}>
              <h2
                id="about-heading"
                className="display mt-5 text-[clamp(2rem,4.4vw,3.25rem)] text-forest"
              >
                Dr CM Ngwey-Sompo
                <span className="mt-2 block text-[0.9375rem] font-normal tracking-normal text-charcoal/62 sm:text-base">
                  {practice.title} · {practice.entity}
                </span>
              </h2>
            </Reveal>

            <div className="mt-6 space-y-4">
              {biography.map((paragraph, i) => (
                <Reveal key={i} delay={0.08 + i * 0.04}>
                  <p
                    className={
                      i === 0
                        ? "text-[1rem] leading-relaxed text-charcoal/80"
                        : "text-[0.9375rem] leading-relaxed text-charcoal/70"
                    }
                  >
                    {paragraph}
                  </p>
                </Reveal>
              ))}
            </div>

            <Reveal delay={0.2}>
              <div className="mt-7 flex items-start gap-3 rounded-2xl border border-forest/10 bg-mint/70 p-4">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-forest" aria-hidden="true" />
                <div>
                  <p className="text-[0.8125rem] font-medium text-forest">
                    {biographyAside.title}
                  </p>
                  <p className="mt-1 text-[0.8125rem] leading-relaxed text-charcoal/68">
                    {biographyAside.body} {biographyAside.languages}
                  </p>
                </div>
              </div>
            </Reveal>

            {/* Credentials */}
            <div className="mt-12">
              <Reveal>
                <div className="flex items-end justify-between gap-4">
                  <h3 className="text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-forest/60">
                    Qualifications
                  </h3>
                  <span className="text-[0.6875rem] text-charcoal/50">
                    Verified with the practice before launch
                  </span>
                </div>
              </Reveal>

              <RevealGroup className="mt-4 grid gap-3 sm:grid-cols-2" stagger={0.08}>
                {credentials.map((credential) => (
                  <RevealItem key={credential.code}>
                    <div className="group h-full rounded-2xl border border-forest/8 bg-white p-5 transition-all duration-500 hover:-translate-y-0.5 hover:border-forest/20 hover:shadow-[var(--shadow-lift)]">
                      <div className="flex items-start justify-between gap-3">
                        <p className="text-[1rem] font-medium tracking-[-0.02em] text-forest">
                          {credential.code}
                        </p>
                        <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" aria-hidden="true" />
                      </div>
                      <p className="mt-2 text-[0.8125rem] leading-relaxed text-charcoal/70">
                        {credential.title}
                      </p>
                      <p className="mt-2 text-[0.6875rem] uppercase tracking-[0.1em] text-forest/56">
                        {credential.institution}
                      </p>
                      {credential.note && (
                        <p className="mt-2 border-t border-forest/8 pt-2 text-[0.6875rem] leading-relaxed text-charcoal/60">
                          {credential.note}
                        </p>
                      )}
                    </div>
                  </RevealItem>
                ))}
              </RevealGroup>
            </div>

            {/* Affiliations */}
            <div className="mt-12">
              <Reveal>
                <h3 className="text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-forest/60">
                  Professional &amp; hospital affiliations
                </h3>
              </Reveal>

              <RevealGroup className="mt-4 divide-y divide-forest/8 border-y border-forest/8" stagger={0.05}>
                {affiliations.map((affiliation) => (
                  <RevealItem key={affiliation.name}>
                    <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 py-3">
                      <div className="flex items-center gap-3">
                        <span
                          aria-hidden="true"
                          className={
                            affiliation.state === "verified"
                              ? "h-1.5 w-1.5 rounded-full bg-forest/50"
                              : "h-1.5 w-1.5 rounded-full bg-gold ring-2 ring-gold/25"
                          }
                        />
                        <p className="text-[0.875rem] text-charcoal/75">{affiliation.name}</p>
                      </div>
                      <p className="pl-6 text-[0.6875rem] uppercase tracking-[0.1em] text-forest/56 sm:pl-0">
                        {affiliation.detail}
                      </p>
                    </div>
                  </RevealItem>
                ))}
              </RevealGroup>
              <p className="mt-3 flex items-center gap-2 text-[0.6875rem] text-charcoal/55">
                <span className="h-1.5 w-1.5 rounded-full bg-gold ring-2 ring-gold/25" aria-hidden="true" />
                Marked items await confirmation from the practice before publication.
              </p>
            </div>

            <Reveal delay={0.1}>
              <a
                href="#contact"
                className="group mt-9 inline-flex items-center gap-2 text-[0.875rem] font-medium text-forest"
              >
                <span className="relative">
                  Request a consultation
                  <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-forest/50 transition-transform duration-500 group-hover:scale-x-100" />
                </span>
                <ArrowUpRight className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

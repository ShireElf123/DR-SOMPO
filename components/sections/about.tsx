"use client";

import Image from "next/image";
import { Reveal, RevealGroup, RevealItem, WordsIn } from "@/components/ui/motion";
import { affiliations, biography, biographyAside, credentials } from "@/lib/practice";

/**
 * Meet Dr Somp — a photographic plate with a fern-shaped mask beside a light
 * biography column, credentials as small ivory chips.
 */
export function About() {
  return (
    <section id="about" className="sec" aria-labelledby="about-heading">
      <div className="shell">
        <div className="grid items-center gap-9 lg:grid-cols-[0.85fr_1.15fr] lg:gap-12">
          <Reveal y={28}>
            <div className="relative">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[1.25rem] rounded-tl-[4rem] bg-sage">
                <Image
                  src="/images/portrait-somp.jpg"
                  alt="Portrait of Dr CM Ngwey-Sompo"
                  fill
                  sizes="(max-width: 1024px) 90vw, 38vw"
                  className="object-cover"
                />
              </div>
              <div className="absolute -bottom-4 -right-3 rounded-xl bg-white px-3.5 py-2.5 shadow-[0_18px_40px_-24px_rgba(0,0,0,0.45)] sm:-right-5">
                <p className="text-[9.5px] uppercase tracking-[0.14em] text-charcoal/40">
                  Consulting
                </p>
                <p className="mt-0.5 text-[12px] font-medium text-forest">
                  Life Roseacres Hospital
                </p>
              </div>
            </div>
          </Reveal>

          <div>
            <span className="tag">Meet Dr Somp</span>
            <h2
              id="about-heading"
              className="text-[clamp(1.9rem,4vw,3rem)] leading-[1.03]"
            >
              <WordsIn text="Specialist care, with" />{" "}
              <span className="text-charcoal/35">
                <WordsIn text="personal understanding." delay={0.18} />
              </span>
            </h2>

            <div className="mt-5 space-y-3.5">
              {biography.map((paragraph, i) => (
                <Reveal key={i} delay={0.06 + i * 0.04}>
                  <p className="max-w-xl text-[13.5px] leading-[1.65] text-charcoal/65">
                    {paragraph}
                  </p>
                </Reveal>
              ))}
            </div>

            <Reveal delay={0.15}>
              <p className="mt-4 text-[11.5px] leading-relaxed text-charcoal/45">
                {biographyAside.body} {biographyAside.languages}
              </p>
            </Reveal>

            <RevealGroup className="mt-6 grid gap-2 sm:grid-cols-2" stagger={0.07}>
              {credentials.map((credential) => (
                <RevealItem key={credential.code}>
                  <div className="rounded-lg bg-ivory px-3 py-2.5">
                    <p className="text-[13px] font-semibold tracking-[-0.01em] text-charcoal">
                      {credential.code}
                    </p>
                    <p className="mt-0.5 text-[11px] leading-snug text-charcoal/50">
                      {credential.institution}
                    </p>
                  </div>
                </RevealItem>
              ))}
            </RevealGroup>

            <Reveal delay={0.2}>
              <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1.5">
                {affiliations
                  .filter((a) => a.state === "verified")
                  .slice(0, 5)
                  .map((a) => (
                    <span
                      key={a.name}
                      className="text-[10.5px] uppercase tracking-[0.12em] text-charcoal/40"
                    >
                      {a.detail}
                    </span>
                  ))}
                <span className="text-[10.5px] text-charcoal/30">
                  · Dr Phakisa Mokhesi affiliation to be confirmed
                </span>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

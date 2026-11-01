"use client";

import { ArrowUpRight, Phone } from "lucide-react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Reveal, WordsIn } from "@/components/ui/motion";
import { brand, practice } from "@/lib/practice";

/**
 * Final booking CTA — a deep forest panel with a slow, very subtle zoom on the
 * photographic backdrop. Restraint is deliberate: the goal is a single, obvious
 * action.
 */
export function FinalCta() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 1], [1.06, 1]);

  return (
    <section ref={ref} className="relative px-3 pb-4 pt-6 sm:px-0" aria-labelledby="cta-heading">
      <div className="shell">
        <div className="relative overflow-hidden rounded-[2rem] bg-forest-ink sm:rounded-[2.5rem]">
          <motion.div
            aria-hidden="true"
            style={reduce ? undefined : { scale }}
            className="absolute inset-0 bg-[radial-gradient(120%_120%_at_15%_0%,#1c5a47_0%,#123c30_45%,#0a2a20_100%)]"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -left-24 bottom-0 h-[26rem] w-[26rem] rounded-full bg-[radial-gradient(circle,rgba(220,235,225,0.14),transparent_66%)]"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-16 -top-24 h-[22rem] w-[22rem] rounded-full bg-[radial-gradient(circle,rgba(214,198,162,0.18),transparent_68%)]"
          />
          <div aria-hidden="true" className="noise-overlay pointer-events-none absolute inset-0 opacity-25" />

          <div className="relative px-6 py-14 text-center sm:px-12 sm:py-20">
            <Reveal>
              <span className="eyebrow eyebrow-dark mx-auto">
                <span className="h-1.5 w-1.5 rounded-full bg-gold" aria-hidden="true" />
                New patients welcome
              </span>
            </Reveal>

            <h2
              id="cta-heading"
              className="display mx-auto mt-6 max-w-2xl text-[clamp(2rem,5vw,3.5rem)] text-ivory"
            >
              <WordsIn text="Every stage deserves" />{" "}
              <span className="serif-accent text-sage">specialist care.</span>
            </h2>

            <Reveal delay={0.12}>
              <p className="mx-auto mt-5 max-w-lg text-[0.9375rem] leading-relaxed text-sage/75">
                {brand.tagline} Speak to the practice about a consultation with
                Dr Somp at Life Roseacres Hospital.
              </p>
            </Reveal>

            <Reveal delay={0.2}>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <a href="#contact" className="btn btn-light group">
                  Book an Appointment
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-forest/10 transition-transform duration-300 group-hover:rotate-45">
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </span>
                </a>
                <a
                  href={practice.phoneHref}
                  className="btn border border-ivory/25 bg-transparent text-ivory hover:bg-ivory/10"
                >
                  <Phone className="h-4 w-4" aria-hidden="true" />
                  {practice.phone}
                </a>
              </div>
            </Reveal>

            <Reveal delay={0.26}>
              <p className="mt-6 text-[0.6875rem] text-sage/58">
                Enquiries are not confirmed appointments · Not for emergencies
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

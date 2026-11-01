"use client";

import { ArrowUpRight } from "lucide-react";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/motion";
import { journey } from "@/lib/practice";

/**
 * Patient journey — three steps drawn as a single continuous line, the way a
 * Framer site would: numbers, a connecting rule, and quiet supporting detail.
 */
export function Journey() {
  return (
    <section className="relative py-14 sm:py-16 lg:py-20" aria-labelledby="journey-heading">
      <div className="shell">
        <div className="overflow-hidden rounded-[2rem] bg-sage/55 px-6 py-12 sm:px-10 sm:py-14 lg:px-14">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <Reveal>
                <span className="eyebrow border-forest/12 bg-white/60">How it works</span>
              </Reveal>
              <Reveal delay={0.06}>
                <h2
                  id="journey-heading"
                  className="display mt-4 max-w-lg text-[clamp(1.75rem,3.4vw,2.5rem)] text-forest"
                >
                  From first enquiry to{" "}
                  <span className="serif-accent">follow-up care.</span>
                </h2>
              </Reveal>
            </div>
            <Reveal delay={0.12}>
              <a
                href="#contact"
                className="group inline-flex items-center gap-2 whitespace-nowrap text-[0.8125rem] font-medium text-forest"
              >
                Start with an enquiry
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-forest text-ivory transition-transform duration-500 group-hover:rotate-45">
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </span>
              </a>
            </Reveal>
          </div>

          <RevealGroup className="mt-11 grid gap-6 sm:grid-cols-3 sm:gap-8" stagger={0.12}>
            {journey.map((step, i) => (
              <RevealItem key={step.step}>
                <div className="relative">
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full border border-forest/20 bg-white/70 text-[0.6875rem] font-semibold tabular-nums text-forest">
                      {step.step}
                    </span>
                    {i < journey.length - 1 && (
                      <span
                        aria-hidden="true"
                        className="hidden h-px flex-1 bg-gradient-to-r from-forest/25 to-forest/5 sm:block"
                      />
                    )}
                  </div>
                  <h3 className="mt-5 text-[1.0625rem] font-medium tracking-[-0.02em] text-forest">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-[0.8125rem] leading-relaxed text-charcoal/68">
                    {step.body}
                  </p>
                  <p className="mt-4 text-[0.625rem] font-medium uppercase tracking-[0.14em] text-forest/56">
                    {step.meta}
                  </p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </div>
    </section>
  );
}

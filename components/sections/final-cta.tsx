"use client";

import { ArrowUpRight } from "lucide-react";
import { Reveal, WordsIn } from "@/components/ui/motion";
import { practice } from "@/lib/practice";

/**
 * Final booking CTA — a centred statement set on the white sheet, with the
 * oversized arrow button the reference uses to close its pages.
 */
export function FinalCta() {
  return (
    <section className="bg-white pb-20 pt-10 sm:pb-24" aria-labelledby="cta-heading">
      <div className="shell text-center">
        <Reveal>
          <p className="text-[11px] uppercase tracking-[0.2em] text-ink-soft">
            New patients welcome
          </p>
        </Reveal>
        <h2
          id="cta-heading"
          className="mx-auto mt-4 max-w-[34rem] text-[clamp(2rem,4.6vw,3.25rem)] leading-[1.02]"
        >
          <WordsIn text="Your health deserves" />{" "}
          <span className="text-ink-soft">
            <WordsIn text="specialist attention." delay={0.2} />
          </span>
        </h2>

        <Reveal delay={0.15}>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2.5">
            <a href={practice.phoneHref} className="btn btn-forest">
              Call to book
              <i aria-hidden="true">
                <ArrowUpRight className="h-3 w-3" />
              </i>
            </a>
            <a href="/contact" className="btn btn-light border border-charcoal/12 shadow-none">
              Send an enquiry
              <i aria-hidden="true">
                <ArrowUpRight className="h-3 w-3" />
              </i>
            </a>
          </div>
        </Reveal>

        <Reveal delay={0.22}>
          <p className="mt-5 text-[11px] text-ink-soft">
            Enquiries are not confirmed appointments · Not for emergencies
          </p>
        </Reveal>
      </div>
    </section>
  );
}

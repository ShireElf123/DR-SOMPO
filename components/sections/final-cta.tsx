"use client";

import Image from "@/components/ui/practice-image";
import { ArrowUpRight } from "lucide-react";
import { m, useScroll, useTransform } from "framer-motion";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { useRef } from "react";
import { Reveal, WordsIn } from "@/components/ui/motion";
import { practice } from "@/lib/practice";

/**
 * Closing invitation. Built as a full-width photographic panel with the call to
 * action sitting on the image — the last thing a visitor sees should have a
 * human face on it, not another white gap.
 */
export function FinalCta() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);

  return (
    <section className="bg-cream pb-16 pt-8 sm:pb-20" aria-labelledby="cta-heading">
      <div className="shell">
        <Reveal y={22}>
          <div
            ref={ref}
            className="relative overflow-hidden rounded-[1.5rem] bg-cream sm:rounded-[1.75rem]"
          >
            {/* On phones the photograph is a band above the invitation instead
                of a backdrop behind it: a request this large needs a glass card
                the width of the screen, and that card covered 74% of the
                corridor. From sm up the copy sits over the frame again. */}
            <div className="relative h-[12rem] w-full overflow-hidden sm:absolute sm:inset-0 sm:h-auto">
              <m.div
                style={reduce ? undefined : { y }}
                className="h-full w-full [backface-visibility:hidden] motion-safe:will-change-transform sm:absolute sm:inset-x-0 sm:-top-[8%] sm:h-[120%]"
              >
                <Image
                  src="/images/corridor.jpg"
                  alt="The corridor leading to the consulting rooms"
                  fill
                  sizes="(max-width: 1180px) 96vw, 1180px"
                  className="object-cover"
                />
              </m.div>
              <div className="absolute inset-0 bg-gradient-to-t from-cream to-transparent sm:from-ember/18" />
            </div>

            <div className="relative px-4 pb-9 pt-5 text-center sm:px-8 sm:py-16">
              <div className="glass mx-auto max-w-[40rem] rounded-[1.35rem] px-5 py-8 text-ink max-sm:border-0 max-sm:bg-transparent max-sm:px-1 max-sm:shadow-none sm:px-10 sm:py-14">
              <p className="text-[10px] uppercase tracking-[0.2em] text-ink/75">
                New patients welcome
              </p>
              <h2
                id="cta-heading"
                className="mx-auto mt-4 max-w-[32rem] text-[clamp(1.9rem,4.4vw,3.1rem)] leading-[1.02]"
              >
                <WordsIn text="Your health deserves" />{" "}
                <span className="text-ink/75">
                  <WordsIn text="specialist attention." delay={0.2} />
                </span>
              </h2>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-2.5">
                <a href={practice.phoneHref} className="btn" data-cursor="Call">
                  Call to book
                  <i aria-hidden="true">
                    <ArrowUpRight className="h-3 w-3" />
                  </i>
                </a>
                <a href="/contact#appointment-request" className="btn btn-light" data-cursor="Enquire">
                  Send an enquiry
                  <i aria-hidden="true">
                    <ArrowUpRight className="h-3 w-3" />
                  </i>
                </a>
              </div>

              <p className="mt-5 text-[11px] text-ink-soft">
                Enquiries are not confirmed appointments · Not for emergencies
              </p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

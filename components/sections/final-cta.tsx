"use client";

import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
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
    <section className="bg-white pb-16 pt-8 sm:pb-20" aria-labelledby="cta-heading">
      <div className="shell">
        <Reveal y={22}>
          <div
            ref={ref}
            className="relative overflow-hidden rounded-[1.5rem] sm:rounded-[1.75rem]"
          >
            <motion.div
              style={reduce ? undefined : { y }}
              className="absolute inset-[-14%_0] [backface-visibility:hidden] motion-safe:will-change-transform"
            >
              <Image
                src="/images/corridor.jpg"
                alt="The corridor leading to the consulting rooms"
                fill
                sizes="(max-width: 1180px) 96vw, 1180px"
                className="object-cover"
              />
            </motion.div>
            <div className="absolute inset-0 bg-forest-ink/62" />
            <div className="absolute inset-0 bg-gradient-to-t from-forest-ink/80 via-forest-ink/35 to-transparent" />

            <div className="relative px-6 py-14 text-center text-white sm:px-10 sm:py-20">
              <p className="text-[10.5px] uppercase tracking-[0.2em] text-white/80">
                New patients welcome
              </p>
              <h2
                id="cta-heading"
                className="mx-auto mt-4 max-w-[32rem] text-[clamp(1.9rem,4.4vw,3.1rem)] leading-[1.02]"
              >
                <WordsIn text="Your health deserves" />{" "}
                <span className="text-white/70">
                  <WordsIn text="specialist attention." delay={0.2} />
                </span>
              </h2>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-2.5">
                <a href={practice.phoneHref} className="btn btn-light" data-cursor="Call">
                  Call to book
                  <i aria-hidden="true">
                    <ArrowUpRight className="h-3 w-3" />
                  </i>
                </a>
                <a href="/contact" className="btn btn-glass" data-cursor="Enquire">
                  Send an enquiry
                  <i aria-hidden="true">
                    <ArrowUpRight className="h-3 w-3" />
                  </i>
                </a>
              </div>

              <p className="mt-5 text-[10.5px] text-white/70">
                Enquiries are not confirmed appointments · Not for emergencies
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

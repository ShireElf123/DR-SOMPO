"use client";

import Image from "next/image";
import { Quote } from "lucide-react";
import { Reveal, RevealGroup, RevealItem, WordsIn } from "@/components/ui/motion";
import { approach, brand } from "@/lib/practice";

/**
 * Editorial split: a tall, quiet photograph on the left and the medical
 * philosophy on the right — asymmetric, generously spaced, with a hairline
 * rule between principles rather than cards.
 */
export function Approach() {
  return (
    <section id="approach" className="relative py-16 sm:py-20 lg:py-28" aria-labelledby="approach-heading">
      <div className="shell">
        <div className="grid gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:gap-16">
          {/* Image column */}
          <div className="relative">
            <Reveal y={30}>
              <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-sage">
                <Image
                  src="/images/consultation.jpg"
                  alt="Dr Somp in consultation with a patient in a bright, calm consulting room"
                  fill
                  sizes="(max-width: 1024px) 92vw, 44vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-forest-ink/30 via-transparent to-transparent" />
              </div>
            </Reveal>

            <Reveal delay={0.15}>
              <figure className="relative z-10 mx-auto -mt-14 w-[88%] rounded-2xl border border-forest/8 bg-white p-5 shadow-[var(--shadow-float)] sm:-mt-16">
                <Quote className="h-4 w-4 text-forest/45" aria-hidden="true" />
                <blockquote className="mt-2 text-[0.875rem] leading-relaxed text-charcoal/75">
                  {brand.supporting}
                </blockquote>
                <figcaption className="mt-3 text-[0.625rem] font-medium uppercase tracking-[0.16em] text-forest/60">
                  Practice philosophy
                </figcaption>
              </figure>
            </Reveal>
          </div>

          {/* Copy column */}
          <div className="lg:pt-6">
            <Reveal>
              <span className="eyebrow">Personalised care</span>
            </Reveal>

            <h2
              id="approach-heading"
              className="display mt-5 text-[clamp(1.9rem,4vw,3rem)] text-forest"
            >
              <WordsIn text="Care that treats you as a" />{" "}
              <span className="serif-accent">whole person</span>{" "}
              <WordsIn text="— not a case note." />
            </h2>

            <Reveal delay={0.1}>
              <p className="mt-5 max-w-xl text-[0.9375rem] leading-relaxed text-charcoal/70">
                Specialist care should feel personal. Every consultation starts
                with listening: your history, your priorities and the questions
                you may not have had the chance to ask elsewhere.
              </p>
            </Reveal>

            <RevealGroup className="mt-9" stagger={0.09}>
              {approach.map((item, i) => (
                <RevealItem key={item.title}>
                  <div className="group flex gap-5 border-t border-forest/10 py-5 transition-colors duration-500 hover:border-forest/25">
                    <span className="mt-0.5 w-6 shrink-0 text-[0.6875rem] font-medium tabular-nums text-forest/52">
                      0{i + 1}
                    </span>
                    <div>
                      <h3 className="text-[1rem] font-medium tracking-[-0.02em] text-forest">
                        {item.title}
                      </h3>
                      <p className="mt-1.5 max-w-md text-[0.875rem] leading-relaxed text-charcoal/68">
                        {item.body}
                      </p>
                    </div>
                  </div>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </div>
      </div>
    </section>
  );
}

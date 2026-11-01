"use client";

import Image from "next/image";
import { ScrollWords, WordsIn } from "@/components/ui/motion";
import { journey } from "@/lib/practice";

/**
 * Patient journey — three steps, each with a real photograph taking up the top
 * of the card, a number chip and copy below. Photography is always visible;
 * hover only lifts the card slightly and warms the border.
 */
export function Journey() {
  return (
    <section id="journey" className="sec" aria-labelledby="journey-heading">
      <div className="shell">
        <ScrollWords
          text="Your path to care — three simple steps, from the first phone call to follow-up."
          avatars={[4]}
          className="mx-auto mb-10 max-w-[38rem] text-center text-[clamp(1.15rem,2.2vw,1.4rem)] leading-[1.35] tracking-[-0.02em]"
        />

        <h2 id="journey-heading" className="sr-only">
          <WordsIn text="How it works" />
        </h2>

        <div className="relative mx-auto max-w-4xl">
          <span
            aria-hidden="true"
            className="absolute left-[14%] right-[14%] top-[13px] hidden border-t border-dotted border-charcoal/25 sm:block"
          />

          <div className="grid gap-3.5 sm:grid-cols-3">
            {journey.map((step) => (
              <div
                key={step.step}
                className="group relative flex flex-col overflow-hidden rounded-[1.25rem] border border-charcoal/10 bg-white transition-all duration-500 hover:-translate-y-1 hover:border-forest/30 hover:shadow-[0_28px_60px_-40px_rgba(23,77,60,0.5)]"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-sage">
                  <Image
                    src={
                      step.step === "01"
                        ? "/images/consultation.jpg"
                        : step.step === "02"
                          ? "/images/portrait-somp-card.jpg"
                          : "/images/patient-quiet.jpg"
                    }
                    alt={step.title}
                    fill
                    sizes="(max-width: 640px) 92vw, 30vw"
                    className="object-cover object-[center_20%] transition-transform duration-[900ms] ease-out group-hover:scale-[1.05]"
                  />
                  <span className="absolute left-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-white/95 text-[10.5px] font-medium text-forest backdrop-blur-sm">
                    {step.step}
                  </span>
                </div>

                <div className="flex flex-1 flex-col p-4">
                  <h3 className="text-[13.5px] font-medium tracking-[-0.01em] text-charcoal">
                    {step.title}
                  </h3>
                  <p className="mt-1.5 flex-1 text-[12px] leading-relaxed text-ink-soft">
                    {step.body}
                  </p>
                  <p className="mt-3 text-[9.5px] uppercase tracking-[0.14em] text-ink-soft">
                    {step.meta}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

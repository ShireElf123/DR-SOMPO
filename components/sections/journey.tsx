"use client";

import Image from "next/image";
import { ScrollWords, WordsIn } from "@/components/ui/motion";
import { journey } from "@/lib/practice";

/**
 * Patient journey — three bordered steps on a dotted rule, each with a portrait
 * medallion. Hovering floods the card from the bottom with forest green, the
 * reference's most tactile interaction.
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
              <div key={step.step} className="relative text-center">
                <span className="relative mx-auto mb-4 flex h-7 w-7 items-center justify-center rounded-full bg-mint text-[10.5px] font-medium text-forest ring-4 ring-white">
                  {step.step}
                </span>

                <div className="group relative overflow-hidden rounded-xl border border-charcoal/10 px-4 pb-6 pt-5 transition-colors duration-500 hover:border-forest">
                  <span
                    aria-hidden="true"
                    className="absolute left-1/2 top-full h-0 w-0 -translate-x-1/2 -translate-y-1/2 rounded-full bg-forest transition-all duration-700 ease-[cubic-bezier(.6,0,.2,1)] group-hover:h-[300%] group-hover:w-[300%]"
                  />

                  <div className="relative">
                    <span className="relative mx-auto mb-3 block h-[4.5rem] w-[4.5rem] rounded-full border border-charcoal/25 p-1 transition-colors duration-500 group-hover:border-white/40">
                      <span className="relative block h-full w-full overflow-hidden rounded-full">
                        <Image
                          src={
                            step.step === "01"
                              ? "/images/consultation.jpg"
                              : step.step === "02"
                                ? "/images/portrait-somp.jpg"
                                : "/images/patient-quiet.jpg"
                          }
                          alt=""
                          fill
                          sizes="72px"
                          className="object-cover"
                        />
                      </span>
                    </span>
                    <h3 className="text-[13.5px] font-medium tracking-[-0.01em] transition-colors duration-500 group-hover:text-white">
                      {step.title}
                    </h3>
                    <p className="mt-1.5 text-[12px] leading-relaxed text-charcoal/55 transition-colors duration-500 group-hover:text-white/75">
                      {step.body}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

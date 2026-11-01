"use client";

import { AlertCircle } from "lucide-react";
import { Reveal, WordsIn } from "@/components/ui/motion";
import { research } from "@/lib/practice";

/**
 * Cervical health & research — a pale sage diagonal panel. Presented as a
 * single editorial statement rather than a data sheet: the study is named,
 * never quantified.
 */
export function Research() {
  return (
    <section id="research" className="sec" aria-labelledby="research-heading">
      <div className="shell">
        <Reveal y={26}>
          <div className="relative overflow-hidden rounded-[1.5rem] bg-[linear-gradient(225deg,#0f3a2d_45%,#174d3c_68%,#9cc7b2)] px-6 py-10 text-white sm:px-10 sm:py-12">
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-10 -left-10 h-44 w-44 rounded-[0_85%_0_85%] bg-white/8"
            />
            <div className="relative max-w-3xl">
              <span className="tag tag-light">Cervical health</span>
              <h2
                id="research-heading"
                className="text-[clamp(1.8rem,4.2vw,3rem)] leading-[1.03]"
              >
                <WordsIn text="Advancing women's health through" />{" "}
                <span className="text-lime/90">
                  <WordsIn text="research and education." delay={0.2} />
                </span>
              </h2>

              <p className="mt-4 max-w-xl text-[13.5px] leading-relaxed text-white/85">
                Dr Somp&apos;s Master of Medicine research at the University of the
                Witwatersrand examined margin status after LLETZ — a procedure used
                to remove abnormal cervical cells — in women living with HIV. It was
                presented at SASOG 2025, FIGO 2025 and the Presentis Women&apos;s
                Health Conference in Dubai.
              </p>

              <p className="mt-5 max-w-2xl border-l border-white/25 pl-4 text-[11.5px] leading-relaxed text-white/60">
                {research.title}. {research.faculty}, {research.institution}.
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                {["HPV prevention", "Cervical screening", "Patient education"].map((chip) => (
                  <span
                    key={chip}
                    className="rounded-full border border-white/25 bg-white/10 px-3.5 py-1.5 text-[11px] backdrop-blur-md"
                  >
                    {chip}
                  </span>
                ))}
              </div>

              <p className="mt-5 flex max-w-xl items-start gap-2 text-[10.5px] leading-relaxed text-white/45">
                <AlertCircle className="mt-0.5 h-3 w-3 shrink-0" aria-hidden="true" />
                {research.disclaimer}
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

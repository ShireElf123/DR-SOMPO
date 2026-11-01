"use client";

import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { Reveal, WordsIn } from "@/components/ui/motion";
import { serviceGroups } from "@/lib/practice";

/**
 * Fertility special-interest panel: a diagonal forest-to-fern gradient with a
 * rounded photographic plate on the right and frosted chips. The strongest
 * colour moment on the page, mirroring the reference's purple feature block.
 */
export function Fertility() {
  const fertility = serviceGroups.find((g) => g.id === "fertility")!;
  const service = fertility.services[0];

  return (
    <section id="fertility" className="sec" aria-labelledby="fertility-heading">
      <div className="shell">
        <Reveal y={26}>
          <div className="relative overflow-hidden rounded-[1.5rem] bg-[linear-gradient(225deg,#174d3c_38%,#2f7a62_62%,#6ea58f)] px-6 py-10 text-white sm:px-10 sm:py-12 lg:px-12">
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-[0_85%_0_85%] bg-white/10"
            />
            <span
              aria-hidden="true"
              className="noise-soft pointer-events-none absolute inset-0 opacity-30"
            />

            <div className="relative grid items-center gap-8 lg:grid-cols-[1.25fr_1fr]">
              <div>
                <span className="tag tag-light">Special interest</span>
                <h2
                  id="fertility-heading"
                  className="text-[clamp(1.9rem,4.4vw,3.25rem)] leading-[1.03]"
                >
                  <WordsIn text="Fertility care that starts" />{" "}
                  <span className="text-lime/90">
                    <WordsIn text="with understanding you." delay={0.2} />
                  </span>
                </h2>

                <p className="mt-4 max-w-md text-[13.5px] leading-relaxed text-white/85">
                  {fertility.intro}
                </p>

                <div className="mt-6 flex flex-wrap gap-2">
                  {service.items.map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-white/30 bg-white/15 px-3.5 py-1.5 text-[11.5px] backdrop-blur-md"
                    >
                      {item}
                    </span>
                  ))}
                </div>

                <div className="mt-7 flex flex-wrap items-center gap-3">
                  <a href="#contact" className="btn btn-light">
                    Enquire about fertility care
                    <i aria-hidden="true">
                      <ArrowUpRight className="h-3 w-3" />
                    </i>
                  </a>
                  <p className="max-w-[15rem] text-[10.5px] leading-relaxed text-white/55">
                    An enquiry is not a confirmed appointment. Fertility outcomes
                    are never guaranteed.
                  </p>
                </div>
              </div>

              <div className="relative aspect-[4/3] overflow-hidden rounded-tl-[5rem] rounded-br-[2rem] sm:aspect-[16/11] lg:aspect-[4/4.2]">
                <Image
                  src="/images/fertility.jpg"
                  alt="A couple's hands held together, representing fertility care"
                  fill
                  sizes="(max-width: 1024px) 90vw, 38vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-forest/40 to-transparent" />
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

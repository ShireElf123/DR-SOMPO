"use client";

import { ArrowUpRight, Check } from "lucide-react";
import Image from "next/image";
import { Reveal, RevealGroup, RevealItem, WordsIn } from "@/components/ui/motion";
import { serviceGroups } from "@/lib/practice";

/**
 * Fertility special-interest feature — a full-bleed forest-green panel, the
 * strongest colour moment on the page, exactly as the reference uses its purple
 * feature block to break the rhythm of white surfaces.
 */
export function Fertility() {
  const fertility = serviceGroups.find((g) => g.id === "fertility")!;
  const service = fertility.services[0];

  return (
    <section id="fertility" className="relative py-14 sm:py-16 lg:py-20" aria-labelledby="fertility-heading">
      <div className="shell">
        <div className="relative overflow-hidden rounded-[2rem] bg-forest text-ivory sm:rounded-[2.5rem]">
          {/* Ambient texture */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-24 -top-32 h-[28rem] w-[28rem] rounded-full bg-[radial-gradient(circle,rgba(220,235,225,0.16),transparent_65%)]"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-40 -left-20 h-[26rem] w-[26rem] rounded-full bg-[radial-gradient(circle,rgba(214,198,162,0.14),transparent_68%)]"
          />
          <div aria-hidden="true" className="noise-overlay pointer-events-none absolute inset-0 opacity-30" />

          <div className="relative grid gap-0 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="p-7 sm:p-12 lg:p-14">
              <Reveal>
                <span className="eyebrow eyebrow-dark">
                  <span className="h-1.5 w-1.5 rounded-full bg-gold" aria-hidden="true" />
                  Special interest
                </span>
              </Reveal>

              <h2
                id="fertility-heading"
                className="display mt-5 text-[clamp(1.9rem,4vw,3rem)] text-ivory"
              >
                <WordsIn text="Fertility care that starts with" />{" "}
                <span className="serif-accent text-sage">listening.</span>
              </h2>

              <Reveal delay={0.12}>
                <p className="mt-5 max-w-lg text-[0.9375rem] leading-relaxed text-sage/78">
                  {fertility.intro}
                </p>
              </Reveal>

              <RevealGroup className="mt-8 divide-y divide-ivory/10" stagger={0.1}>
                {service.items.map((item) => (
                  <RevealItem key={item}>
                    <div className="flex items-start gap-3 py-3">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-ivory/10">
                        <Check className="h-3 w-3 text-sage" aria-hidden="true" />
                      </span>
                      <p className="text-[0.875rem] leading-relaxed text-ivory/85">{item}</p>
                    </div>
                  </RevealItem>
                ))}
              </RevealGroup>

              <Reveal delay={0.2}>
                <div className="mt-9 flex flex-wrap items-center gap-3">
                  <a href="#contact" className="btn btn-light group">
                    Enquire about fertility care
                    <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </a>
                  <p className="max-w-[16rem] text-[0.6875rem] leading-relaxed text-sage/62">
                    An enquiry is not a confirmed appointment. Fertility outcomes
                    are never guaranteed.
                  </p>
                </div>
              </Reveal>
            </div>

            <div className="relative min-h-[18rem] lg:min-h-full">
              <Image
                src="/images/fertility.jpg"
                alt="A couple's hands gently held together, representing fertility care and support"
                fill
                sizes="(max-width: 1024px) 92vw, 44vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-forest via-forest/40 to-transparent lg:from-forest/70 lg:via-transparent" />

              <div className="absolute inset-x-5 bottom-5 rounded-2xl border border-ivory/15 bg-forest-ink/40 p-4 backdrop-blur-md sm:inset-x-7 sm:bottom-7">
                <p className="text-[0.625rem] font-medium uppercase tracking-[0.16em] text-sage/68">
                  What to expect
                </p>
                <p className="mt-1.5 text-[0.8125rem] leading-relaxed text-ivory/85">
                  A careful assessment of your history and circumstances, followed
                  by a care pathway explained in plain language — including
                  onward referral where that is the right next step.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

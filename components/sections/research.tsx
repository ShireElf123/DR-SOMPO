"use client";

import Image from "next/image";
import { AlertCircle, BookOpen, FileText } from "lucide-react";
import { Reveal, RevealGroup, RevealItem, WordsIn } from "@/components/ui/motion";
import { research } from "@/lib/practice";

/**
 * Research & cervical health feature. Deliberately restrained: the study is
 * described, never quantified. A visible note explains why no statistics appear
 * — which is itself part of the practice's commitment to evidence integrity.
 */
export function Research() {
  return (
    <section id="research" className="relative py-16 sm:py-20 lg:py-24" aria-labelledby="research-heading">
      <div className="shell">
        <div className="grid gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:gap-14">
          <div>
            <Reveal>
              <span className="eyebrow">Research &amp; education</span>
            </Reveal>

            <h2
              id="research-heading"
              className="display mt-5 text-[clamp(1.85rem,4vw,2.85rem)] text-forest"
            >
              <WordsIn text="Advancing women's health through" />{" "}
              <span className="serif-accent">research and education.</span>
            </h2>

            {/* The thesis itself */}
            <Reveal delay={0.1}>
              <figure className="mt-8 rounded-[1.5rem] border border-forest/10 bg-white p-6 shadow-[var(--shadow-lift)] sm:p-7">
                <div className="flex items-center gap-2 text-forest/60">
                  <BookOpen className="h-4 w-4" aria-hidden="true" />
                  <span className="text-[0.625rem] font-semibold uppercase tracking-[0.16em]">
                    Master&apos;s research
                  </span>
                </div>

                <blockquote className="mt-3.5 text-[1.0625rem] font-medium leading-snug tracking-[-0.02em] text-forest sm:text-[1.1875rem]">
                  {research.title}
                </blockquote>

                <dl className="mt-5 grid gap-x-6 gap-y-3 border-t border-forest/8 pt-4 sm:grid-cols-2">
                  {[
                    { k: "Author", v: research.author },
                    { k: "Degree", v: research.degree },
                    { k: "Faculty", v: research.faculty },
                    { k: "Institution", v: research.institution },
                  ].map((row) => (
                    <div key={row.k}>
                      <dt className="text-[0.5625rem] font-semibold uppercase tracking-[0.16em] text-forest/52">
                        {row.k}
                      </dt>
                      <dd className="mt-1 text-[0.8125rem] leading-snug text-charcoal/72">{row.v}</dd>
                    </div>
                  ))}
                </dl>

                <div className="mt-5 flex items-start gap-2.5 rounded-xl bg-mint/80 p-3.5">
                  <FileText className="mt-0.5 h-3.5 w-3.5 shrink-0 text-forest/60" aria-hidden="true" />
                  <p className="text-[0.75rem] leading-relaxed text-charcoal/68">{research.focus}</p>
                </div>
              </figure>
            </Reveal>

            {/* Presentation history */}
            <Reveal delay={0.16}>
              <div className="mt-4 rounded-[1.5rem] border border-forest/8 bg-white/60 p-5">
                <p className="text-[0.5625rem] font-semibold uppercase tracking-[0.16em] text-forest/56">
                  Presentation &amp; publication history
                </p>
                <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                  {research.presentations.map((item) => (
                    <li
                      key={item.label}
                      className="flex items-start justify-between gap-2 rounded-xl border border-forest/8 bg-white px-3 py-2"
                    >
                      <div>
                        <p className="text-[0.75rem] font-medium leading-snug text-forest">
                          {item.label}
                        </p>
                        <p className="mt-0.5 text-[0.6875rem] leading-snug text-charcoal/62">
                          {item.detail}
                        </p>
                      </div>
                      <span
                        aria-hidden="true"
                        title={item.state === "pending" ? "Awaiting verification" : "Confirmed"}
                        className={
                          item.state === "pending"
                            ? "mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-gold ring-2 ring-gold/25"
                            : "mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-forest/45"
                        }
                      />
                    </li>
                  ))}
                </ul>
                <p className="mt-3 flex items-start gap-2 text-[0.6875rem] leading-relaxed text-charcoal/55">
                  <AlertCircle className="mt-0.5 h-3 w-3 shrink-0" aria-hidden="true" />
                  {research.disclaimer}
                </p>
              </div>
            </Reveal>
          </div>

          {/* Right column: image + accessible explanation */}
          <div>
            <Reveal y={28}>
              <div className="relative aspect-[16/11] overflow-hidden rounded-[1.75rem] bg-sage">
                <Image
                  src="/images/cervical-research.jpg"
                  alt="A laboratory microscope and research folders"
                  fill
                  sizes="(max-width: 1024px) 92vw, 44vw"
                  className="object-cover"
                />
              </div>
            </Reveal>

            <RevealGroup className="mt-6 space-y-4" stagger={0.09}>
              {research.context.map((item) => (
                <RevealItem key={item.title}>
                  <div className="rounded-2xl border border-forest/8 bg-white p-5">
                    <h3 className="text-[0.875rem] font-medium tracking-[-0.01em] text-forest">
                      {item.title}
                    </h3>
                    <p className="mt-1.5 text-[0.8125rem] leading-relaxed text-charcoal/68">
                      {item.body}
                    </p>
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

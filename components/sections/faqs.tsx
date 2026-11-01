"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Minus, Plus } from "lucide-react";
import { useId, useState } from "react";
import Image from "next/image";
import { Reveal } from "@/components/ui/motion";
import { faqs, practice } from "@/lib/practice";
import { cn } from "@/lib/utils";

export function Faqs() {
  const [open, setOpen] = useState<number | null>(0);
  const reduce = useReducedMotion();
  const baseId = useId();

  return (
    <section id="faqs" className="relative py-16 sm:py-20 lg:py-24" aria-labelledby="faqs-heading">
      <div className="shell">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <Reveal>
              <span className="eyebrow">Patient information</span>
            </Reveal>
            <Reveal delay={0.06}>
              <h2
                id="faqs-heading"
                className="display mt-5 text-[clamp(1.9rem,4vw,2.85rem)] text-forest"
              >
                Questions,{" "}
                <span className="serif-accent">answered.</span>
              </h2>
            </Reveal>
            <Reveal delay={0.12}>
              <p className="mt-4 max-w-sm text-[0.9375rem] leading-relaxed text-charcoal/68">
                Practical information about consultations, records and
                confidentiality. If your question is clinical, it is best answered
                in person.
              </p>
            </Reveal>
            <Reveal delay={0.18}>
              <div className="mt-6 rounded-2xl border border-forest/10 bg-mint/70 p-5">
                <p className="text-[0.8125rem] font-medium text-forest">
                  Still unsure?
                </p>
                <p className="mt-1.5 text-[0.8125rem] leading-relaxed text-charcoal/68">
                  Call the practice on{" "}
                  <a
                    href={practice.phoneHref}
                    className="font-medium text-forest underline decoration-forest/25 underline-offset-4 hover:decoration-forest"
                  >
                    {practice.phone}
                  </a>{" "}
                  and the team will help you find the right next step.
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.24}>
              <div className="relative mt-4 hidden aspect-[4/3] overflow-hidden rounded-[1.5rem] bg-sage sm:block">
                <Image
                  src="/images/patient-quiet.jpg"
                  alt="A patient sitting calmly in the clinic waiting area"
                  fill
                  sizes="(max-width: 1024px) 92vw, 34vw"
                  className="object-cover"
                />
              </div>
            </Reveal>
          </div>

          <div>
            <ul className="border-t border-forest/10">
              {faqs.map((faq, i) => {
                const isOpen = open === i;
                const panelId = `${baseId}-panel-${i}`;
                const buttonId = `${baseId}-button-${i}`;

                return (
                  <li key={faq.q} className="border-b border-forest/10">
                    <h3>
                      <button
                        type="button"
                        id={buttonId}
                        aria-expanded={isOpen}
                        aria-controls={panelId}
                        onClick={() => setOpen(isOpen ? null : i)}
                        className="group flex w-full items-start justify-between gap-6 py-5 text-left"
                      >
                        <span
                          className={cn(
                            "text-[0.9375rem] font-medium leading-snug tracking-[-0.01em] transition-colors duration-300 sm:text-base",
                            isOpen ? "text-forest" : "text-charcoal/80 group-hover:text-forest",
                          )}
                        >
                          {faq.q}
                        </span>
                        <span
                          className={cn(
                            "mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition-colors duration-300",
                            isOpen
                              ? "border-forest bg-forest text-ivory"
                              : "border-forest/15 text-forest group-hover:border-forest/35",
                          )}
                        >
                          {isOpen ? (
                            <Minus className="h-3.5 w-3.5" aria-hidden="true" />
                          ) : (
                            <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                          )}
                        </span>
                      </button>
                    </h3>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          id={panelId}
                          role="region"
                          aria-labelledby={buttonId}
                          initial={reduce ? undefined : { height: 0, opacity: 0 }}
                          animate={reduce ? undefined : { height: "auto", opacity: 1 }}
                          exit={reduce ? undefined : { height: 0, opacity: 0 }}
                          transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
                          className="overflow-hidden"
                        >
                          <p className="max-w-xl pb-6 pr-10 text-[0.875rem] leading-relaxed text-charcoal/68">
                            {faq.a}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

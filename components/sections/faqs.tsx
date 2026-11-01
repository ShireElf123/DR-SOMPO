"use client";

import Image from "next/image";
import { Plus } from "lucide-react";
import { useState } from "react";
import { Reveal, WordsIn } from "@/components/ui/motion";
import { faqs, practice } from "@/lib/practice";
import { cn } from "@/lib/utils";

export function Faqs() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faqs" className="sec sec-tint" aria-labelledby="faqs-heading">
      <div className="shell">
        <div className="mb-9 grid items-center gap-6 sm:grid-cols-[1fr_auto] sm:gap-10">
          <div className="text-center sm:text-left">
            <span className="tag">Patient information</span>
            <h2 id="faqs-heading" className="text-[clamp(1.7rem,3.4vw,2.4rem)]">
              <WordsIn text="Questions, answered." />
            </h2>
            <p className="mx-auto mt-3 max-w-md text-[13px] leading-relaxed text-ink-soft sm:mx-0">
              If something is not covered here, the practice would rather you
              asked than wondered.
            </p>
          </div>
          <Reveal y={18} className="mx-auto w-full max-w-[16rem] sm:mx-0">
            <div className="relative aspect-[16/11] overflow-hidden rounded-[1.15rem] bg-sage">
              <Image
                src="/images/waiting-room.jpg"
                alt="The practice waiting area"
                fill
                sizes="(max-width: 640px) 80vw, 16rem"
                className="object-cover"
              />
            </div>
          </Reveal>
        </div>

        <div className="mx-auto max-w-[46rem]">
          <ul>
            {faqs.map((faq, i) => {
              const isOpen = open === i;
              return (
                <li key={faq.q} className="border-b border-charcoal/10 first:border-t">
                  <h3>
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={`faq-panel-${i}`}
                      id={`faq-button-${i}`}
                      onClick={() => setOpen(isOpen ? null : i)}
                      className="flex w-full items-center justify-between gap-5 py-4 text-left"
                    >
                      <span
                        className={cn(
                          "text-[15px] font-normal tracking-[-0.01em] transition-colors",
                          isOpen ? "text-forest" : "text-ink-soft",
                        )}
                      >
                        {faq.q}
                      </span>
                      <span
                        className={cn(
                          "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition-all duration-500",
                          isOpen
                            ? "rotate-45 border-forest bg-forest text-white"
                            : "border-charcoal/20 text-ink-soft",
                        )}
                      >
                        <Plus className="h-3 w-3" aria-hidden="true" />
                      </span>
                    </button>
                  </h3>

                  {/* grid-rows trick keeps the open/close buttery without measuring */}
                  <div
                    id={`faq-panel-${i}`}
                    role="region"
                    aria-labelledby={`faq-button-${i}`}
                    className={cn(
                      "grid transition-all duration-500 ease-[cubic-bezier(.16,1,.3,1)]",
                      isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
                    )}
                  >
                    <div className="overflow-hidden">
                      <p className="max-w-[38rem] pb-5 text-[13px] leading-relaxed text-ink-soft">
                        {faq.a}
                      </p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>

          <p className="mt-6 text-center text-[12px] text-ink-soft">
            Still unsure? Call{" "}
            <a
              href={practice.phoneHref}
              className="font-medium text-forest underline decoration-forest/25 underline-offset-4"
            >
              {practice.phone}
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}

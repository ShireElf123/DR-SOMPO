"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import { WordsIn } from "@/components/ui/motion";
import { faqs, practice } from "@/lib/practice";
import { cn } from "@/lib/utils";

export function Faqs() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faqs" className="sec sec-tint" aria-labelledby="faqs-heading">
      <div className="shell">
        <div className="mb-9 text-center">
          <span className="tag">Patient information</span>
          <h2 id="faqs-heading" className="text-[clamp(1.7rem,3.4vw,2.4rem)]">
            <WordsIn text="Questions, answered." />
          </h2>
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
                          isOpen ? "text-forest" : "text-charcoal/85",
                        )}
                      >
                        {faq.q}
                      </span>
                      <span
                        className={cn(
                          "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition-all duration-500",
                          isOpen
                            ? "rotate-45 border-forest bg-forest text-white"
                            : "border-charcoal/20 text-charcoal/50",
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
                      <p className="max-w-[38rem] pb-5 text-[13px] leading-relaxed text-charcoal/60">
                        {faq.a}
                      </p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>

          <p className="mt-6 text-center text-[12px] text-charcoal/45">
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

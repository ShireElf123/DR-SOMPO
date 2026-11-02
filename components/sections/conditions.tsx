"use client";

import Image from "@/components/ui/practice-image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { m } from "framer-motion";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { ArrowUpRight, Search } from "lucide-react";
import { SectionHead } from "@/components/page-hero";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/motion";
import { conditionGroups } from "@/lib/practice";
import { cn } from "@/lib/utils";

/**
 * "Conditions treated" — the block the practice leads with when she describes
 * her own work, and the one thing the site was missing.
 *
 * A patient arrives with a symptom, not a service name. She does not search for
 * "general gynaecological consultations"; she searches for "painful periods" or
 * "abnormal pap smear". So this section is indexed by condition, grouped by the
 * stage of life it belongs to, and every condition links to the service that
 * actually handles it.
 *
 * The filter is deliberately instant, client-side and local — no index, no
 * network call, no analytics on what a patient typed. A health site should not
 * be able to tell that someone searched "bleeding in early pregnancy".
 */

const stageImages: Record<string, { image: string; alt: string }> = {
  pregnancy: {
    image: "/images/antenatal.jpg",
    alt: "An expectant mother resting in a bright consulting room",
  },
  cycle: {
    image: "/images/gynae.jpg",
    alt: "A calm consulting room with folded linens and natural light",
  },
  screening: {
    image: "/images/cervical-research.jpg",
    alt: "A microscope in a research setting",
  },
  fertility: {
    image: "/images/fertility.jpg",
    alt: "A couple's hands held together, representing fertility care",
  },
  surgery: {
    image: "/images/surgery.jpg",
    alt: "Laparoscopic equipment in a modern theatre suite",
  },
};

export function ConditionsTreated() {
  const reduce = useReducedMotion();
  const [query, setQuery] = useState("");

  const term = query.trim().toLowerCase();

  const filtered = useMemo(() => {
    if (!term) return conditionGroups;
    return conditionGroups
      .map((group) => ({
        ...group,
        conditions: group.conditions.filter((condition) =>
          condition.toLowerCase().includes(term),
        ),
      }))
      .filter((group) => group.conditions.length > 0);
  }, [term]);

  const total = filtered.reduce((sum, group) => sum + group.conditions.length, 0);

  return (
    <section
      id="conditions"
      className="sec sec-tint scroll-mt-24"
      aria-labelledby="conditions-heading"
    >
      <div className="shell">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionHead
              id="conditions-heading"
            tag="Conditions treated"
            title="Start with what you are"
            muted="actually experiencing."
            intro="You do not need to know which service you need. Find the symptom — the practice will work out the rest with you in the consulting room."
          />

          <Reveal delay={0.08} y={18}>
            <div className="relative w-full lg:w-[19rem]">
              <label htmlFor="condition-search" className="sr-only">
                Search conditions treated
              </label>
              <Search
                className="pointer-events-none absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink-muted"
                aria-hidden="true"
              />
              <input
                id="condition-search"
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search a symptom or condition"
                className="w-full rounded-full border border-charcoal/12 bg-white py-2.5 pl-9 pr-4 text-[12.5px] text-ink outline-none transition-colors duration-300 placeholder:text-ink-muted focus:border-ember/45 focus:ring-2 focus:ring-ember/12"
              />
              <p aria-live="polite" className="sr-only">
                {term
                  ? `${total} conditions match ${query}`
                  : `${total} conditions listed`}
              </p>
            </div>
          </Reveal>
        </div>

        {term && (
          <p className="mt-4 text-[11.5px] text-ink-soft">
            {total === 0
              ? "Nothing here matches that wording — try a shorter phrase, or simply call the practice."
              : `${total} ${total === 1 ? "condition" : "conditions"} matching “${query}”.`}
          </p>
        )}

        <div className="mt-8 grid gap-3.5 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((group, index) => {
            const media = stageImages[group.id];
            const isFiltering = Boolean(term);

            return (
              <m.article
                key={group.id}
                initial={reduce ? undefined : { opacity: 0, y: 16 }}
                animate={reduce ? undefined : { opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.04, ease: [0.16, 1, 0.3, 1] }}
                className={cn(
                  "flex flex-col overflow-hidden rounded-[1.35rem] bg-white border-hairline border-charcoal/8",
                  isFiltering && "border-ember/20",
                )}
              >
                {/* Photography first — the plate carries the stage of life, not
                    a service code. */}
                <div className="photo-depth relative aspect-[16/9] overflow-hidden bg-peach">
                  <Image
                    src={media.image}
                    alt={media.alt}
                    fill
                    sizes="(max-width: 768px) 92vw, (max-width: 1024px) 46vw, 30vw"
                    className="object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-[1.04]"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ember/50 via-ember/10 to-transparent" />
                  <div className="glass absolute inset-x-3 bottom-3 z-[2] rounded-lg px-3 py-2">
                    <p className="text-[9px] uppercase tracking-[0.16em] text-ink/75">
                      {group.stage}
                    </p>
                    <h3 className="mt-1 text-[15px] font-light leading-tight tracking-[-0.02em] text-ink">
                      {group.label}
                    </h3>
                  </div>
                  <span className="glass absolute right-3 top-3 z-[2] grid h-6 w-6 place-items-center rounded-full text-[9.5px] font-medium text-ink">
                    {group.conditions.length}
                  </span>
                </div>

                <div className="flex flex-1 flex-col p-4">
                  <p className="text-[11.5px] leading-relaxed text-ink-soft">
                    {group.intro}
                  </p>

                  <RevealGroup className="mt-3 flex flex-1 flex-wrap content-start gap-1.5" stagger={0.02}>
                    {group.conditions.map((condition) => (
                      <RevealItem key={condition}>
                        <span className="inline-block rounded-full bg-cream px-2.5 py-1 text-[10.5px] leading-snug text-ink-soft">
                          {condition}
                        </span>
                      </RevealItem>
                    ))}
                  </RevealGroup>

                  <Link
                    href={`/services/${group.serviceId}`}
                    className="group mt-4 inline-flex items-center gap-1.5 border-t-hairline border-charcoal/8 pt-2.5 text-[10.5px] font-medium text-ink"
                  >
                    How this is handled
                    <ArrowUpRight className="h-2.5 w-2.5 transition-transform duration-500 group-hover:rotate-45" />
                  </Link>
                </div>
              </m.article>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="mt-8 rounded-[1.35rem] bg-white p-6 border-hairline border-charcoal/8">
            <p className="text-[13px] leading-relaxed text-ink-soft">
              This list covers the conditions the practice is most often asked
              about, not every condition it can assess. If you cannot find what you
              are looking for, that does not mean it cannot be helped — call the
              practice and ask.
            </p>
            <Link href="/contact" className="btn btn mt-4">
              Contact the practice
              <i aria-hidden="true">
                <ArrowUpRight className="h-3 w-3" />
              </i>
            </Link>
          </div>
        )}

        <Reveal delay={0.1}>
          <p className="mt-6 max-w-2xl text-[11px] leading-relaxed text-ink-soft">
            This list is for orientation, not diagnosis. Nothing on this page tells
            you what you have — that is what a consultation is for. Where a
            condition needs a specialist outside this practice, referral is
            arranged and the reason for it is explained.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

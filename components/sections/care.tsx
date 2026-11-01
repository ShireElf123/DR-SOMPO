"use client";

import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { Reveal, RevealGroup, RevealItem, WordsIn } from "@/components/ui/motion";
import { serviceGroups } from "@/lib/practice";
import { cn } from "@/lib/utils";

/**
 * Detail sections for the three core care streams. Each is asymmetric — the
 * image alternates side to side so the page keeps an editorial rhythm instead
 * of stacking into a symmetrical column of cards.
 */
export function Care() {
  const blocks = [
    {
      id: "obstetrics",
      group: serviceGroups.find((g) => g.id === "obstetrics")!,
      image: "/images/antenatal.jpg",
      alt: "Expectant mother at a routine antenatal visit",
      kicker: "Obstetrics & maternity care",
      imageFirst: true,
      aside: {
        label: "Delivered at",
        value: "Life Roseacres Hospital, Primrose",
      },
    },
    {
      id: "gynaecology",
      group: serviceGroups.find((g) => g.id === "gynaecology")!,
      image: "/images/gynae.jpg",
      alt: "Calm still life of folded linens and eucalyptus in a consulting room",
      kicker: "Gynaecology",
      imageFirst: false,
      aside: {
        label: "Appropriate for",
        value: "Adolescence through menopause and beyond",
      },
    },
    {
      id: "surgery",
      group: serviceGroups.find((g) => g.id === "surgery")!,
      image: "/images/surgery.jpg",
      alt: "Laparoscopic equipment in a modern theatre suite",
      kicker: "Minimally invasive & open surgery",
      imageFirst: true,
      aside: {
        label: "Before any procedure",
        value: "A full discussion of options, risks and recovery",
      },
    },
  ];

  return (
    <section className="relative py-8 sm:py-10" aria-labelledby="care-heading">
      <div className="shell">
        <h2 id="care-heading" className="sr-only">
          Obstetric, gynaecological and surgical care
        </h2>

        <div className="space-y-5 sm:space-y-6">
          {blocks.map((block) => (
            <div
              key={block.id}
              id={block.id}
              className="scroll-mt-28 overflow-hidden rounded-[1.75rem] border border-forest/8 bg-white shadow-[var(--shadow-lift)] sm:rounded-[2rem]"
            >
              <div
                className={cn(
                  "grid lg:grid-cols-2",
                  !block.imageFirst && "lg:[&>*:first-child]:order-2",
                )}
              >
                <div className="relative min-h-[15rem] lg:min-h-[24rem]">
                  <Image
                    src={block.image}
                    alt={block.alt}
                    fill
                    sizes="(max-width: 1024px) 92vw, 46vw"
                    className="object-cover"
                  />
                  <div
                    className={cn(
                      "absolute inset-0",
                      block.imageFirst
                        ? "bg-gradient-to-r from-transparent to-white/10 lg:bg-gradient-to-l lg:from-white/20 lg:to-transparent"
                        : "bg-gradient-to-l from-transparent to-white/10",
                    )}
                  />
                </div>

                <div className="flex flex-col justify-center p-7 sm:p-10 lg:p-12">
                  <Reveal>
                    <span className="text-[0.625rem] font-semibold uppercase tracking-[0.18em] text-forest/56">
                      {block.kicker}
                    </span>
                  </Reveal>

                  <h3 className="display mt-3 text-[clamp(1.6rem,3vw,2.15rem)] text-forest">
                    <WordsIn text={block.group.headline} stagger={0.035} />
                  </h3>

                  <Reveal delay={0.08}>
                    <p className="mt-3.5 max-w-md text-[0.9375rem] leading-relaxed text-charcoal/68">
                      {block.group.intro}
                    </p>
                  </Reveal>

                  <RevealGroup className="mt-6 grid gap-x-6 gap-y-4 sm:grid-cols-2" stagger={0.06}>
                    {block.group.services.map((service) => (
                      <RevealItem key={service.id}>
                        <div className="border-t border-forest/10 pt-3">
                          <p className="text-[0.875rem] font-medium leading-snug tracking-[-0.01em] text-forest">
                            {service.title}
                          </p>
                          <ul className="mt-1.5 space-y-1">
                            {service.items.map((item) => (
                              <li
                                key={item}
                                className="flex items-start gap-1.5 text-[0.75rem] leading-relaxed text-charcoal/66"
                              >
                                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-forest/35" />
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </RevealItem>
                    ))}
                  </RevealGroup>

                  <Reveal delay={0.12}>
                    <div className="mt-7 flex flex-wrap items-center justify-between gap-3 border-t border-forest/10 pt-4">
                      <p className="text-[0.6875rem] leading-relaxed text-charcoal/60">
                        <span className="font-medium uppercase tracking-[0.12em] text-forest/60">
                          {block.aside.label}:{" "}
                        </span>
                        {block.aside.value}
                      </p>
                      <a
                        href="#contact"
                        className="group inline-flex items-center gap-1.5 text-[0.8125rem] font-medium text-forest"
                      >
                        Enquire
                        <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </a>
                    </div>
                  </Reveal>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

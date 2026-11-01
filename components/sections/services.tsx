"use client";

import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { Reveal, ScrollWords, WordsIn } from "@/components/ui/motion";
import { cn } from "@/lib/utils";

type Tile = {
  title: string;
  blurb: string;
  gradient: string;
  image: string;
};

/**
 * Service gallery — eight square tiles on a gradient ground with a soft
 * silhouette printed on each. Hover lifts the colour out and swaps in the
 * photograph plus the blurb, exactly like the reference's services grid.
 */
const tiles: Tile[] = [
  {
    title: "Antenatal care",
    blurb: "Regular monitoring and support through every trimester.",
    gradient: "linear-gradient(160deg,#2f7a62,#9cc7b2)",
    image: "/images/antenatal.jpg",
  },
  {
    title: "Delivery",
    blurb: "Vaginal and caesarean delivery at Life Roseacres Hospital.",
    gradient: "linear-gradient(160deg,#d9bfa5,#efe1d0)",
    image: "/images/consultation.jpg",
  },
  {
    title: "Contraception",
    blurb: "Advice on options that suit your body and your life.",
    gradient: "linear-gradient(160deg,#c9c3b5,#e4dfd2)",
    image: "/images/gynae.jpg",
  },
  {
    title: "Menstrual health",
    blurb: "Assessment of cycles and reproductive health concerns.",
    gradient: "linear-gradient(160deg,#6b8f7f,#c9dccf)",
    image: "/images/patient-quiet.jpg",
  },
  {
    title: "Fertility",
    blurb: "Fertility assessment and care pathways tailored to you.",
    gradient: "linear-gradient(160deg,#174d3c,#6ea58f)",
    image: "/images/fertility.jpg",
  },
  {
    title: "Screening",
    blurb: "Female health screening and gynaecological oncology assessment.",
    gradient: "linear-gradient(160deg,#b8c9bf,#eaf4ee)",
    image: "/images/cervical-research.jpg",
  },
  {
    title: "Fibroids & cysts",
    blurb: "Minimally invasive and open surgical management.",
    gradient: "linear-gradient(160deg,#cfc3a6,#e9dfc6)",
    image: "/images/surgery.jpg",
  },
  {
    title: "Hysterectomy",
    blurb: "Including total laparoscopic hysterectomy.",
    gradient: "linear-gradient(160deg,#8d9d94,#d3ddd6)",
    image: "/images/hospital-exterior.jpg",
  },
];

export function Services() {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <>
      {/* Scroll-lit statement */}
      <section className="bg-white pb-16 pt-14 sm:pb-20 sm:pt-16">
        <div className="shell">
          <ScrollWords
            text="Compassionate, personalised and evidence-informed care, supporting women through every stage of life with specialist expertise, empathy and dignity."
            avatars={[9, 17]}
            className="mx-auto max-w-[46rem] text-center text-[clamp(1.25rem,2.6vw,1.65rem)] leading-[1.35] tracking-[-0.02em]"
          />
        </div>
      </section>

      {/* Services grid */}
      <section id="services" className="sec sec-tint" aria-labelledby="services-heading">
        <div className="shell">
          <div className="mb-9 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-xl">
              <span className="tag">What we care for</span>
              <h2
                id="services-heading"
                className="text-[clamp(1.75rem,3.6vw,2.5rem)] leading-[1.05]"
              >
                <WordsIn text="Care for every stage of life:" />
              </h2>
              <p className="mt-3 max-w-sm text-[13px] leading-relaxed text-charcoal/55">
                Obstetrics, gynaecology, fertility and surgery — one practice,
                one standard of care.
              </p>
            </div>
            <a href="#contact" className="btn self-start sm:self-auto">
              Book an appointment
              <i aria-hidden="true">
                <ArrowUpRight className="h-3 w-3" />
              </i>
            </a>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-3.5 lg:grid-cols-4">
            {tiles.map((tile, i) => {
              const isOn = hovered === i;
              return (
                <Reveal key={tile.title} delay={(i % 4) * 0.07} y={26}>
                  <a
                    href="#contact"
                    onMouseEnter={() => setHovered(i)}
                    onMouseLeave={() => setHovered(null)}
                    onFocus={() => setHovered(i)}
                    onBlur={() => setHovered(null)}
                    className="group relative block aspect-[1/1.1] overflow-hidden rounded-[1.25rem]"
                    style={{ background: tile.gradient }}
                  >
                    {/* photograph that fades up on hover */}
                    <Image
                      src={tile.image}
                      alt=""
                      fill
                      sizes="(max-width: 640px) 46vw, 22vw"
                      className={cn(
                        "object-cover transition-all duration-700 ease-out",
                        isOn ? "scale-100 opacity-100" : "scale-105 opacity-0",
                      )}
                    />
                    <span
                      aria-hidden="true"
                      className={cn(
                        "absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0)_35%,rgba(0,0,0,0.55))] transition-opacity duration-500",
                        isOn ? "opacity-100" : "opacity-0",
                      )}
                    />

                    {/* soft silhouette, matching the reference's figure motif */}
                    <span
                      aria-hidden="true"
                      className={cn(
                        "pointer-events-none absolute inset-0 transition-all duration-700",
                        isOn ? "scale-105 opacity-0" : "opacity-100",
                      )}
                      style={{
                        backgroundImage:
                          "radial-gradient(ellipse 15% 17% at 50% 37%, rgba(255,255,255,.55) 97%, transparent 100%), radial-gradient(ellipse 5% 8% at 50% 53%, rgba(255,255,255,.5) 97%, transparent 100%), radial-gradient(ellipse 21% 25% at 50% 38%, rgba(255,255,255,.22) 97%, transparent 100%), radial-gradient(ellipse 52% 32% at 50% 104%, rgba(255,255,255,.5) 97%, transparent 100%)",
                      }}
                    />

                    {/* blurb, revealed on hover */}
                    <span
                      className={cn(
                        "absolute inset-x-0 top-0 p-4 text-[11.5px] leading-snug text-white transition-all duration-500",
                        isOn ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0",
                      )}
                    >
                      {tile.blurb}
                    </span>

                    <span className="absolute bottom-3 left-3 rounded-full bg-black/85 px-3.5 py-1 text-[10.5px] font-medium text-white backdrop-blur-sm">
                      {tile.title}
                    </span>
                    <span
                      className={cn(
                        "absolute bottom-3 right-3 flex h-6 w-6 items-center justify-center rounded-full bg-white text-black transition-transform duration-500",
                        isOn ? "rotate-45" : "rotate-0",
                      )}
                    >
                      <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
                    </span>
                  </a>
                </Reveal>
              );
            })}
          </div>

          <p className="mt-5 text-[11px] leading-relaxed text-charcoal/40">
            All listed services and procedures are subject to confirmation
            against Dr Somp&apos;s current practice and hospital privileges.
          </p>
        </div>
      </section>
    </>
  );
}

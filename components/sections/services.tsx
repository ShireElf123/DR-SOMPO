"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Reveal, ScrollWords } from "@/components/ui/motion";
import { SectionHead } from "@/components/page-hero";

type Tile = {
  title: string;
  blurb: string;
  image: string;
  href: string;
  span?: string;
};

/**
 * Service gallery — photography visible in every tile, full bleed, with a slow
 * hover zoom and a caption plate. No silhouette placeholders, no hover reveal.
 * Tiles link to the dedicated services page.
 */
const tiles: Tile[] = [
  {
    title: "Antenatal care",
    blurb: "Monitoring and support through every trimester.",
    image: "/images/antenatal.jpg",
    href: "/services#obstetrics",
    span: "sm:col-span-2 lg:col-span-2 lg:row-span-2",
  },
  {
    title: "Delivery",
    blurb: "Vaginal and caesarean delivery.",
    image: "/images/consultation.jpg",
    href: "/services#obstetrics",
  },
  {
    title: "Fertility",
    blurb: "Assessment and care pathways.",
    image: "/images/fertility.jpg",
    href: "/services#fertility",
  },
  {
    title: "Gynaecology",
    blurb: "Consultations, contraception, screening.",
    image: "/images/gynae.jpg",
    href: "/services#gynaecology",
  },
  {
    title: "Surgery",
    blurb: "Minimally invasive and open procedures.",
    image: "/images/surgery.jpg",
    href: "/services#surgery",
  },
  {
    title: "Cervical health",
    blurb: "Screening, HPV prevention and follow-up.",
    image: "/images/cervical-research.jpg",
    href: "/research",
  },
  {
    title: "The practice",
    blurb: "Life Roseacres Hospital, Primrose.",
    image: "/images/hospital-exterior.jpg",
    href: "/contact",
  },
];

export function Services() {
  return (
    <>
      {/* Scroll-lit statement, flanked by two plates so the block carries
          photography rather than sitting as a bare paragraph. */}
      <section className="bg-white pb-12 pt-12 sm:pb-16 sm:pt-16">
        <div className="shell">
          <div className="grid items-center gap-6 lg:grid-cols-[0.62fr_1.6fr_0.62fr] lg:gap-8">
            <Reveal y={26} className="hidden lg:block">
              <div className="relative aspect-[3/4] overflow-hidden rounded-[1.25rem] bg-sage">
                <Image
                  src="/images/waiting-room.jpg"
                  alt="The practice waiting area"
                  fill
                  sizes="20vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-forest-ink/40 to-transparent" />
              </div>
            </Reveal>

            <ScrollWords
              text="Compassionate, personalised and evidence-informed care, supporting women through every stage of life with specialist expertise, empathy and dignity."
              avatars={[9, 17]}
              className="mx-auto max-w-[40rem] text-center text-[clamp(1.15rem,2.4vw,1.55rem)] leading-[1.35] tracking-[-0.02em]"
            />

            <Reveal y={26} delay={0.1} className="hidden lg:block">
              <div className="relative aspect-[3/4] overflow-hidden rounded-[1.25rem] bg-sage">
                <Image
                  src="/images/screening-room.jpg"
                  alt="A consultation room at the practice"
                  fill
                  sizes="20vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-forest-ink/40 to-transparent" />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="sec sec-tint" aria-labelledby="services-heading">
        <div className="shell">
          <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <SectionHead
              tag="What we care for"
              title="Care for every stage of life"
              intro="Obstetrics, gynaecology, fertility and surgery — one practice, one standard of care."
            />
            <Link href="/services" className="btn self-start sm:self-auto">
              All services
              <i aria-hidden="true">
                <ArrowUpRight className="h-3 w-3" />
              </i>
            </Link>
          </div>

          <div className="grid auto-rows-[13rem] grid-cols-2 gap-3 sm:gap-3.5 lg:grid-cols-4">
            {tiles.map((tile, i) => (
              <Reveal
                key={tile.title}
                delay={(i % 4) * 0.06}
                y={22}
                className={tile.span}
              >
                <Link
                  href={tile.href}
                  data-cursor="View"
                  className="group relative flex h-full min-h-[13rem] flex-col justify-end overflow-hidden rounded-[1.25rem] bg-sage p-4"
                >
                  <Image
                    src={tile.image}
                    alt={tile.title}
                    fill
                    sizes="(max-width: 640px) 46vw, (max-width: 1024px) 46vw, 30vw"
                    className="object-cover transition-transform duration-[1100ms] ease-out group-hover:scale-[1.05]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-forest-ink/80 via-forest-ink/20 to-transparent" />

                  <div className="relative">
                    <p className="text-[12.5px] font-medium text-white">{tile.title}</p>
                    <p className="mt-0.5 max-w-[14rem] text-[11px] leading-snug text-white/80">
                      {tile.blurb}
                    </p>
                  </div>

                  <span
                    aria-hidden="true"
                    className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-white/90 text-black transition-transform duration-500 group-hover:rotate-45"
                  >
                    <ArrowUpRight className="h-3 w-3" />
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>

          <p className="mt-5 text-[11px] leading-relaxed text-ink-soft">
            All listed services and procedures are subject to confirmation
            against Dr Somp&apos;s current practice and hospital privileges.
          </p>
        </div>
      </section>
    </>
  );
}

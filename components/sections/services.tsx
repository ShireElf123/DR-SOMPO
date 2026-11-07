import Image from "@/components/ui/practice-image";
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
    href: "/services/antenatal",
    span: "col-span-full lg:col-span-2 lg:row-span-2",
  },
  {
    title: "Delivery",
    blurb: "Vaginal and caesarean delivery.",
    image: "/images/consultation.jpg",
    href: "/services/delivery",
  },
  {
    title: "Fertility",
    blurb: "Assessment and care pathways.",
    image: "/images/fertility.jpg",
    href: "/services/fertility-assessment",
  },
  {
    title: "Gynaecology",
    blurb: "Consultations, contraception, screening.",
    image: "/images/gynae.jpg",
    href: "/services/general",
  },
  {
    title: "Surgery",
    blurb: "Minimally invasive and open procedures.",
    image: "/images/surgery.jpg",
    href: "/services/laparoscopy",
  },
  {
    title: "Cervical health",
    blurb: "Screening, HPV prevention and follow-up.",
    image: "/images/cervical-research.jpg",
    href: "/services/oncology",
  },
  {
    title: "The practice",
    blurb: "Life Roseacres Hospital, Primrose.",
    image: "/images/hospital-exterior.jpg",
    href: "/contact",
    span: "lg:col-span-3",
  },
];

export function Services() {
  return (
    <>
      {/* Scroll-lit statement, flanked by two plates so the block carries
          photography rather than sitting as a bare paragraph. */}
      <section className="bg-cream pb-12 pt-12 sm:pb-16 sm:pt-16">
        <div className="shell">
          <div className="grid items-center gap-6 lg:grid-cols-[0.62fr_1.6fr_0.62fr] lg:gap-8">
            <Reveal y={26} className="hidden lg:block">
              <div className="photo-depth relative aspect-[3/4] overflow-hidden rounded-[1.25rem] bg-peach">
                <Image
                  src="/images/waiting-room.jpg"
                  alt="The practice waiting area"
                  fill
                  sizes="20vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ember/8 to-transparent" />
              </div>
            </Reveal>

            <ScrollWords
              text="A women's health advocate from adolescence to childbirth, menopause and beyond — one specialist, one standard of care, and every step explained."
              className="mx-auto max-w-[40rem] text-center text-[clamp(1.15rem,2.4vw,1.55rem)] leading-[1.35] tracking-[-0.02em]"
            />

            <Reveal y={26} delay={0.1} className="hidden lg:block">
              <div className="photo-depth relative aspect-[3/4] overflow-hidden rounded-[1.25rem] bg-peach">
                <Image
                  src="/images/screening-room.jpg"
                  alt="A consultation room at the practice"
                  fill
                  sizes="20vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ember/8 to-transparent" />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="sec sec-tint" aria-labelledby="services-heading">
        <div className="shell">
          <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <SectionHead
              id="services-heading"
              tag="What we care for"
              title="Care for every stage of life"
              intro="Antenatal and delivery care, contraception, fertility assessment, screening and surgery — one practice, one standard of care."
            />
            <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
              <Link href="/services#conditions" className="btn">
                Conditions we treat
                <i aria-hidden="true">
                  <ArrowUpRight className="h-3 w-3" />
                </i>
              </Link>
              <Link
                href="/services"
                className="btn btn-light shadow-none ring-1 ring-charcoal/12"
              >
                All services
                <i aria-hidden="true">
                  <ArrowUpRight className="h-3 w-3" />
                </i>
              </Link>
            </div>
          </div>

          {/* One card per row on phones. Two 169px columns forced a 2.18:1
              photograph of the hospital into a 0.81 frame — 63% of the picture
              was cropped away — so the phone layout gives every photograph the
              full column and a 1.56 frame instead. */}
          <div className="grid grid-cols-1 auto-rows-[14rem] gap-3 sm:grid-cols-2 sm:auto-rows-[11rem] sm:gap-3.5 lg:auto-rows-[13rem] lg:grid-cols-4">
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
                  className="photo-depth group relative flex h-full flex-col justify-end overflow-hidden rounded-[1.25rem] bg-peach p-3"
                >
                  <Image
                    src={tile.image}
                    alt={tile.title}
                    fill
                    sizes="(max-width: 639px) 92vw, (max-width: 1023px) 46vw, 30vw"
                    className="object-cover transition-transform duration-[1100ms] ease-out group-hover:scale-[1.05]"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ember/18 to-transparent" />

                  <div className="glass relative z-[2] w-fit max-w-[26rem] rounded-[0.9rem] px-3 py-2.5">
                    <p className="text-[12px] font-medium text-ink">{tile.title}</p>
                    <p className="mt-0.5 max-w-[14rem] text-[11px] leading-snug text-ink-soft">
                      {tile.blurb}
                    </p>
                  </div>

                  <span
                    aria-hidden="true"
                    className="absolute right-3 top-3 z-[2] flex h-6 w-6 items-center justify-center rounded-full bg-charcoal text-cream transition-transform duration-500 group-hover:rotate-45"
                  >
                    <ArrowUpRight className="h-3 w-3" />
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>

          <p className="mt-5 text-[11px] leading-relaxed text-ink-soft">
            All listed services and procedures are subject to confirmation
            against Dr Sompo&apos;s current practice and hospital privileges.
          </p>
        </div>
      </section>
    </>
  );
}

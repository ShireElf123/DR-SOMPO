import Image from "@/components/ui/practice-image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Reveal, ScrollWords } from "@/components/ui/motion";
import { BotanicalSprig } from "@/components/ui/botanical";
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
    blurb: "Consultations, contraception, pelvic floor & screening.",
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
    blurb: "Sessional Room 5, Ground Floor, East Wing — Life Roseacres Hospital.",
    image: "/images/hospital-exterior.jpg",
    href: "/contact",
    span: "lg:col-span-3",
  },
];

export function Services() {
  return (
    <>
      {/* Scroll-lit statement, flanked by two arched sanctuary plates so the
          block carries photography rather than sitting as a bare paragraph. */}
      <section className="bg-cream pb-12 pt-12 sm:pb-16 sm:pt-16">
        <div className="shell">
          <div className="grid items-center gap-6 lg:grid-cols-[0.62fr_1.6fr_0.62fr] lg:gap-8">
            <Reveal y={26} className="hidden lg:block">
              <div className="arch-frame bg-blush/80 p-1.5 ring-1 ring-ember/15">
                <div className="arch-frame photo-depth relative aspect-[3/4] overflow-hidden bg-peach">
                  <Image
                    src="/images/waiting-room.jpg"
                    alt="The practice waiting area"
                    fill
                    sizes="20vw"
                    className="object-cover"
                  />
                </div>
              </div>
            </Reveal>

            <div>
              <BotanicalSprig className="mx-auto mb-3.5" />
              <ScrollWords
                text="A women's health advocate from adolescence to childbirth, menopause and beyond — one specialist, one standard of care, and every step explained."
                className="mx-auto max-w-[40rem] text-center text-[clamp(1.15rem,2.4vw,1.55rem)] leading-[1.38] tracking-[-0.02em]"
              />
            </div>

            <Reveal y={26} delay={0.1} className="hidden lg:block">
              <div className="arch-frame bg-blush/80 p-1.5 ring-1 ring-ember/15">
                <div className="arch-frame photo-depth relative aspect-[3/4] overflow-hidden bg-peach">
                  <Image
                    src="/images/screening-room.jpg"
                    alt="A consultation room at the practice"
                    fill
                    sizes="20vw"
                    className="object-cover"
                  />
                </div>
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
              title="Care for"
              muted="every stage of life."
              intro="Antenatal and delivery care, contraception, fertility assessment, urogynaecological assessment, screening and surgery — one practice, one standard of care."
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

          {/* Captions sit beneath each photograph rather than over its lower
              third so portraits, consulting-room scenes and the hospital
              exterior remain completely unobstructed at every viewport. */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-3.5 lg:auto-rows-[15.5rem] lg:grid-cols-4">
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
                  className="group flex h-full flex-col overflow-hidden rounded-[1.25rem] bg-cream border-hairline border-charcoal/8 hover:shadow-lift"
                >
                  <div
                    className={
                      i === 0
                        ? "photo-depth relative aspect-[16/10] w-full overflow-hidden bg-peach sm:aspect-[21/9] lg:aspect-auto lg:min-h-0 lg:flex-1"
                        : "photo-depth relative aspect-[16/10] w-full overflow-hidden bg-peach lg:aspect-auto lg:min-h-0 lg:flex-1"
                    }
                  >
                    <Image
                      src={tile.image}
                      alt={tile.title}
                      fill
                      sizes="(max-width: 639px) 92vw, (max-width: 1023px) 46vw, 30vw"
                      className="object-cover transition-transform duration-[1100ms] ease-out group-hover:scale-[1.05]"
                    />
                    <span
                      aria-hidden="true"
                      className="absolute right-3 top-3 z-[2] flex h-6 w-6 items-center justify-center rounded-full bg-cream/90 text-ember shadow-soft ring-1 ring-ember/20 transition-all duration-500 group-hover:rotate-45 group-hover:bg-ember group-hover:text-cream"
                    >
                      <ArrowUpRight className="h-3 w-3" />
                    </span>
                  </div>

                  <div className="px-3.5 py-3">
                    <p className="text-[12px] font-medium text-ink">{tile.title}</p>
                    <p className="mt-0.5 text-[11px] leading-snug text-ink-soft">
                      {tile.blurb}
                    </p>
                  </div>
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

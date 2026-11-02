import { BookingLink } from "@/components/booking-link";
import Image from "@/components/ui/practice-image";
import Link from "next/link";
import {
  ArrowUpRight,
  CalendarCheck,
  HeartPulse,
  Languages as LanguageIcon,
  MapPin,
  ShieldCheck,
  Stethoscope,
} from "lucide-react";
import { Reveal, ScrollWords, WordsIn } from "@/components/ui/motion";
import { SignalBars } from "@/components/ui/plate";
import { practice } from "@/lib/practice";

/**
 * The editorial band that breaks up the home page between the service grid and
 * the patient journey.
 *
 * This is the structural idea Framer healthcare templates do better than a
 * plain stack of sections: one asymmetric bento of mixed weights — a large
 * photographic tile, a dark statement tile, a stat tile, a compact detail tile —
 * so the eye changes rhythm every two or three screen-heights instead of
 * scrolling a uniform column.
 *
 * Content rules kept intact: no invented statistics, no star ratings, no
 * testimonials. The "numbers" are things the practice can actually stand behind
 * (languages, hospital, subspecialty interests), and the one figure that is a
 * clinical record is labelled as a degree, not a claim.
 */
export function BentoBand() {
  return (
    <section className="sec sec-tint" aria-labelledby="bento-heading">
      <div className="shell">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="tag">The practice</span>
            <h2
              id="bento-heading"
              className="max-w-[24rem] text-[clamp(1.6rem,3.4vw,2.4rem)] leading-[1.05]"
            >
              <WordsIn text="Specialist care," />{" "}
              <span className="text-ink-soft">
                <WordsIn text="without the distance." delay={0.12} />
              </span>
            </h2>
          </div>
          <p className="max-w-[22rem] text-[12px] leading-relaxed text-ink-soft">
            One specialist, two hospital settings, consultations in two languages —
            and a consulting room where nothing is rushed.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2.5 sm:gap-3 lg:grid-cols-4">
          {/* 1 — photographic feature, 2 columns wide */}
          <Reveal
            y={22}
            className="col-span-2 row-span-2 lg:col-span-2"
          >
            <Link
              href="/about"
              data-cursor="Meet"
              className="group relative flex h-full min-h-[24rem] flex-col justify-end overflow-hidden rounded-[1.35rem] bg-peach p-5 sm:min-h-[23rem]"
            >
              <Image
                src="/images/portrait-somp-card.jpg"
                alt="Illustration of a healthcare professional"
                fill
                sizes="(max-width: 1024px) 92vw, 46vw"
                className="object-cover object-[center_18%] transition-transform duration-[1400ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ember/55 via-ember/10 to-transparent" />
              <div className="glass relative rounded-[1.1rem] p-3.5">
                <p className="text-[10px] uppercase tracking-[0.18em] text-ink/75">
                  Specialist Obstetrician &amp; Gynaecologist
                </p>
                <p className="mt-1.5 text-[clamp(1.15rem,2.2vw,1.5rem)] font-light leading-tight tracking-[-0.03em] text-ink">
                  Dr CM Ngwey-Sompo
                </p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {["FCOG (SA)", "MMed (O&G) Wits", "MBChB"].map((chip) => (
                    <span
                      key={chip}
                      className="rounded-full bg-cream/70 px-2.5 py-1 text-[10px] font-medium text-ink ring-1 ring-charcoal/10"
                    >
                      {chip}
                    </span>
                  ))}
                </div>
                <span className="mt-3.5 inline-flex items-center gap-1.5 text-[11px] font-medium text-ink">
                  Her story
                  <ArrowUpRight className="h-3 w-3 transition-transform duration-500 group-hover:rotate-45" />
                </span>
              </div>
            </Link>
          </Reveal>

          {/* 2 — dark statement tile */}
          <Reveal y={22} delay={0.06} className="col-span-2 lg:col-span-2">
            <div className="ember-deep-gradient relative flex h-full flex-col justify-between overflow-hidden rounded-[1.35rem] p-5 text-cream">
              <div className="flex items-start justify-between gap-3">
                <span className="rounded-full bg-cream/15 px-2.5 py-1 text-[10px] uppercase tracking-[0.14em] text-cream ring-1 ring-cream/25">
                  Special interest
                </span>
                <HeartPulse className="h-4 w-4 text-cream/70" aria-hidden="true" />
              </div>
              <ScrollWords
                tint="dark"
                text="Fertility and cervical health — the two areas she has built her practice and her research around."
                className="mt-6 max-w-[24rem] text-[clamp(0.95rem,1.8vw,1.15rem)] leading-[1.4] tracking-[-0.015em]"
              />
              <Link
                href="/research"
                className="mt-5 inline-flex items-center gap-1.5 rounded-full border border-cream/30 px-3 py-1 text-[11px] font-medium text-cream"
              >
                The research behind it
                <ArrowUpRight className="h-3 w-3" />
              </Link>
            </div>
          </Reveal>

          {/* 3 — languages + hospital, compact */}
          <Reveal y={22} delay={0.1}>
            <div className="flex h-full flex-col justify-between rounded-[1.35rem] bg-cream p-4 border-hairline border-charcoal/8">
              <LanguageIcon className="h-4 w-4 text-ink/70" aria-hidden="true" />
              <div>
                <p className="text-[1.6rem] font-light leading-none tracking-[-0.03em] text-ink">
                  02
                </p>
                <p className="mt-1 text-[11px] leading-snug text-ink-soft">
                  Languages — consultations in English and French
                </p>
              </div>
            </div>
          </Reveal>

          {/* 4 — appointment tile, the conversion beat */}
          <Reveal y={22} delay={0.14}>
            <BookingLink
              data-cursor="Book"
              className="group flex h-full flex-col justify-between rounded-[1.35rem] bg-blush p-4 border-hairline border-ember/10 hover:shadow-lift"
            >
              <CalendarCheck className="h-4 w-4 text-ink" aria-hidden="true" />
              <div>
                <p className="text-[12px] font-medium leading-snug text-ink">
                  Request an appointment
                </p>
                <p className="mt-1 text-[10px] leading-snug text-ink-soft">
                  Choose a day and time that suits you
                </p>
                <span className="mt-2 inline-flex items-center gap-1 text-[10px] font-medium text-ink">
                  Start
                  <ArrowUpRight className="h-2.5 w-2.5 transition-transform duration-500 group-hover:rotate-45" />
                </span>
              </div>
            </BookingLink>
          </Reveal>

          {/* 5 — hospital / location, wide and short */}
          <Reveal y={22} delay={0.18} className="col-span-2">
            <Link
              href="/contact"
              data-cursor="Directions"
              className="group relative flex h-full min-h-[10.5rem] items-end overflow-hidden rounded-[1.35rem] bg-peach p-4"
            >
              <Image
                src="/images/hospital-exterior.jpg"
                alt="Life Roseacres Hospital"
                fill
                sizes="(max-width: 1024px) 92vw, 46vw"
                className="object-cover transition-transform duration-[1400ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ember/55 via-ember/10 to-transparent" />
              <div className="glass relative flex w-full items-end justify-between gap-3 rounded-[1rem] p-3">
                <div>
                  <p className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.16em] text-ink/75">
                    <MapPin className="h-2.5 w-2.5" aria-hidden="true" />
                    Consulting rooms
                  </p>
                  <p className="mt-1 text-[12px] font-medium text-ink">
                    {practice.hospital}, Primrose
                  </p>
                  <p className="mt-0.5 hidden text-[10px] text-ink-soft sm:block">
                    Theatre lists at Dr Phakisa Mokhesi, Sebokeng
                  </p>
                </div>
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-charcoal text-cream transition-transform duration-500 group-hover:rotate-45">
                  <ArrowUpRight className="h-3 w-3" />
                </span>
              </div>
            </Link>
          </Reveal>

          {/* 6 — governance / POPIA, tall and narrow */}
          <Reveal y={22} delay={0.22}>
            <Link
              href="/patient-info"
              className="group flex h-full flex-col justify-between rounded-[1.35rem] bg-cream p-4 border-hairline border-charcoal/8"
            >
              <ShieldCheck className="h-4 w-4 text-ink/70" aria-hidden="true" />
              <div>
                <p className="text-[11px] font-medium leading-snug text-ink">
                  POPIA-conscious
                </p>
                <p className="mt-1 text-[10px] leading-snug text-ink-soft">
                  Details used to respond to your enquiry
                </p>
              </div>
            </Link>
          </Reveal>

          {/* 7 — research signal, compact */}
          <Reveal y={22} delay={0.26}>
            <Link
              href="/research"
              className="ember-gradient group flex h-full flex-col justify-between rounded-[1.35rem] p-4 text-ink"
            >
              <div className="flex items-start justify-between">
                <Stethoscope className="h-4 w-4 text-ink/80" aria-hidden="true" />
                <span className="text-[10px] uppercase tracking-[0.12em] text-ink">Wits</span>
              </div>
              <div>
                <p className="text-[11px] font-medium leading-snug">MMed research</p>
                <SignalBars
                  values={[18, 34, 26, 48, 62, 54, 78]}
                  className="mt-2 h-6 text-ink/70"
                />
              </div>
            </Link>
          </Reveal>
        </div>

      </div>
    </section>
  );
}

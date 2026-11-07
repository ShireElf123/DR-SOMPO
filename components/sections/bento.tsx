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
import { BotanicalBloom } from "@/components/ui/botanical";
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
              className="max-w-[24rem] text-[clamp(1.75rem,3.6vw,2.6rem)] leading-[1.02]"
            >
              <WordsIn text="Specialist care," />{" "}
              <span className="italic text-ember">
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
          {/* 1 — specialist chambers & clinical craft feature, 2 columns wide */}
          <Reveal
            y={22}
            className="col-span-2 row-span-2 lg:col-span-2"
          >
            <Link
              href="/about"
              data-cursor="Practice"
              className="group flex h-full min-h-[24rem] flex-col overflow-hidden rounded-[1.5rem] bg-cream p-2 pb-0 border-hairline border-ember/15 sm:min-h-[23rem]"
            >
              <div className="photo-depth relative min-h-[15.5rem] flex-1 overflow-hidden rounded-tl-[5.5rem] rounded-tr-[1.15rem] rounded-b-[1.1rem] bg-peach">
                <Image
                  src="/images/specialist-desk.jpg"
                  alt="Physician's stethoscope, reading glasses and clinical notebook on an oak desk"
                  fill
                  sizes="(max-width: 1024px) 92vw, 46vw"
                  className="object-cover object-[50%_74%] transition-transform duration-[1400ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
                />
                <span
                  aria-hidden="true"
                  className="absolute right-3.5 top-3.5 z-[2] flex h-7 w-7 items-center justify-center rounded-full bg-cream/90 text-ember shadow-soft ring-1 ring-ember/20 transition-all duration-500 group-hover:rotate-45 group-hover:bg-ember group-hover:text-cream"
                >
                  <ArrowUpRight className="h-3 w-3" />
                </span>
                <span className="glass absolute bottom-3 left-3 z-[2] rounded-full px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.13em] text-ember-deep">
                  Specialist Chambers · Room 5
                </span>
              </div>
              <div className="p-3.5 sm:p-4">
                <p className="text-[10px] uppercase tracking-[0.18em] text-ink-muted">
                  Specialist Obstetrician &amp; Gynaecologist
                </p>
                <p className="mt-1 font-display text-[clamp(1.3rem,2.4vw,1.65rem)] leading-tight tracking-[-0.02em] text-ink">
                  Dr CM Ngwey-Sompo
                </p>
                <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap gap-1.5">
                    {["FCOG (SA)", "MMed (O&G) Wits", "MBChB"].map((chip) => (
                      <span
                        key={chip}
                        className="rounded-full bg-blush px-2.5 py-1 text-[10px] font-medium text-ink"
                      >
                        {chip}
                      </span>
                    ))}
                  </div>
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-ember-deep">
                    Her story
                    <ArrowUpRight className="h-3 w-3 transition-transform duration-500 group-hover:rotate-45" />
                  </span>
                </div>
              </div>
            </Link>
          </Reveal>

          {/* 2 — luminous rosewater silk statement tile */}
          <Reveal y={22} delay={0.06} className="col-span-2 lg:col-span-2">
            <div className="ember-gradient relative flex h-full flex-col justify-between overflow-hidden rounded-[1.5rem] p-5 text-ink border-hairline border-ember/15">
              <BotanicalBloom className="absolute -bottom-6 -right-4 h-40 w-40" />
              <div className="relative z-10 flex items-start justify-between gap-3">
                <span className="rounded-full bg-cream/85 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.14em] text-ember ring-1 ring-ember/20">
                  Special interests
                </span>
                <HeartPulse className="h-4 w-4 text-ember/75" aria-hidden="true" />
              </div>
              <ScrollWords
                tint="light"
                text="Fertility, cervical health and urogynaecological assessment — areas she has built her practice, referral pathways and research around."
                className="relative z-10 mt-6 max-w-[26rem] text-[clamp(0.95rem,1.8vw,1.15rem)] leading-[1.42] tracking-[-0.015em]"
              />
              <Link
                href="/research"
                className="relative z-10 mt-5 inline-flex self-start items-center gap-1.5 rounded-full border border-ember/25 bg-cream/85 px-3.5 py-1 text-[11px] font-medium text-ink transition-colors hover:bg-ember hover:text-cream"
              >
                Explore the research
                <ArrowUpRight className="h-3 w-3" />
              </Link>
            </div>
          </Reveal>

          {/* 3 — languages + hospital, compact */}
          <Reveal y={22} delay={0.1}>
            <div className="flex h-full flex-col justify-between rounded-[1.5rem] bg-cream p-4 border-hairline border-ember/10">
              <LanguageIcon className="h-4 w-4 text-ember/75" aria-hidden="true" />
              <div>
                <p className="font-display text-[2rem] italic leading-none tracking-[-0.02em] text-ember">
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
              className="group flex h-full flex-col justify-between rounded-[1.5rem] bg-petal/65 p-4 border-hairline border-ember/15 hover:shadow-lift"
            >
              <CalendarCheck className="h-4 w-4 text-ember" aria-hidden="true" />
              <div>
                <p className="text-[12px] font-medium leading-snug text-ink">
                  Request an appointment
                </p>
                <p className="mt-1 text-[10px] leading-snug text-ink-soft">
                  Choose a day and time that suits you
                </p>
                <span className="mt-2 inline-flex items-center gap-1 text-[10px] font-semibold text-ember-deep">
                  Start
                  <ArrowUpRight className="h-2.5 w-2.5 transition-transform duration-500 group-hover:rotate-45" />
                </span>
              </div>
            </BookingLink>
          </Reveal>

          {/* 5 — hospital / location, wide and split so 100% of the exterior photo is visible */}
          <Reveal y={22} delay={0.18} className="col-span-2">
            <Link
              href="/contact"
              data-cursor="Directions"
              className="group grid h-full overflow-hidden rounded-[1.5rem] bg-cream border-hairline border-ember/10 sm:grid-cols-[1.05fr_0.95fr]"
            >
              <div className="photo-depth relative aspect-[16/9] overflow-hidden bg-peach sm:aspect-auto sm:min-h-[10.5rem]">
                <Image
                  src="/images/hospital-exterior.jpg"
                  alt="Life Roseacres Hospital"
                  fill
                  sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 24vw"
                  className="object-cover transition-transform duration-[1400ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
                />
              </div>
              <div className="flex flex-col justify-between gap-3 p-4">
                <div className="flex items-start justify-between gap-2">
                  <p className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.16em] text-ink-muted">
                    <MapPin className="h-2.5 w-2.5 text-ember" aria-hidden="true" />
                    Consulting rooms
                  </p>
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blush text-ember ring-1 ring-ember/15 transition-all duration-500 group-hover:rotate-45 group-hover:bg-ember group-hover:text-cream">
                    <ArrowUpRight className="h-3 w-3" />
                  </span>
                </div>
                <div>
                  <p className="text-[12px] font-medium text-ink">
                    {practice.hospital}, Primrose
                  </p>
                  <p className="mt-0.5 text-[11px] leading-snug text-ink-soft">
                    {practice.room}
                  </p>
                  <p className="mt-1 text-[10px] leading-snug text-ink-muted">
                    Theatre lists at Dr Phakisa Mokhesi Hospital, Sebokeng
                  </p>
                </div>
              </div>
            </Link>
          </Reveal>

          {/* 6 — governance / POPIA, tall and narrow */}
          <Reveal y={22} delay={0.22}>
            <Link
              href="/patient-info"
              className="group flex h-full flex-col justify-between rounded-[1.5rem] bg-cream p-4 border-hairline border-ember/10"
            >
              <ShieldCheck className="h-4 w-4 text-ember/75" aria-hidden="true" />
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
              className="ember-gradient group flex h-full flex-col justify-between rounded-[1.5rem] p-4 text-ink border-hairline border-ember/15"
            >
              <div className="flex items-start justify-between">
                <Stethoscope className="h-4 w-4 text-ember" aria-hidden="true" />
                <span className="text-[10px] font-medium uppercase tracking-[0.12em] text-ember-deep">Wits</span>
              </div>
              <div>
                <p className="text-[11px] font-medium leading-snug">MMed research</p>
                <SignalBars
                  values={[18, 34, 26, 48, 62, 54, 78]}
                  className="mt-2 h-6 text-ember/75"
                />
              </div>
            </Link>
          </Reveal>
        </div>

      </div>
    </section>
  );
}

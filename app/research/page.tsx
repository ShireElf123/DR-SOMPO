import { BookingLink } from "@/components/booking-link";
import { pageMetadata } from "@/lib/metadata";
import type { Metadata } from "next";
import Image from "@/components/ui/practice-image";
import Link from "next/link";
import { AlertCircle, ArrowUpRight, BookOpen, FileText } from "lucide-react";
import { PageHero, SectionHead } from "@/components/page-hero";
import { IconDisc, Panel, Plate, SignalBars } from "@/components/ui/plate";
import { ParallaxImage, Reveal, RevealGroup, RevealItem } from "@/components/ui/motion";
import { research } from "@/lib/practice";

export const metadata: Metadata = pageMetadata(
  "Research & Cervical Health — LLETZ Margin Status Study",
  "Dr CM Ngwey-Sompo's Master of Medicine research on margin status after LLETZ in women living with HIV, presented at SASOG 2025, FIGO 2025 and the Presentis Women's Health Conference in Dubai.",
  "/research",
);

export default function ResearchPage() {
  return (
    <>
      <PageHero
        tag="Research & education"
        title="Advancing women's health"
        muted="through research and education."
        intro="Cervical health, HPV prevention and patient education — approached through clinical research and plain-language care."
        image="/images/cervical-research.jpg"
        mobileImage="/images/research-desk.jpg"
        alt="Laboratory microscope and research folders"
      />

      {/* The study */}
      <section className="bg-cream py-12 sm:py-16">
        <div className="shell">
          <div className="grid gap-9 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
            <div>
              <Reveal>
                <figure className="rounded-[1.35rem] border-hairline border-charcoal/10 bg-cream p-6 shadow-soft sm:p-7">
                  <div className="flex items-center gap-2 text-ink-soft">
                    <BookOpen className="h-4 w-4" aria-hidden="true" />
                    <span className="text-[10px] font-semibold uppercase tracking-[0.16em]">
                      Master&apos;s research
                    </span>
                  </div>

                  <blockquote className="mt-3.5 text-[15px] font-medium leading-snug tracking-[-0.02em] text-ink sm:text-[16px]">
                    {research.title}
                  </blockquote>

                  <dl className="mt-5 grid gap-x-6 gap-y-3 border-t-hairline border-charcoal/8 pt-4 sm:grid-cols-2">
                    {[
                      { k: "Author", v: research.author },
                      { k: "Degree", v: research.degree },
                      { k: "Faculty", v: research.faculty },
                      { k: "Institution", v: research.institution },
                    ].map((row) => (
                      <div key={row.k}>
                        <dt className="text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-soft">
                          {row.k}
                        </dt>
                        <dd className="mt-1 text-[12px] leading-snug text-ink-soft">{row.v}</dd>
                      </div>
                    ))}
                  </dl>

                  <div className="mt-4 flex items-start gap-2.5 rounded-xl bg-blush/80 p-3.5">
                    <FileText className="mt-0.5 h-3.5 w-3.5 shrink-0 text-ink/60" aria-hidden="true" />
                    <p className="text-[11px] leading-relaxed text-ink-soft">{research.focus}</p>
                  </div>
                </figure>
              </Reveal>

              <Reveal delay={0.1}>
                <div className="mt-4 rounded-[1.35rem] bg-blush p-2.5">
                <div className="rounded-[1.1rem] bg-cream p-4 sm:p-5">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-soft">
                    Presentation &amp; publication history
                  </p>
                  <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                    {research.presentations.map((item) => (
                      <li
                        key={item.label}
                        className="flex items-start justify-between gap-2 rounded-xl border-hairline border-charcoal/8 bg-cream px-3 py-2"
                      >
                        <div>
                          <p className="text-[11px] font-medium leading-snug text-ink">
                            {item.label}
                          </p>
                          <p className="mt-0.5 text-[10px] leading-snug text-ink-soft">
                            {item.detail}
                          </p>
                        </div>
                        <span
                          aria-hidden="true"
                          className={
                            item.state === "pending"
                              ? "mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-ember ring-2 ring-ember/25"
                              : "mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-ember/45"
                          }
                        />
                      </li>
                    ))}
                  </ul>
                  <p className="mt-3 flex items-start gap-2 text-[12px] leading-relaxed text-ink-soft">
                    <AlertCircle className="mt-0.5 h-3 w-3 shrink-0" aria-hidden="true" />
                    {research.disclaimer}
                  </p>
                </div>
              </div>
              </Reveal>
            </div>

            <div className="space-y-3.5">
              <Reveal y={26} delay={0.08}>
                <div className="photo-depth relative aspect-[4/3] lg:aspect-[4/5] overflow-hidden rounded-[1.35rem] bg-peach">
                  <ParallaxImage
                    src="/images/patient-quiet.jpg"
                    alt="A patient in the clinic waiting area"
                    strength={46}
                    sizes="(max-width: 1024px) 92vw, 42vw"
                    className="absolute inset-0"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ember/12 via-transparent to-transparent" />
                  <p className="glass absolute inset-x-4 bottom-4 z-[2] rounded-lg px-3 py-2 text-[11px] leading-relaxed text-ink">
                    Research is only useful if it reaches the consultation room.
                  </p>
                </div>
              </Reveal>

              <Reveal delay={0.14}>
                <Panel tone="ember" className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <span className="text-[10px] uppercase tracking-[0.16em] text-ink/80">
                      Presented at
                    </span>
                    <IconDisc tone="warm">
                      <span className="h-1.5 w-1.5 rounded-full bg-ember" />
                    </IconDisc>
                  </div>
                  <ul className="mt-3 space-y-2">
                    {research.presentations.map((item) => (
                      <li
                        key={item.label}
                        className="flex items-center justify-between gap-3 border-t-hairline border-charcoal/15 pt-2 first:border-0 first:pt-0"
                      >
                        <span className="text-[12px] font-medium text-ink">{item.label}</span>
                        <span className="text-[10px] uppercase tracking-[0.12em] text-ink/80">
                          {item.state === "pending" ? "Pending" : "Confirmed"}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <SignalBars
                    values={[18, 32, 26, 48, 60, 52, 74, 66, 82]}
                    className="mt-4 h-10 text-ink/80"
                  />
                </Panel>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* Why it matters */}
      <section className="sec sec-tint">
        <div className="shell">
          <SectionHead
            tag="Cervical health"
            title="Why this research"
            muted="matters to patients."
            intro="Accessible explanations — no statistics, no clinical interpretations, no treatment promises."
          />

          <div className="mt-8 grid gap-3.5 sm:grid-cols-3">
            {research.context.map((item, i) => (
              <Reveal key={item.title} delay={i * 0.07}>
                <div className="group flex h-full flex-col overflow-hidden rounded-[1.35rem] bg-cream border-hairline border-charcoal/8 hover:shadow-lift">
                  <div className="photo-depth relative aspect-[16/9] overflow-hidden bg-peach">
                    <Image
                      src={
                        [
                          "/images/cervical-research.jpg",
                          "/images/research-desk.jpg",
                          "/images/screening-room.jpg",
                        ][i % 3]
                      }
                      alt=""
                      fill
                      sizes="(max-width: 640px) 92vw, 30vw"
                      className="object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.045]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ember/12 to-transparent" />
                    <span className="glass absolute left-3 top-3 z-[2] grid h-7 w-7 place-items-center rounded-full text-[10px] font-medium text-ink">
                      0{i + 1}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-4">
                    <h3 className="text-[13px] font-medium tracking-[-0.01em] text-ink">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-[12px] leading-relaxed text-ink-soft">{item.body}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Cervical screening in practice */}
      <section className="sec">
        <div className="shell">
          <SectionHead
            tag="In practice"
            title="Screening, HPV prevention"
            muted="and follow-up."
            intro="Cervical health is one of Dr Sompo's special interests, alongside fertility."
          />

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <Reveal y={20}>
              <Plate
                image="/images/cervical-research.jpg"
                alt="Microscope in a research setting"
                index="01"
                label="Screening"
                meta="Cervical"
                ratio="aspect-[4/3]"
                body="Screening detects cellular changes early, when they are most straightforward to assess and manage."
              />
            </Reveal>
            <Reveal y={20} delay={0.07}>
              <Plate
                image="/images/gynae.jpg"
                alt="Consulting room still life"
                index="02"
                label="HPV prevention"
                meta="Prevention"
                ratio="aspect-[4/3]"
                body="Most cervical changes are linked to persistent high-risk HPV. Vaccination and screening together are the backbone of prevention."
              />
            </Reveal>
            <Reveal y={20} delay={0.14}>
              <Plate
                image="/images/consultation.jpg"
                alt="Consultation in progress"
                index="03"
                label="Follow-up"
                meta="Follow-up"
                ratio="aspect-[4/3]"
                body="Results are discussed clearly, with a follow-up interval and next steps explained before you leave."
              />
            </Reveal>
          </div>

          <RevealGroup className="mt-8 flex flex-wrap items-center gap-2.5" stagger={0.08}>
            <RevealItem>
              <BookingLink className="btn">
                Book a consultation
                <i aria-hidden="true">
                  <ArrowUpRight className="h-3 w-3" />
                </i>
              </BookingLink>
            </RevealItem>
            <RevealItem>
              <Link href="/services" className="btn btn-light border border-charcoal/12 shadow-none">
                Gynaecology services
                <i aria-hidden="true">
                  <ArrowUpRight className="h-3 w-3" />
                </i>
              </Link>
            </RevealItem>
          </RevealGroup>
        </div>
      </section>
    </>
  );
}

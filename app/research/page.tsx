import type { Metadata } from "next";
import Link from "next/link";
import { AlertCircle, ArrowUpRight, BookOpen, FileText } from "lucide-react";
import { PageHero, SectionHead } from "@/components/page-hero";
import { IconDisc, Panel, Plate, SignalBars } from "@/components/ui/plate";
import { ParallaxImage, Reveal, RevealGroup, RevealItem } from "@/components/ui/motion";
import { research } from "@/lib/practice";

export const metadata: Metadata = {
  title: "Research & Cervical Health — LLETZ Margin Status Study",
  description:
    "Dr CM Ngwey-Sompo's Master of Medicine research on margin status after LLETZ in women living with HIV, presented at SASOG 2025, FIGO 2025 and the Presentis Women's Health Conference in Dubai.",
  alternates: { canonical: "/research" },
};

export default function ResearchPage() {
  return (
    <>
      <PageHero
        tag="Research & education"
        title="Advancing women's health"
        muted="through research and education."
        intro="Cervical health, HPV prevention and patient education — approached through clinical research and plain-language care."
        image="/images/cervical-research.jpg"
        alt="Laboratory microscope and research folders"
      />

      {/* The study */}
      <section className="bg-white py-12 sm:py-16">
        <div className="shell">
          <div className="grid gap-9 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
            <div>
              <Reveal>
                <figure className="rounded-[1.35rem] border border-charcoal/10 bg-white p-6 shadow-[0_28px_60px_-52px_rgba(23,77,60,0.5)] sm:p-7">
                  <div className="flex items-center gap-2 text-ink-soft">
                    <BookOpen className="h-4 w-4" aria-hidden="true" />
                    <span className="text-[10px] font-semibold uppercase tracking-[0.16em]">
                      Master&apos;s research
                    </span>
                  </div>

                  <blockquote className="mt-3.5 text-[15px] font-medium leading-snug tracking-[-0.02em] text-forest sm:text-[17px]">
                    {research.title}
                  </blockquote>

                  <dl className="mt-5 grid gap-x-6 gap-y-3 border-t border-charcoal/8 pt-4 sm:grid-cols-2">
                    {[
                      { k: "Author", v: research.author },
                      { k: "Degree", v: research.degree },
                      { k: "Faculty", v: research.faculty },
                      { k: "Institution", v: research.institution },
                    ].map((row) => (
                      <div key={row.k}>
                        <dt className="text-[9.5px] font-semibold uppercase tracking-[0.16em] text-ink-soft">
                          {row.k}
                        </dt>
                        <dd className="mt-1 text-[12px] leading-snug text-ink-soft">{row.v}</dd>
                      </div>
                    ))}
                  </dl>

                  <div className="mt-4 flex items-start gap-2.5 rounded-xl bg-mint/80 p-3.5">
                    <FileText className="mt-0.5 h-3.5 w-3.5 shrink-0 text-forest/60" aria-hidden="true" />
                    <p className="text-[11.5px] leading-relaxed text-ink-soft">{research.focus}</p>
                  </div>
                </figure>
              </Reveal>

              <Reveal delay={0.1}>
                <div className="mt-4 rounded-[1.35rem] bg-mint p-2.5">
                <div className="rounded-[1.1rem] bg-white p-4 sm:p-5">
                  <p className="text-[9.5px] font-semibold uppercase tracking-[0.16em] text-ink-soft">
                    Presentation &amp; publication history
                  </p>
                  <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                    {research.presentations.map((item) => (
                      <li
                        key={item.label}
                        className="flex items-start justify-between gap-2 rounded-xl border border-charcoal/8 bg-white px-3 py-2"
                      >
                        <div>
                          <p className="text-[11.5px] font-medium leading-snug text-charcoal">
                            {item.label}
                          </p>
                          <p className="mt-0.5 text-[10.5px] leading-snug text-ink-soft">
                            {item.detail}
                          </p>
                        </div>
                        <span
                          aria-hidden="true"
                          className={
                            item.state === "pending"
                              ? "mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-gold ring-2 ring-gold/25"
                              : "mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-forest/45"
                          }
                        />
                      </li>
                    ))}
                  </ul>
                  <p className="mt-3 flex items-start gap-2 text-[10.5px] leading-relaxed text-ink-soft">
                    <AlertCircle className="mt-0.5 h-3 w-3 shrink-0" aria-hidden="true" />
                    {research.disclaimer}
                  </p>
                </div>
              </div>
              </Reveal>
            </div>

            <div className="space-y-3.5">
              <Reveal y={26} delay={0.08}>
                <div className="relative aspect-[4/5] overflow-hidden rounded-[1.35rem] bg-sage">
                  <ParallaxImage
                    src="/images/patient-quiet.jpg"
                    alt="A patient in the clinic waiting area"
                    strength={46}
                    sizes="(max-width: 1024px) 92vw, 42vw"
                    className="absolute inset-0"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-forest-ink/45 via-transparent to-transparent" />
                  <p className="absolute inset-x-4 bottom-4 text-[11px] leading-relaxed text-white/90">
                    Research is only useful if it reaches the consultation room.
                  </p>
                </div>
              </Reveal>

              <Reveal delay={0.14}>
                <Panel tone="forest" className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <span className="text-[9.5px] uppercase tracking-[0.16em] text-white/70">
                      Presented at
                    </span>
                    <IconDisc tone="forest">
                      <span className="h-1.5 w-1.5 rounded-full bg-lime" />
                    </IconDisc>
                  </div>
                  <ul className="mt-3 space-y-2">
                    {research.presentations.map((item) => (
                      <li
                        key={item.label}
                        className="flex items-center justify-between gap-3 border-t border-white/12 pt-2 first:border-0 first:pt-0"
                      >
                        <span className="text-[12px] font-medium text-white">{item.label}</span>
                        <span className="text-[9.5px] uppercase tracking-[0.12em] text-white/70">
                          {item.state === "pending" ? "Pending" : "Confirmed"}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <SignalBars
                    values={[18, 32, 26, 48, 60, 52, 74, 66, 82]}
                    className="mt-4 h-10 text-lime/80"
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
                <div className="group relative h-full overflow-hidden rounded-[1.25rem] bg-white p-5 ring-1 ring-charcoal/8 transition-shadow duration-500 hover:shadow-[0_28px_60px_-44px_rgba(23,77,60,0.45)]">
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-5 top-0 h-[2px] origin-left scale-x-0 bg-gradient-to-r from-forest to-gold transition-transform duration-700 group-hover:scale-x-100"
                  />
                  <div className="flex items-center gap-2.5">
                    <IconDisc>
                      <span className="text-[10px] font-medium text-forest">0{i + 1}</span>
                    </IconDisc>
                    <h3 className="text-[13.5px] font-medium tracking-[-0.01em] text-forest">
                      {item.title}
                    </h3>
                  </div>
                  <p className="mt-2.5 text-[12px] leading-relaxed text-ink-soft">{item.body}</p>
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
            intro="Cervical health is one of Dr Somp's special interests, alongside fertility."
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
              <Link href="/contact" className="btn">
                Book a consultation
                <i aria-hidden="true">
                  <ArrowUpRight className="h-3 w-3" />
                </i>
              </Link>
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

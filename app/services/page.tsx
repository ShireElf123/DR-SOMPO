import { BookingLink } from "@/components/booking-link";
import { pageMetadata } from "@/lib/metadata";
import type { Metadata } from "next";
import Image from "@/components/ui/practice-image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PageHero, SectionHead } from "@/components/page-hero";
import { IconDisc, Panel, SignalBars } from "@/components/ui/plate";
import { ParallaxImage, Reveal, RevealGroup, RevealItem, WordsIn } from "@/components/ui/motion";
import { serviceGroups } from "@/lib/practice";
import { ConditionsTreated } from "@/components/sections/conditions";

export const metadata: Metadata = pageMetadata(
  "Services — Obstetrics, Gynaecology, Fertility & Surgery",
  "Antenatal care, delivery, gynaecological consultations, fertility assessment and minimally invasive surgery with Dr CM Ngwey-Sompo at Life Roseacres Hospital, Primrose, Germiston.",
  "/services",
);

const groupImages: Record<string, { image: string; alt: string }> = {
  obstetrics: {
    image: "/images/antenatal.jpg",
    alt: "Expectant mother resting in a sunlit consultation room",
  },
  gynaecology: {
    image: "/images/gynae.jpg",
    alt: "Calm still life of folded linens and eucalyptus in a consulting room",
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

export default function ServicesPage() {
  return (
    <>
      <PageHero
        tag="Services"
        title="Obstetrics, gynaecology,"
        muted="fertility and surgery."
        intro="One practice, one standard of care — from a first consultation through pregnancy, surgery and long-term follow-up."
        image="/images/consultation.jpg"
        mobileImage="/images/screening-room.jpg"
        alt="Dr Sompo in consultation with a patient"
      />

      <ConditionsTreated />

      {/* Quick index — glass chips that invert on hover */}
      <section className="bg-cream pt-9">
        <div className="shell">
          <div className="flex flex-wrap items-center gap-2">
            <span className="mr-1 text-[10px] uppercase tracking-[0.16em] text-ink-muted">
              Jump to
            </span>
            {serviceGroups.map((group) => (
              <a
                key={group.id}
                href={`#${group.id}`}
                className="group inline-flex items-center gap-1.5 rounded-full border border-charcoal/12 bg-cream px-3.5 py-1.5 text-[11px] font-medium text-ink-soft transition-all duration-500 hover:-translate-y-0.5 hover:border-ember hover:bg-ember hover:text-cream"
              >
                {group.label}
                <ArrowUpRight className="h-3 w-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Statement panel */}
      <section className="bg-cream pt-10">
        <div className="shell">
          <Panel tone="ember" className="p-2.5 sm:p-3">
            <div className="grid gap-2.5 lg:grid-cols-[1.02fr_0.98fr] lg:items-stretch">
              <div className="photo-depth relative min-h-[15rem] overflow-hidden rounded-[1.35rem] lg:min-h-[24rem]">
                <ParallaxImage
                  src="/images/screening-room.jpg"
                  alt="A consulting and examination room in soft daylight"
                  strength={34}
                  sizes="(max-width: 1024px) 92vw, 46vw"
                  className="absolute inset-0"
                />
                <div className="absolute inset-x-4 bottom-4 z-[2] flex flex-wrap gap-1.5">
                  {serviceGroups.map((group) => (
                    <span
                      key={group.id}
                      className="glass rounded-full px-2.5 py-1 text-[10px] font-medium text-ink"
                    >
                      {group.label}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-5 sm:p-8 lg:p-10">
                <span className="tag tag-light">One practice</span>
                <h2 className="max-w-[26rem] text-[clamp(1.5rem,3.2vw,2.3rem)] leading-[1.06]">
                  <WordsIn text="Four disciplines, one continuous record of care." />
                </h2>
                <p className="mt-4 max-w-md text-[13px] leading-relaxed text-ink">
                  Obstetrics and gynaecology share a patient, not a department.
                  Consultations, surgery and follow-up stay with the same
                  specialist, which is why the plan you leave with is the plan
                  that gets carried out.
                </p>
                <div className="mt-5 grid grid-cols-2 gap-2">
                  {serviceGroups.map((group, i) => (
                    <div
                      key={group.id}
                      className="glass rounded-xl p-3"
                    >
                      <p className="text-[11px] font-medium leading-snug text-ink">
                        {group.label}
                      </p>
                      <SignalBars
                        values={[26 + i * 8, 44, 34 + i * 6, 58, 48, 72]}
                        className="mt-2 h-6 text-ink"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Panel>
        </div>
      </section>

      {/* Detail blocks */}
      <section className="bg-cream py-8 sm:py-10">
        <div className="shell space-y-4">
          {serviceGroups.map((group, index) => {
            const meta = groupImages[group.id];
            const reversed = index % 2 === 1;

            return (
              <article
                key={group.id}
                id={group.id}
                className="scroll-mt-24 overflow-hidden rounded-[1.75rem] bg-blush p-2.5 sm:p-3"
              >
                <div className="grid gap-2.5 lg:grid-cols-[1.02fr_0.98fr] lg:items-stretch">
                  <div
                    className={`relative min-h-[16rem] overflow-hidden rounded-[1.35rem] bg-peach lg:min-h-[26rem] ${
                      reversed ? "lg:order-2" : ""
                    }`}
                  >
                    <ParallaxImage
                      src={meta.image}
                      alt={meta.alt}
                      strength={34}
                      sizes="(max-width: 1024px) 92vw, 46vw"
                      className="absolute inset-0"
                    />
                    <span className="glass absolute left-3 top-3 z-[2] rounded-full px-2.5 py-1 text-[10px] font-medium tracking-[0.08em] text-ink">
                      0{index + 1}
                    </span>
                    <span className="glass absolute bottom-3 left-3 z-[2] rounded-full px-3.5 py-1 text-[10px] font-medium text-ink">
                      {group.label}
                    </span>
                  </div>

                  <div className="rounded-[1.35rem] bg-cream p-6 sm:p-8 lg:p-9">
                    <h2 className="text-[clamp(1.4rem,2.6vw,1.95rem)] leading-[1.08]">
                      <WordsIn text={group.headline} stagger={0.03} />
                    </h2>
                    <p className="mt-3 max-w-md text-[13px] leading-relaxed text-ink-soft">
                      {group.intro}
                    </p>

                    <RevealGroup className="mt-6 space-y-4" stagger={0.07}>
                      {group.services.map((service) => (
                        <RevealItem key={service.id}>
                          <div className="group border-t-hairline border-charcoal/10 pt-3.5">
                            <Link
                              href={`/services/${service.id}`}
                              data-cursor="Open"
                              className="inline-flex items-center gap-1.5 text-[13px] font-medium tracking-[-0.01em] text-ink"
                            >
                              {service.title}
                              <ArrowUpRight className="h-3 w-3 opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:opacity-100" />
                            </Link>
                            <p className="mt-1 max-w-md text-[12px] leading-relaxed text-ink-soft">
                              {service.summary}
                            </p>
                            <ul className="mt-2 flex flex-wrap gap-1.5">
                              {service.items.map((item) => (
                                <li
                                  key={item}
                                  className="rounded-full bg-cream px-2.5 py-1 text-[11px] text-ink-soft"
                                >
                                  {item}
                                </li>
                              ))}
                            </ul>
                            <Link
                              href={`/services/${service.id}`}
                              className="mt-2.5 inline-flex items-center gap-1 text-[10px] font-medium text-ink/80 hover:text-ink"
                            >
                              Full details
                              <ArrowUpRight className="h-2.5 w-2.5" />
                            </Link>
                          </div>
                        </RevealItem>
                      ))}
                    </RevealGroup>

                    <BookingLink
                      service={group.services[0].id}
                      className="btn mt-6"
                    >
                      Request an appointment
                      <i aria-hidden="true">
                        <ArrowUpRight className="h-3 w-3" />
                      </i>
                    </BookingLink>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* What to expect */}
      <section className="sec sec-tint">
        <div className="shell">
          <SectionHead
            tag="What to expect"
            title="Prepared, explained,"
            muted="and on your terms."
            intro="Every consultation and procedure follows the same rhythm — you should always know what is happening and why."
          />

          <div className="mt-8 grid gap-3.5 sm:grid-cols-3">
            {[
              {
                label: "Before",
                image: "/images/patient-quiet.jpg",
                alt: "A patient sitting calmly in the clinic waiting area",
                body: "Bring your ID, medical aid card, a medication list and any prior results or referral letters.",
              },
              {
                label: "During",
                image: "/images/consultation.jpg",
                alt: "A consultation in progress",
                body: "History, examination where needed, and a clear discussion of options — in English or French.",
              },
              {
                label: "After",
                image: "/images/gynae.jpg",
                alt: "Consulting room detail",
                body: "A written plan, follow-up timing, and direct contact details if something changes.",
              },
            ].map((step, i) => (
              <Reveal key={step.label} delay={i * 0.08} y={20}>
                <div className="group flex h-full flex-col overflow-hidden rounded-[1.35rem] bg-cream border-hairline border-charcoal/8 hover:shadow-lift">
                  <div className="photo-depth relative aspect-[4/3] overflow-hidden bg-peach sm:aspect-[16/9]">
                    <Image
                      src={step.image}
                      alt={step.alt}
                      fill
                      sizes="(max-width: 640px) 92vw, 30vw"
                      className="object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
                    />
                    <span className="glass absolute left-3 top-3 z-[2] grid h-7 w-7 place-items-center rounded-full text-[10px] font-medium text-ink">
                      0{i + 1}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-4">
                    <div className="flex items-center gap-2">
                      <IconDisc tone="light">
                        <span className="h-1.5 w-1.5 rounded-full bg-ember" />
                      </IconDisc>
                      <p className="text-[13px] font-medium tracking-[-0.01em] text-ink">
                        {step.label}
                      </p>
                    </div>
                    <p className="mt-2.5 text-[12px] leading-relaxed text-ink-soft">
                      {step.body}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.1}>
            <p className="mt-6 max-w-2xl text-[11px] leading-relaxed text-ink-soft">
              All listed services and procedures are subject to confirmation
              against Dr Sompo&apos;s current practice and hospital privileges.
              Nothing on this page is a guarantee of a clinical outcome, and
              fertility or surgical results are never promised.
            </p>
          </Reveal>
        </div>
      </section>
    </>
  );
}

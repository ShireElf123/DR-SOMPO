import { pageMetadata } from "@/lib/metadata";
import type { Metadata } from "next";
import Image from "@/components/ui/practice-image";
import Link from "next/link";
import { ArrowUpRight, Check } from "lucide-react";
import { SectionHead, SplitHero } from "@/components/page-hero";
import { IconDisc, Panel } from "@/components/ui/plate";
import {
  ParallaxImage,
  Reveal,
  RevealGroup,
  RevealItem,
  ScrollWords,
} from "@/components/ui/motion";
import {
  affiliations,
  brand,
  biography,
  biographyAside,
  credentials,
  practice,
} from "@/lib/practice";

export const metadata: Metadata = pageMetadata(
  "Meet Dr CM Ngwey-Sompo — Specialist Obstetrician & Gynaecologist",
  "Dr CM Ngwey-Sompo is a specialist Obstetrician and Gynaecologist practising at Life Roseacres Hospital, Primrose, Germiston. MBChB, FCOG (SA), MMed (O&G) Wits. Consultations in English and French.",
  "/about",
);

const values = [
  {
    title: "Time to be heard",
    body: "Consultations are unhurried. Your history and context come before any decision about care.",
    image: "/images/consultation.jpg",
    alt: "A consultation in a bright consulting room",
  },
  {
    title: "Explained in plain language",
    body: "Options, investigations and procedures are described clearly — including what is not yet known.",
    image: "/images/waiting-room.jpg",
    alt: "The practice waiting area, with natural light and quiet seating",
  },
  {
    title: "Continuity of care",
    body: "From first consultation through pregnancy, surgery or follow-up, you are cared for by the same specialist.",
    image: "/images/corridor.jpg",
    alt: "A quiet corridor leading to the consulting rooms",
  },
];

export default function AboutPage() {
  return (
    <>
      <SplitHero
        tag="Meet Dr Sompo"
        title="Specialist care, with"
        muted="personal understanding."
        intro={`${practice.title} · ${practice.entity}`}
        image="/images/portrait-somp-card.jpg"
        alt="Portrait of Dr CM Ngwey-Sompo, specialist obstetrician and gynaecologist"
        chips={["MBChB", "FCOG (SA)", "MMed (O&G) Wits", "English & French"]}
        footer={
          <div className="flex flex-wrap items-center gap-2.5">
            <Link href="/contact" className="btn">
              Request a consultation
              <i aria-hidden="true">
                <ArrowUpRight className="h-3 w-3" />
              </i>
            </Link>
            <Link href="/research" className="btn btn-light shadow-none ring-1 ring-charcoal/12">
              Her research
              <i aria-hidden="true">
                <ArrowUpRight className="h-3 w-3" />
              </i>
            </Link>
          </div>
        }
      />

      {/* Scroll-lit statement */}
      <section className="bg-white pb-4 pt-12 sm:pt-16">
        <div className="shell">
          <ScrollWords
            text="Having experienced difficult pregnancies herself, she brings a personal understanding to the women she cares for — alongside specialist training, research and a commitment to patient education."
            avatars={[2]}
            className="mx-auto max-w-[44rem] text-center text-[clamp(1.15rem,2.4vw,1.55rem)] leading-[1.4] tracking-[-0.02em]"
          />
        </div>
      </section>

      {/* Biography */}
      <section className="bg-white py-10 sm:py-14">
        <div className="shell">
          <div className="grid gap-9 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12">
            <div>
              <Reveal y={18}>
                <blockquote className="mb-6 max-w-2xl border-l-2 border-forest/30 pl-4">
                  <p className="text-[clamp(1.05rem,2.1vw,1.35rem)] font-light leading-[1.45] tracking-[-0.02em] text-forest">
                    {brand.advocacy}
                  </p>
                  <footer className="mt-2 text-[10.5px] uppercase tracking-[0.14em] text-ink-muted">
                    Her practice, in her words
                  </footer>
                </blockquote>
              </Reveal>

              <div className="space-y-4">
                {biography.map((paragraph, i) => (
                  <Reveal key={i} delay={i * 0.04}>
                    <p
                      className={
                        i === 0
                          ? "max-w-2xl text-[15px] leading-[1.65] text-ink-soft"
                          : "max-w-2xl text-[13.5px] leading-[1.7] text-ink-soft"
                      }
                    >
                      {paragraph}
                    </p>
                  </Reveal>
                ))}
              </div>

              <Reveal delay={0.16}>
                <div className="mt-6 flex items-start gap-3 rounded-xl bg-mint p-4">
                  <Check
                    className="mt-0.5 h-4 w-4 shrink-0 text-forest"
                    aria-hidden="true"
                  />
                  <div>
                    <p className="text-[12.5px] font-medium text-forest">
                      {biographyAside.title}
                    </p>
                    <p className="mt-1 text-[12.5px] leading-relaxed text-ink-soft">
                      {biographyAside.body} {biographyAside.languages}
                    </p>
                  </div>
                </div>
              </Reveal>
            </div>

            <Reveal y={26} delay={0.1}>
              <div className="relative">
                <Panel tone="sage" className="p-2">
                  <div className="relative aspect-[4/5] overflow-hidden rounded-[1.35rem]">
                    <ParallaxImage
                      src="/images/consultation.jpg"
                      alt="Dr Sompo in consultation with a patient"
                      strength={44}
                      sizes="(max-width: 1024px) 92vw, 42vw"
                      className="absolute inset-0 rounded-[1.35rem]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-forest-ink/45 via-transparent to-transparent" />
                    <div className="absolute inset-x-3 bottom-3 flex flex-wrap gap-1.5">
                      {["MBChB", "FCOG (SA)", "MMed (O&G)"].map((code) => (
                        <span
                          key={code}
                          className="rounded-full bg-white/92 px-2.5 py-1 text-[10px] font-medium text-forest backdrop-blur-md"
                        >
                          {code}
                        </span>
                      ))}
                    </div>
                  </div>
                </Panel>
                <div className="absolute -bottom-5 -left-2 hidden rounded-2xl bg-white px-4 py-3 shadow-float border-hairline border-charcoal/8 sm:block">
                  <p className="text-[9.5px] uppercase tracking-[0.14em] text-ink-muted">
                    Consulting
                  </p>
                  <p className="mt-0.5 text-[12.5px] font-medium text-forest">
                    Life Roseacres Hospital
                  </p>
                  <p className="text-[10.5px] text-ink-soft">
                    Primrose, Germiston
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Qualifications */}
      <section className="sec sec-tint">
        <div className="shell">
          <SectionHead
            tag="Qualifications"
            title="Refined professional"
            muted="credentials."
            intro="Verified with the practice before publication."
          />

          <div className="mt-8 grid gap-3.5 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <Reveal y={22}>
              <div className="relative aspect-[4/3] overflow-hidden rounded-[1.35rem] bg-sage lg:aspect-[4/5]">
                <Image
                  src="/images/portrait-somp-card.jpg"
                  alt="Dr CM Ngwey-Sompo"
                  fill
                  sizes="(max-width: 1024px) 92vw, 38vw"
                  className="object-cover object-[center_22%]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-forest-ink/60 via-transparent to-transparent" />
                <div className="absolute inset-x-4 bottom-4">
                  <p className="text-[10px] uppercase tracking-[0.16em] text-white/80">
                    Qualifications
                  </p>
                  <p className="mt-1 text-[13.5px] font-medium text-white">
                    FCOG (SA) · MMed (O&amp;G) · MBChB · BSc (Biomed)
                  </p>
                </div>
              </div>
            </Reveal>

            <RevealGroup className="grid gap-3 sm:grid-cols-2" stagger={0.07}>
              {credentials.map((credential, i) => (
                <RevealItem key={credential.code}>
                  <div className="group relative h-full overflow-hidden rounded-[1.25rem] bg-white p-5 border-hairline border-charcoal/8 hover:border-forest/25">
                    <span
                      aria-hidden="true"
                      className="absolute -right-6 -top-6 grid h-20 w-20 place-items-center rounded-full bg-mint text-[26px] font-light text-forest transition-transform duration-700 group-hover:scale-110"
                    >
                      0{i + 1}
                    </span>
                    <div className="relative flex items-start justify-between gap-3">
                      <p className="text-[16px] font-medium tracking-[-0.02em] text-charcoal">
                        {credential.code}
                      </p>
                      <span
                        className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold"
                        aria-hidden="true"
                      />
                    </div>
                    <p className="relative mt-2 max-w-[22rem] text-[12.5px] leading-relaxed text-ink-soft">
                      {credential.title}
                    </p>
                    <p className="relative mt-2 text-[10px] uppercase tracking-[0.14em] text-ink-muted">
                      {credential.institution}
                    </p>
                    {credential.note && (
                      <p className="relative mt-3 border-t-hairline border-charcoal/8 pt-2.5 text-[10.5px] leading-relaxed text-ink-soft">
                        {credential.note}
                      </p>
                    )}
                  </div>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </div>
      </section>

      {/* Affiliations */}
      <section className="sec">
        <div className="shell">
          <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14">
            <div>
              <SectionHead
                tag="Affiliations"
                title="Professional and"
                muted="hospital associations."
              />
              <Reveal delay={0.1} y={20}>
                <div className="relative mt-6 aspect-[16/10] overflow-hidden rounded-[1.25rem] bg-sage">
                  <Image
                    src="/images/hospital-exterior.jpg"
                    alt="Life Roseacres Hospital, Primrose"
                    fill
                    sizes="(max-width: 1024px) 92vw, 34vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-forest-ink/60 via-transparent to-transparent" />
                  <p className="absolute inset-x-4 bottom-3.5 text-[11px] font-medium text-white">
                    {practice.hospital}
                  </p>
                </div>
              </Reveal>
            </div>

            <div>
              <RevealGroup
                className="divide-y-hairline divide-charcoal/8 border-y-hairline border-charcoal/8"
                stagger={0.05}
              >
                {affiliations.map((affiliation) => (
                  <RevealItem key={affiliation.name}>
                    <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 py-3.5">
                      <div className="flex items-center gap-3">
                        <span
                          aria-hidden="true"
                          className={
                            affiliation.state === "verified"
                              ? "h-1.5 w-1.5 rounded-full bg-forest/50"
                              : "h-1.5 w-1.5 rounded-full bg-gold ring-2 ring-gold/25"
                          }
                        />
                        <p className="text-[13px] text-ink-soft">
                          {affiliation.name}
                        </p>
                      </div>
                      <p className="pl-6 text-[10.5px] uppercase tracking-[0.1em] text-ink-soft sm:pl-0">
                        {affiliation.detail}
                      </p>
                    </div>
                  </RevealItem>
                ))}
              </RevealGroup>
              {affiliations.some((a) => a.state === "pending") ? (
                <p className="mt-3 flex items-center gap-2 text-[10.5px] text-ink-soft">
                  <span
                    className="h-1.5 w-1.5 rounded-full bg-gold ring-2 ring-gold/25"
                    aria-hidden="true"
                  />
                  Marked items await confirmation from the practice before
                  publication.
                </p>
              ) : (
                <p className="mt-3 text-[10.5px] leading-relaxed text-ink-soft">
                  Registration and memberships confirmed with the practice. Hospital
                  appointments vary — confirm where your procedure will take place
                  when you book.
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* How she works */}
      <section className="sec sec-tint">
        <div className="shell">
          <SectionHead
            tag="How she works"
            title="A medical philosophy built on"
            muted="listening first."
            intro="Specialist expertise, delivered with empathy, dignity and modern medical care."
          />

          <div className="mt-8 grid gap-3.5 sm:grid-cols-3">
            {values.map((value, i) => (
              <Reveal key={value.title} delay={i * 0.08} y={20}>
                <div className="group flex h-full flex-col overflow-hidden rounded-[1.35rem] bg-white border-hairline border-charcoal/8">
                  <div className="relative aspect-[4/3] overflow-hidden bg-sage">
                    <Image
                      src={value.image}
                      alt={value.alt}
                      fill
                      sizes="(max-width: 640px) 92vw, 30vw"
                      className="object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-forest-ink/40 to-transparent" />
                  </div>
                  <div className="flex flex-1 flex-col p-4">
                    <div className="flex items-center gap-2.5">
                      <IconDisc>
                        <span className="h-1.5 w-1.5 rounded-full bg-forest" />
                      </IconDisc>
                      <p className="text-[13.5px] font-medium tracking-[-0.01em] text-charcoal">
                        {value.title}
                      </p>
                    </div>
                    <p className="mt-2.5 text-[12px] leading-relaxed text-ink-soft">
                      {value.body}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.1}>
            <div className="mt-8 flex flex-wrap items-center gap-2.5">
              <Link href="/contact" className="btn">
                Request a consultation
                <i aria-hidden="true">
                  <ArrowUpRight className="h-3 w-3" />
                </i>
              </Link>
              <Link
                href="/research"
                className="btn btn-light border border-charcoal/12 shadow-none"
              >
                Her research
                <i aria-hidden="true">
                  <ArrowUpRight className="h-3 w-3" />
                </i>
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

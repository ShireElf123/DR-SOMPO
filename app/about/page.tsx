import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Check } from "lucide-react";
import { PageHero, SectionHead } from "@/components/page-hero";
import { PhotoCard } from "@/components/photo-card";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/motion";
import { affiliations, biography, biographyAside, credentials, practice } from "@/lib/practice";

export const metadata: Metadata = {
  title: "Meet Dr CM Ngwey-Sompo — Specialist Obstetrician & Gynaecologist",
  description:
    "Dr CM Ngwey-Sompo is a specialist Obstetrician and Gynaecologist practising at Life Roseacres Hospital, Primrose, Germiston. MBChB, FCOG (SA), MMed (O&G) Wits. Consultations in English and French.",
  alternates: { canonical: "/about" },
};

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
    image: "/images/patient-quiet.jpg",
    alt: "A patient in the clinic waiting area",
  },
  {
    title: "Continuity of care",
    body: "From first consultation through pregnancy, surgery or follow-up, you are cared for by the same specialist.",
    image: "/images/hospital-exterior.jpg",
    alt: "Life Roseacres Hospital entrance",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        tag="Meet Dr Somp"
        title="Specialist care, with"
        muted="personal understanding."
        intro={`${practice.title} · ${practice.entity}`}
        image="/images/portrait-somp.jpg"
        alt="Portrait of Dr CM Ngwey-Sompo"
        aspect="aspect-[16/11] sm:aspect-[16/8] lg:aspect-[16/7]"
      />

      {/* Biography */}
      <section className="bg-white py-12 sm:py-16">
        <div className="shell">
          <div className="grid gap-9 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12">
            <div>
              <div className="space-y-4">
                {biography.map((paragraph, i) => (
                  <Reveal key={i} delay={i * 0.04}>
                    <p
                      className={
                        i === 0
                          ? "max-w-2xl text-[15px] leading-[1.65] text-charcoal/80"
                          : "max-w-2xl text-[13.5px] leading-[1.7] text-charcoal/62"
                      }
                    >
                      {paragraph}
                    </p>
                  </Reveal>
                ))}
              </div>

              <Reveal delay={0.16}>
                <div className="mt-6 flex items-start gap-3 rounded-xl bg-mint p-4">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-forest" aria-hidden="true" />
                  <div>
                    <p className="text-[12.5px] font-medium text-forest">
                      {biographyAside.title}
                    </p>
                    <p className="mt-1 text-[12.5px] leading-relaxed text-charcoal/60">
                      {biographyAside.body} {biographyAside.languages}
                    </p>
                  </div>
                </div>
              </Reveal>
            </div>

            <Reveal y={26} delay={0.1}>
              <div className="relative aspect-[4/5] overflow-hidden rounded-[1.25rem] rounded-tr-[4rem] bg-sage">
                <Image
                  src="/images/consultation.jpg"
                  alt="Dr Somp in consultation with a patient"
                  fill
                  sizes="(max-width: 1024px) 92vw, 42vw"
                  className="object-cover"
                />
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

          <RevealGroup className="mt-8 grid gap-3 sm:grid-cols-2" stagger={0.07}>
            {credentials.map((credential) => (
              <RevealItem key={credential.code}>
                <div className="h-full rounded-[1.1rem] border border-charcoal/8 bg-white p-5">
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-[15px] font-medium tracking-[-0.02em] text-charcoal">
                      {credential.code}
                    </p>
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" aria-hidden="true" />
                  </div>
                  <p className="mt-2 text-[12.5px] leading-relaxed text-charcoal/60">
                    {credential.title}
                  </p>
                  <p className="mt-2 text-[10.5px] uppercase tracking-[0.1em] text-charcoal/40">
                    {credential.institution}
                  </p>
                  {credential.note && (
                    <p className="mt-2 border-t border-charcoal/8 pt-2 text-[10.5px] leading-relaxed text-charcoal/45">
                      {credential.note}
                    </p>
                  )}
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* Affiliations */}
      <section className="sec">
        <div className="shell">
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-14">
            <SectionHead
              tag="Affiliations"
              title="Professional and"
              muted="hospital associations."
            />

            <div>
              <RevealGroup className="divide-y divide-charcoal/8 border-y border-charcoal/8" stagger={0.05}>
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
                        <p className="text-[13px] text-charcoal/75">{affiliation.name}</p>
                      </div>
                      <p className="pl-6 text-[10.5px] uppercase tracking-[0.1em] text-charcoal/40 sm:pl-0">
                        {affiliation.detail}
                      </p>
                    </div>
                  </RevealItem>
                ))}
              </RevealGroup>
              <p className="mt-3 flex items-center gap-2 text-[10.5px] text-charcoal/40">
                <span className="h-1.5 w-1.5 rounded-full bg-gold ring-2 ring-gold/25" aria-hidden="true" />
                Marked items await confirmation from the practice before publication.
              </p>
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
            {values.map((value) => (
              <PhotoCard
                key={value.title}
                image={value.image}
                alt={value.alt}
                label={value.title}
                ratio="aspect-[4/3]"
                body={value.body}
              />
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
              <Link href="/research" className="btn btn-light border border-charcoal/12 shadow-none">
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

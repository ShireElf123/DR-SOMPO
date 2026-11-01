import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, ShieldCheck } from "lucide-react";
import { PageHero, SectionHead } from "@/components/page-hero";
import Image from "next/image";
import { IconDisc, Panel, Plate } from "@/components/ui/plate";
import { Reveal, RevealGroup, RevealItem, ScrollWords } from "@/components/ui/motion";
import { Faqs } from "@/components/sections/faqs";
import { journey, practice } from "@/lib/practice";

export const metadata: Metadata = {
  title: "Patient Information — Booking, Preparation & Confidentiality",
  description:
    "How to book with Dr CM Ngwey-Sompo, what to bring to your first consultation, how enquiries are handled under POPIA, and answers to common questions.",
  alternates: { canonical: "/patient-info" },
};

const prep = [
  {
    label: "Bring with you",
    body: "Your ID or passport, medical aid card, a list of current medications, and any previous results, scans or referral letters.",
    image: "/images/gynae.jpg",
    alt: "Folded linens and a folder in a consulting room",
  },
  {
    label: "Before you arrive",
    body: "Write down your questions. Consultations are unhurried, and having them noted makes the time go further.",
    image: "/images/patient-quiet.jpg",
    alt: "A patient in the clinic waiting area",
  },
  {
    label: "After your visit",
    body: "You leave with a written plan, follow-up timing and the practice's direct contact details.",
    image: "/images/consultation.jpg",
    alt: "A consultation in progress",
  },
];

export default function PatientInfoPage() {
  return (
    <>
      <PageHero
        tag="Patient information"
        title="Everything you need"
        muted="before your visit."
        intro="How booking works, what to bring, how your information is handled, and the questions patients ask most."
        image="/images/patient-quiet.jpg"
        alt="A patient sitting calmly in the clinic waiting area"
      />

      {/* Journey */}
      <section className="bg-white py-12 sm:py-16">
        <div className="shell">
          <SectionHead
            tag="How it works"
            title="Three steps, from enquiry"
            muted="to follow-up."
          />

          <div className="mt-8 grid gap-3.5 sm:grid-cols-3">
            {journey.map((step, i) => (
              <Reveal key={step.step} delay={i * 0.08}>
                <div className="group flex h-full flex-col overflow-hidden rounded-[1.35rem] bg-white ring-1 ring-charcoal/8">
                  <div className="relative aspect-[4/3] overflow-hidden bg-sage">
                    <Image
                      src={
                        ["/images/consultation.jpg", "/images/portrait-somp.jpg", "/images/patient-quiet.jpg"][i % 3]
                      }
                      alt=""
                      fill
                      sizes="(max-width: 640px) 92vw, 30vw"
                      className="object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-forest-ink/45 to-transparent" />
                    <span className="absolute left-3 top-3 grid h-7 w-7 place-items-center rounded-full bg-white/95 text-[10.5px] font-medium text-forest backdrop-blur-md">
                      {step.step}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-4">
                    <h3 className="text-[13.5px] font-medium tracking-[-0.01em] text-charcoal">
                      {step.title}
                    </h3>
                    <p className="mt-1.5 flex-1 text-[12px] leading-relaxed text-ink-soft">
                      {step.body}
                    </p>
                    <p className="mt-3 text-[9.5px] uppercase tracking-[0.14em] text-ink-muted">
                      {step.meta}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Preparation */}
      <section className="sec sec-tint">
        <div className="shell">
          <SectionHead
            tag="Preparation"
            title="What to bring, and"
            muted="what to expect."
          />
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {prep.map((item, i) => (
              <Reveal key={item.label} delay={i * 0.07} y={20}>
                <Plate
                  image={item.image}
                  alt={item.alt}
                  index={`0${i + 1}`}
                  label={item.label}
                  meta="Guide"
                  ratio="aspect-[4/3]"
                  body={item.body}
                />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Privacy */}
      <section className="sec">
        <div className="shell">
          <Reveal>
            <Panel tone="forest" className="p-6 sm:p-9">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full border border-white/15"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full border border-white/10"
              />
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="max-w-xl">
                  <span className="tag tag-light">Privacy</span>
                  <h2 className="text-[clamp(1.4rem,2.8vw,1.9rem)] leading-[1.08]">
                    Your information is handled with care.
                  </h2>
                  <p className="mt-3 text-[13px] leading-relaxed text-white/85">
                    Enquiries are received by the practice and handled in line with
                    South African privacy law, including the Protection of Personal
                    Information Act (POPIA). The website asks for the minimum needed
                    to arrange an appointment, stores nothing, and is not a channel
                    for clinical information.
                  </p>
                  <p className="mt-3 text-[11.5px] leading-relaxed text-white/75">
                    Please do not send symptoms, results or other sensitive medical
                    information through the enquiry form or by email. Urgent concerns
                    should go to {practice.hospital} or your nearest emergency
                    department.
                  </p>
                </div>
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/12 text-white ring-1 ring-white/25">
                  <ShieldCheck className="h-5 w-5" aria-hidden="true" />
                </span>
              </div>
            </Panel>
          </Reveal>
        </div>
      </section>

      {/* FAQs */}
      <Faqs />

      <section className="bg-white pb-16 pt-8">
        <div className="shell text-center">
          <RevealGroup className="inline-flex flex-wrap items-center justify-center gap-2.5" stagger={0.08}>
            <RevealItem>
              <Link href="/contact" className="btn">
                Contact the practice
                <i aria-hidden="true">
                  <ArrowUpRight className="h-3 w-3" />
                </i>
              </Link>
            </RevealItem>
            <RevealItem>
              <a
                href={practice.phoneHref}
                className="btn btn-light border border-charcoal/12 shadow-none"
              >
                {practice.phone}
                <i aria-hidden="true">
                  <ArrowUpRight className="h-3 w-3" />
                </i>
              </a>
            </RevealItem>
          </RevealGroup>
        </div>
      </section>
    </>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, ShieldCheck } from "lucide-react";
import { PageHero, SectionHead } from "@/components/page-hero";
import { PhotoCard } from "@/components/photo-card";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/motion";
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
            {journey.map((step) => (
              <Reveal key={step.step}>
                <div className="h-full rounded-[1.1rem] border border-charcoal/10 p-5">
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-mint text-[10.5px] font-medium text-forest">
                    {step.step}
                  </span>
                  <h3 className="mt-4 text-[13.5px] font-medium tracking-[-0.01em] text-charcoal">
                    {step.title}
                  </h3>
                  <p className="mt-1.5 text-[12px] leading-relaxed text-charcoal/55">{step.body}</p>
                  <p className="mt-3 text-[9.5px] uppercase tracking-[0.14em] text-charcoal/35">
                    {step.meta}
                  </p>
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
          <div className="mt-8 grid gap-3.5 sm:grid-cols-3">
            {prep.map((item) => (
              <PhotoCard
                key={item.label}
                image={item.image}
                alt={item.alt}
                label={item.label}
                ratio="aspect-[4/3]"
                body={item.body}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Privacy */}
      <section className="sec">
        <div className="shell">
          <Reveal>
            <div className="rounded-[1.25rem] bg-mint p-6 sm:p-8">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="max-w-xl">
                  <span className="tag bg-white">Privacy</span>
                  <h2 className="text-[clamp(1.4rem,2.8vw,1.9rem)] leading-[1.08]">
                    Your information is handled with care.
                  </h2>
                  <p className="mt-3 text-[13px] leading-relaxed text-charcoal/60">
                    Enquiries are received by the practice and handled in line with
                    South African privacy law, including the Protection of Personal
                    Information Act (POPIA). The website asks for the minimum needed
                    to arrange an appointment, stores nothing, and is not a channel
                    for clinical information.
                  </p>
                  <p className="mt-3 text-[11.5px] leading-relaxed text-charcoal/45">
                    Please do not send symptoms, results or other sensitive medical
                    information through the enquiry form or by email. Urgent concerns
                    should go to {practice.hospital} or your nearest emergency
                    department.
                  </p>
                </div>
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-forest">
                  <ShieldCheck className="h-5 w-5" aria-hidden="true" />
                </span>
              </div>
            </div>
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

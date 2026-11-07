import { BookingLink } from "@/components/booking-link";
import { faqJsonLd } from "@/lib/structured-data";
import { pageMetadata } from "@/lib/metadata";
import type { Metadata } from "next";
import { ArrowUpRight, Phone, ShieldCheck } from "lucide-react";
import { PageHero, SectionHead } from "@/components/page-hero";
import Image from "@/components/ui/practice-image";
import { Plate } from "@/components/ui/plate";
import { BotanicalBloom } from "@/components/ui/botanical";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/motion";
import { Faqs } from "@/components/sections/faqs";
import { journey, practice } from "@/lib/practice";

export const metadata: Metadata = pageMetadata(
  "Patient Information — Booking, Preparation & Confidentiality",
  "How to book with Dr CM Ngwey-Sompo, what to bring to your first consultation, how enquiries are handled under POPIA, and answers to common questions.",
  "/patient-info",
);

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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd()) }} />
      <PageHero
        tag="Patient information"
        title="Everything you need"
        muted="before your visit."
        intro="How booking works, what to bring, how your information is handled, and the questions patients ask most."
        image="/images/patient-quiet.jpg"
        mobileImage="/images/waiting-room.jpg"
        alt="A patient sitting calmly in the clinic waiting area"
      />

      {/* Journey */}
      <section className="bg-cream py-12 sm:py-16">
        <div className="shell">
          <SectionHead
            tag="How it works"
            title="Three steps, from enquiry"
            muted="to follow-up."
          />

          <div className="mt-8 grid gap-3.5 sm:grid-cols-3">
            {journey.map((step, i) => (
              <Reveal key={step.step} delay={i * 0.08}>
                <div className="group flex h-full flex-col overflow-hidden rounded-[1.35rem] bg-cream border-hairline border-charcoal/8">
                  <div className="relative aspect-[4/3] overflow-hidden bg-peach">
                    <Image
                      src={
                        ["/images/consultation.jpg", "/images/portrait-somp-card.jpg", "/images/patient-quiet.jpg"][i % 3]
                      }
                      alt=""
                      fill
                      sizes="(max-width: 640px) 92vw, 30vw"
                      className="object-cover object-[center_18%] transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
                    />
                    <span className="absolute left-3 top-3 grid h-7 w-7 place-items-center rounded-full bg-cream font-display text-[11px] italic text-ember ring-1 ring-ember/20">
                      {step.step}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-4">
                    <h3 className="text-[13px] font-medium tracking-[-0.01em] text-ink">
                      {step.title}
                    </h3>
                    <p className="mt-1.5 flex-1 text-[12px] leading-relaxed text-ink-soft">
                      {step.body}
                    </p>
                    <p className="mt-3 text-[10px] uppercase tracking-[0.14em] text-ink-muted">
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
      <section id="privacy" className="ember-gradient relative mt-16 overflow-hidden text-ink sm:mt-20">
        <BotanicalBloom className="absolute -right-6 -top-6 h-52 w-52" />
        <div className="shell relative z-10">
          <Reveal>
            <div className="relative py-14 sm:py-20">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="max-w-xl">
                  <span className="tag tag-light">Privacy</span>
                  <h2 className="text-[clamp(1.4rem,2.8vw,1.9rem)] leading-[1.08]">
                    Your information is handled with care.
                  </h2>
                  <p className="mt-3 text-[13px] leading-relaxed text-ink">
                    When online enquiries are enabled, your name, chosen contact
                    details and appointment preferences are sent to the practice
                    through its configured delivery provider. Until that connection
                    is approved, the calendar and form are a local planner only:
                    your draft is not submitted. Telephone and email remain available directly.
                  </p>
                  <p className="mt-3 text-[12px] leading-relaxed text-ink">
                    Delivery providers and website hosting may retain messages or
                    technical access logs. Contact the practice using the details
                    on the Contact page to ask about access, correction, retention
                    or deletion of your information under POPIA.
                  </p>
                  <p className="mt-3 text-[11px] leading-relaxed text-ink">
                    Please do not send symptoms, results or other sensitive medical
                    information through the enquiry form or by email. Urgent concerns
                    should go to {practice.hospital} or your nearest emergency
                    department.
                  </p>
                </div>
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-cream/70 text-ink ring-1 ring-charcoal/15">
                  <ShieldCheck className="h-5 w-5" aria-hidden="true" />
                </span>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* FAQs */}
      <Faqs />

      <section className="bg-cream pb-16 pt-8">
        <div className="shell text-center">
          <RevealGroup className="inline-flex flex-wrap items-center justify-center gap-2.5" stagger={0.08}>
            <RevealItem>
              <BookingLink className="btn">
                Book an appointment
                <i aria-hidden="true">
                  <ArrowUpRight className="h-3 w-3" />
                </i>
              </BookingLink>
            </RevealItem>
            <RevealItem>
              <a
                href={practice.phoneHref}
                className="btn btn-light border border-charcoal/12 shadow-none"
              >
                Call {practice.phone}
                <i aria-hidden="true">
                  <Phone className="h-3 w-3" />
                </i>
              </a>
            </RevealItem>
          </RevealGroup>
        </div>
      </section>
    </>
  );
}

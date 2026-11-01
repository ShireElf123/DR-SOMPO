"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";
import { Reveal, WordsIn } from "@/components/ui/motion";
import { SectionHead } from "@/components/page-hero";
import { biography, faqs, practice, research } from "@/lib/practice";

/** Home page teaser for the dedicated About page. */
export function AboutTeaser() {
  return (
    <section className="sec" aria-labelledby="about-teaser-heading">
      <div className="shell">
        <div className="grid items-center gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-12">
          <Reveal y={26}>
            <div className="relative">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[1.25rem] rounded-tl-[4rem] bg-sage">
                <Image
                  src="/images/portrait-somp.jpg"
                  alt="Portrait of Dr CM Ngwey-Sompo"
                  fill
                  sizes="(max-width: 1024px) 92vw, 40vw"
                  className="object-cover"
                />
              </div>
              <div className="absolute -bottom-4 right-3 rounded-xl bg-white px-3.5 py-2.5 shadow-[0_18px_40px_-24px_rgba(0,0,0,0.45)] sm:-right-5">
                <p className="text-[9.5px] uppercase tracking-[0.14em] text-charcoal/40">
                  Consulting
                </p>
                <p className="mt-0.5 text-[12px] font-medium text-forest">
                  Life Roseacres Hospital
                </p>
              </div>
            </div>
          </Reveal>

          <div>
            <SectionHead
              tag="Meet Dr Somp"
              title="Specialist care, with"
              muted="personal understanding."
              intro={biography[0]}
            />
            <Reveal delay={0.1}>
              <p className="mt-4 max-w-lg text-[13.5px] leading-[1.65] text-charcoal/60">
                {biography[2]}
              </p>
            </Reveal>
            <Reveal delay={0.16}>
              <div className="mt-6 flex flex-wrap items-center gap-2.5">
                <Link href="/about" className="btn">
                  Read her story
                  <i aria-hidden="true">
                    <ArrowUpRight className="h-3 w-3" />
                  </i>
                </Link>
                <div className="flex flex-wrap gap-1.5">
                  {["MBChB", "FCOG (SA)", "MMed (O&G)"].map((code) => (
                    <span
                      key={code}
                      className="rounded-full bg-ivory px-2.5 py-1 text-[10.5px] font-medium text-charcoal/60"
                    >
                      {code}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

/** Home page teaser for the Research & cervical health page. */
export function ResearchTeaser() {
  return (
    <section className="sec" aria-labelledby="research-teaser-heading">
      <div className="shell">
        <Reveal y={24}>
          <div className="relative overflow-hidden rounded-[1.5rem] bg-forest text-white">
            <div className="grid lg:grid-cols-[1.05fr_0.95fr]">
              <div className="p-6 sm:p-9 lg:p-11">
                <span className="tag tag-light">Cervical health</span>
                <h2
                  id="research-teaser-heading"
                  className="text-[clamp(1.7rem,3.6vw,2.5rem)] leading-[1.04]"
                >
                  <WordsIn text="Advancing women's health through" />{" "}
                  <span className="text-lime/90">
                    <WordsIn text="research and education." delay={0.18} />
                  </span>
                </h2>
                <p className="mt-4 max-w-md text-[13px] leading-relaxed text-white/80">
                  A Master of Medicine study on margin status after LLETZ in women
                  living with HIV, presented at SASOG 2025, FIGO 2025 and in Dubai.
                </p>
                <Link href="/research" className="btn btn-light mt-6">
                  Explore the research
                  <i aria-hidden="true">
                    <ArrowUpRight className="h-3 w-3" />
                  </i>
                </Link>
              </div>
              <div className="relative min-h-[14rem] lg:min-h-full">
                <Image
                  src="/images/cervical-research.jpg"
                  alt="Laboratory microscope and research folders"
                  fill
                  sizes="(max-width: 1024px) 92vw, 46vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-forest via-forest/30 to-transparent lg:from-forest/70 lg:via-transparent" />
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/** Home page teaser for the Patient information page. */
export function FaqTeaser() {
  return (
    <section className="sec sec-tint" aria-labelledby="faq-teaser-heading">
      <div className="shell">
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-14">
          <div>
            <SectionHead
              tag="Patient information"
              title="Before you visit"
              intro="Practical answers about booking, records, confidentiality and what to expect."
            />
            <Reveal delay={0.12}>
              <Link href="/patient-info" className="btn mt-6">
                All questions
                <i aria-hidden="true">
                  <ArrowUpRight className="h-3 w-3" />
                </i>
              </Link>
            </Reveal>
          </div>

          <ul className="border-t border-charcoal/10">
            {faqs.slice(0, 4).map((faq) => (
              <li key={faq.q} className="border-b border-charcoal/10 py-4">
                <p className="text-[14px] tracking-[-0.01em] text-charcoal/85">{faq.q}</p>
                <p className="mt-1.5 max-w-[34rem] text-[12px] leading-relaxed text-charcoal/55">
                  {faq.a.length > 150 ? `${faq.a.slice(0, 150).trimEnd()}…` : faq.a}
                </p>
              </li>
            ))}
          </ul>
        </div>
        <h2 id="faq-teaser-heading" className="sr-only">
          Before you visit
        </h2>
      </div>
    </section>
  );
}

/** Closing band with the three ways to reach the practice. */
export function ContactBand() {
  return (
    <section className="sec" aria-labelledby="contact-band-heading">
      <div className="shell">
        <div className="grid gap-3.5 lg:grid-cols-[1.1fr_0.9fr]">
          <Reveal y={20}>
            <div className="flex h-full flex-col justify-between rounded-[1.25rem] bg-mint p-6 sm:p-8">
              <div>
                <span className="tag bg-white">Appointments</span>
                <h2
                  id="contact-band-heading"
                  className="text-[clamp(1.7rem,3.4vw,2.3rem)] leading-[1.04]"
                >
                  <WordsIn text="Speak to the practice" />
                </h2>
                <p className="mt-3 max-w-sm text-[13px] leading-relaxed text-charcoal/60">
                  Appointment enquiries are handled directly: telephone first,
                  email for written requests, WhatsApp once the number is confirmed.
                </p>
              </div>
              <div className="mt-6 flex flex-wrap items-center gap-2.5">
                <a href={practice.phoneHref} className="btn btn-forest">
                  {practice.phone}
                  <i aria-hidden="true">
                    <Phone className="h-3 w-3" />
                  </i>
                </a>
                <Link href="/contact" className="btn btn-light border border-charcoal/12 shadow-none">
                  Enquiry form
                  <i aria-hidden="true">
                    <ArrowUpRight className="h-3 w-3" />
                  </i>
                </Link>
              </div>
            </div>
          </Reveal>

          <Reveal y={20} delay={0.08}>
            <div className="relative flex h-full flex-col justify-end overflow-hidden rounded-[1.25rem] bg-sage p-6 text-white sm:p-7">
              <Image
                src="/images/hospital-exterior.jpg"
                alt="Life Roseacres Hospital entrance"
                fill
                sizes="(max-width: 1024px) 92vw, 40vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-forest-ink/80 via-forest-ink/20 to-transparent" />
              <div className="relative">
                <p className="text-[10px] uppercase tracking-[0.16em] text-white/60">
                  Consulting rooms
                </p>
                <p className="mt-1 text-[14px] font-medium">{practice.hospital}</p>
                <p className="mt-0.5 text-[11.5px] text-white/70">
                  {practice.addressLines[0]}, {practice.addressLines[1]}
                </p>
                <div className="mt-3 flex gap-3 text-[11px] text-white/70">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-3 w-3" aria-hidden="true" /> Primrose
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Mail className="h-3 w-3" aria-hidden="true" /> Email
                  </span>
                </div>
              </div>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.12}>
          <p className="mt-4 text-[11px] leading-relaxed text-charcoal/40">
            {research.disclaimer}
          </p>
        </Reveal>
      </div>
    </section>
  );
}

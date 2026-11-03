import { BookingLink } from "@/components/booking-link";
import { FaqList } from "@/components/ui/faq-list";
import Link from "next/link";
import { ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";
import { ParallaxImage, Reveal, WordsIn } from "@/components/ui/motion";
import { Panel, SignalBars } from "@/components/ui/plate";
import { SectionHead } from "@/components/page-hero";
import { biography, faqs, practice } from "@/lib/practice";

/** Home page teaser for the dedicated About page. */
export function AboutTeaser() {
  return (
    <section className="sec" aria-labelledby="about-teaser-heading">
      <div className="shell">
        <div className="grid items-center gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-12">
          <Reveal y={26}>
            <div className="relative">
              <div className="photo-depth relative aspect-[4/5] overflow-hidden rounded-[1.35rem] bg-peach">
                <ParallaxImage
                  src="/images/portrait-somp-card.jpg"
                  alt="Portrait of Dr CM Ngwey-Sompo"
                  strength={44}
                  sizes="(max-width: 1024px) 92vw, 40vw"
                  imageClassName="object-[center_16%]"
                  className="absolute inset-0"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ember/14 to-transparent" />
              </div>
              <p className="mt-4 text-[10px] uppercase leading-relaxed tracking-[0.15em] text-ink-muted">
                FCOG (SA) · MMed (O&amp;G) · Wits
                <span className="mx-2 opacity-40">/</span>
                Life Roseacres Hospital, Primrose
              </p>
            </div>
          </Reveal>

          <div>
            <h2 id="about-teaser-heading" className="sr-only">
              Meet Dr Sompo
            </h2>
            <p className="flex items-center gap-3 text-[10px] uppercase tracking-[0.2em] text-ink-muted">
              <span className="h-px w-7 bg-charcoal/40" aria-hidden="true" />
              Meet Dr Sompo
            </p>
            <Reveal delay={0.06}>
              <blockquote className="mt-5 max-w-[33rem] font-display text-[clamp(1.8rem,3.1vw,2.6rem)] italic leading-[1.08] tracking-[-0.015em] text-ink">
                “{biography[4].replace(/^Having experienced /, "Having experienced ")}”
              </blockquote>
              <p className="mt-4 text-[10px] uppercase tracking-[0.16em] text-ink-soft">
                Dr CM Ngwey-Sompo
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-6 max-w-lg text-[13px] leading-[1.7] text-ink-soft">
                {biography[0]}
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
                      className="rounded-full bg-cream px-2.5 py-1 text-[10px] font-medium text-ink-soft"
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
    <section className="ember-gradient mt-16 text-ink sm:mt-20" aria-labelledby="research-teaser-heading">
      <div className="shell py-12 sm:py-16 lg:py-20">
        <Reveal y={24}>
          <div>
            <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-12">
              <div className="lg:pr-4">
                <span className="tag tag-light">Cervical health</span>
                <h2
                  id="research-teaser-heading"
                  className="text-[clamp(1.7rem,3.6vw,2.5rem)] leading-[1.04]"
                >
                  <WordsIn text="Advancing women's health through" />{" "}
                  <span className="text-ink/70">
                    <WordsIn text="research and education." delay={0.18} />
                  </span>
                </h2>
                <p className="mt-4 max-w-md text-[13px] leading-relaxed text-ink">
                  A Master of Medicine study on margin status after LLETZ in women
                  living with HIV, presented at SASOG 2025, FIGO 2025 and in Dubai.
                </p>
                <SignalBars
                  values={[20, 34, 28, 46, 58, 50, 72, 64, 84]}
                  className="mt-5 h-9 text-ink/70"
                />
                <Link href="/research" className="btn btn-light mt-6">
                  Explore the research
                  <i aria-hidden="true">
                    <ArrowUpRight className="h-3 w-3" />
                  </i>
                </Link>
              </div>
              <div className="photo-depth relative min-h-[16rem] overflow-hidden rounded-[1.5rem] sm:min-h-[20rem] lg:min-h-[24rem]">
                <ParallaxImage
                  src="/images/cervical-research.jpg"
                  alt="Laboratory microscope and research folders"
                  strength={38}
                  sizes="(max-width: 1024px) 92vw, 46vw"
                  className="absolute inset-0"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-apricot via-ember/15 to-transparent lg:from-ember/30 lg:via-transparent" />
                <div className="absolute inset-x-4 bottom-4 z-[2] flex items-end justify-between gap-3">
                  <p className="glass max-w-[16rem] rounded-lg px-2.5 py-1.5 text-[10px] leading-relaxed text-ink">
                    LLETZ margin status · Wits MMed · 2025
                  </p>
                  <span className="glass rounded-full px-2.5 py-1 text-[10px] font-medium text-ink">
                    Research
                  </span>
                </div>
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
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
          <div>
            <SectionHead
              id="faq-teaser-heading"
              tag="Patient information"
              title="Before you visit"
              intro="Practical answers about booking, records, confidentiality and what to expect."
            />
            <Reveal delay={0.1} y={22}>
              <div className="photo-depth relative mt-6 aspect-[16/10] overflow-hidden rounded-[1.35rem] bg-peach">
                <ParallaxImage
                  src="/images/waiting-room.jpg"
                  alt="The practice waiting area, with quiet seating and natural light"
                  strength={26}
                  sizes="(max-width: 1024px) 92vw, 38vw"
                  className="absolute inset-0"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ember/22 to-transparent" />
                <p className="glass absolute inset-x-4 bottom-3.5 z-[2] rounded-lg px-3 py-2 text-[11px] leading-relaxed text-ink">
                  Arrive a few minutes early — the rooms are quiet and there is no
                  need to rush.
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.14}>
              <Link href="/patient-info" className="btn mt-6">
                All questions
                <i aria-hidden="true">
                  <ArrowUpRight className="h-3 w-3" />
                </i>
              </Link>
            </Reveal>
          </div>

          <div>
            <FaqList items={faqs.slice(0, 4)} prefix="home-faq" />
          </div>
        </div>
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
            <Panel tone="blush" className="flex h-full flex-col justify-between p-6 sm:p-8">
              <div>
                <span className="tag bg-cream">Appointments</span>
                <h2
                  id="contact-band-heading"
                  className="text-[clamp(1.7rem,3.4vw,2.3rem)] leading-[1.04]"
                >
                  <WordsIn text="Speak to the practice" />
                </h2>
                <p className="mt-3 max-w-sm text-[13px] leading-relaxed text-ink-soft">
                  Appointment enquiries are handled directly: telephone first,
                  email for written requests, WhatsApp once the number is confirmed.
                </p>
              </div>
              <div className="mt-6 flex flex-wrap items-center gap-2.5">
                <a href={practice.phoneHref} className="btn btn">
                  {practice.phone}
                  <i aria-hidden="true">
                    <Phone className="h-3 w-3" />
                  </i>
                </a>
                <BookingLink className="btn btn-light border border-charcoal/12 shadow-none">
                  Enquiry form
                  <i aria-hidden="true">
                    <ArrowUpRight className="h-3 w-3" />
                  </i>
                </BookingLink>
              </div>
            </Panel>
          </Reveal>

          <Reveal y={20} delay={0.08}>
            <div className="photo-depth relative flex h-full min-h-[19rem] flex-col justify-end overflow-hidden rounded-[1.5rem] bg-peach p-4 sm:p-5">
              <ParallaxImage
                src="/images/hospital-exterior.jpg"
                alt="Life Roseacres Hospital entrance"
                strength={30}
                sizes="(max-width: 1024px) 92vw, 40vw"
                className="absolute inset-0"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ember/30 to-transparent" />
              <div className="glass relative z-[2] rounded-[1.1rem] p-4 text-ink">
                <p className="text-[10px] uppercase tracking-[0.16em] text-ink/75">
                  Consulting rooms
                </p>
                <p className="mt-1 text-[14px] font-medium">{practice.hospital}</p>
                <p className="mt-0.5 text-[11px] text-ink-soft">
                  {practice.addressLines[0]}, {practice.addressLines[1]}
                </p>
                <div className="mt-3 flex gap-3 text-[11px] text-ink-soft">
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

      </div>
    </section>
  );
}

"use client";

import { Clock, Mail, MapPin, MessageCircle, Navigation, Phone } from "lucide-react";
import Image from "next/image";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/motion";
import { EnquiryForm } from "@/components/enquiry-form";
import { practice } from "@/lib/practice";

const mapsUrl =
  "https://www.google.com/maps/search/?api=1&query=Life+Roseacres+Hospital%2C+St+Joseph+and+Castor+Road%2C+Primrose%2C+Germiston";

const directionsUrl =
  "https://www.google.com/maps/dir/?api=1&destination=Life+Roseacres+Hospital%2C+St+Joseph+and+Castor+Road%2C+Primrose%2C+Germiston";

export function Contact() {
  const whatsappHref = practice.whatsappNumber
    ? `https://wa.me/${practice.whatsappNumber}`
    : undefined;

  return (
    <section id="contact" className="relative py-16 sm:py-20 lg:py-24" aria-labelledby="contact-heading">
      <div className="shell">
        <div className="grid gap-8 lg:grid-cols-[1.02fr_0.98fr] lg:gap-10">
          {/* Left: details + map */}
          <div>
            <Reveal>
              <span className="eyebrow">Contact &amp; appointments</span>
            </Reveal>
            <Reveal delay={0.06}>
              <h2
                id="contact-heading"
                className="display mt-5 text-[clamp(1.9rem,4vw,2.85rem)] text-forest"
              >
                Let&apos;s arrange{" "}
                <span className="serif-accent">your visit.</span>
              </h2>
            </Reveal>
            <Reveal delay={0.12}>
              <p className="mt-4 max-w-md text-[0.9375rem] leading-relaxed text-charcoal/68">
                Appointment enquiries are handled directly by the practice.
                Telephone is the primary route; WhatsApp will be offered as soon
                as a WhatsApp-enabled number is confirmed.
              </p>
            </Reveal>

            <RevealGroup className="mt-7 space-y-2.5" stagger={0.07}>
              <RevealItem>
                <a
                  href={practice.phoneHref}
                  className="group flex items-center gap-4 rounded-2xl border border-forest/10 bg-white p-4 transition-all duration-500 hover:-translate-y-0.5 hover:border-forest/25 hover:shadow-[var(--shadow-lift)]"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-forest text-ivory">
                    <Phone className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[0.5625rem] font-semibold uppercase tracking-[0.16em] text-forest/56">
                      Telephone · primary
                    </span>
                    <span className="block text-[0.9375rem] font-medium tracking-[-0.01em] text-forest">
                      {practice.phone}
                    </span>
                  </span>
                  <span className="ml-auto text-[0.6875rem] font-medium text-forest/56 transition-colors group-hover:text-forest">
                    Call
                  </span>
                </a>
              </RevealItem>

              <RevealItem>
                <a
                  href={`mailto:${practice.email}`}
                  className="group flex items-center gap-4 rounded-2xl border border-forest/10 bg-white p-4 transition-all duration-500 hover:-translate-y-0.5 hover:border-forest/25 hover:shadow-[var(--shadow-lift)]"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sage text-forest">
                    <Mail className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[0.5625rem] font-semibold uppercase tracking-[0.16em] text-forest/56">
                      Email
                    </span>
                    <span className="block truncate text-[0.875rem] font-medium tracking-[-0.01em] text-forest">
                      {practice.email}
                    </span>
                  </span>
                  <span className="ml-auto shrink-0 text-[0.6875rem] font-medium text-forest/56 transition-colors group-hover:text-forest">
                    Write
                  </span>
                </a>
              </RevealItem>

              <RevealItem>
                <div className="flex items-center gap-4 rounded-2xl border border-dashed border-forest/20 bg-mint/40 p-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-forest/62">
                    <MessageCircle className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[0.5625rem] font-semibold uppercase tracking-[0.16em] text-forest/56">
                      WhatsApp · awaiting confirmation
                    </span>
                    <span className="block text-[0.8125rem] leading-snug text-charcoal/66">
                      A WhatsApp enquiry channel will appear here once the
                      practice confirms a WhatsApp-enabled number.
                    </span>
                  </span>
                  {whatsappHref && (
                    <a
                      href={whatsappHref}
                      className="ml-auto text-[0.6875rem] font-medium text-forest underline underline-offset-4"
                    >
                      Open
                    </a>
                  )}
                </div>
              </RevealItem>
            </RevealGroup>

            {/* Location card */}
            <Reveal delay={0.15}>
              <div className="mt-4 overflow-hidden rounded-[1.5rem] border border-forest/10 bg-white">
                <div className="relative h-40 sm:h-44">
                  <Image
                    src="/images/hospital-exterior.jpg"
                    alt="Entrance of Life Roseacres Hospital in Primrose, Germiston"
                    fill
                    sizes="(max-width: 1024px) 92vw, 46vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-forest-ink/55 via-forest-ink/10 to-transparent" />
                  <div className="absolute inset-x-4 bottom-3.5 flex items-end justify-between gap-3">
                    <div>
                      <p className="text-[0.5625rem] font-semibold uppercase tracking-[0.16em] text-sage/68">
                        Consulting rooms
                      </p>
                      <p className="mt-0.5 text-[0.875rem] font-medium text-ivory">
                        {practice.hospital}
                      </p>
                    </div>
                    <a
                      href={directionsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 rounded-full bg-ivory/95 px-3 py-1.5 text-[0.6875rem] font-medium text-forest transition-colors hover:bg-white"
                    >
                      <Navigation className="h-3 w-3" aria-hidden="true" />
                      Directions
                    </a>
                  </div>
                </div>

                <div className="grid gap-4 p-5 sm:grid-cols-2">
                  <div className="flex gap-3">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-forest/56" aria-hidden="true" />
                    <address className="not-italic">
                      <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-forest/56">
                        Address
                      </p>
                      <p className="mt-1 text-[0.8125rem] leading-relaxed text-charcoal/72">
                        {practice.entity}
                        <br />
                        {practice.hospital}
                        <br />
                        {practice.addressLines[0]}
                        <br />
                        {practice.addressLines[1]}, {practice.city}
                      </p>
                      <a
                        href={mapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 inline-block text-[0.6875rem] font-medium text-forest underline decoration-forest/25 underline-offset-4 hover:decoration-forest"
                      >
                        Open in Maps
                      </a>
                    </address>
                  </div>

                  <div className="flex gap-3">
                    <Clock className="mt-0.5 h-4 w-4 shrink-0 text-forest/56" aria-hidden="true" />
                    <div>
                      <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-forest/56">
                        Consulting hours
                      </p>
                      <p className="mt-1 text-[0.8125rem] leading-relaxed text-charcoal/72">
                        Please call the practice to confirm current consulting
                        hours and availability. Hours are not published here until
                        the practice confirms them.
                      </p>
                      <p className="mt-2 rounded-lg bg-ivory px-2.5 py-1.5 text-[0.6875rem] leading-relaxed text-charcoal/62">
                        Emergencies: contact Life Roseacres Hospital or your
                        nearest emergency department.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Right: enquiry form */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            <Reveal delay={0.1} y={26}>
              <EnquiryForm />
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

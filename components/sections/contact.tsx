"use client";

import { ArrowUpRight, Mail, MapPin, MessageCircle, Navigation, Phone } from "lucide-react";
import { EnquiryForm } from "@/components/enquiry-form";
import { Reveal, WordsIn } from "@/components/ui/motion";
import { practice } from "@/lib/practice";

const directionsUrl =
  "https://www.google.com/maps/dir/?api=1&destination=Life+Roseacres+Hospital%2C+St+Joseph+and+Castor+Road%2C+Primrose%2C+Germiston";

export function Contact() {
  return (
    <section id="contact" className="sec" aria-labelledby="contact-heading">
      <div className="shell">
        <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
          {/* Details */}
          <Reveal y={22}>
            <div className="flex h-full flex-col justify-between rounded-[1.25rem] bg-mint p-6 sm:p-8">
              <div>
                <span className="tag bg-white">Contact</span>
                <h2 id="contact-heading" className="text-[clamp(1.8rem,3.6vw,2.5rem)] leading-[1.04]">
                  <WordsIn text="Contact the practice" />
                </h2>

                <address className="mt-4 not-italic text-[13.5px] leading-[1.75] text-charcoal/70">
                  {practice.entity}
                  <br />
                  {practice.hospital}
                  <br />
                  {practice.addressLines[0]}
                  <br />
                  {practice.addressLines[1]}, Johannesburg
                </address>

                <ul className="mt-5 space-y-2.5">
                  <li>
                    <a href={practice.phoneHref} className="group flex items-center gap-3">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-forest text-white">
                        <Phone className="h-3.5 w-3.5" aria-hidden="true" />
                      </span>
                      <span className="text-[13.5px] font-medium text-charcoal">
                        {practice.phone}
                      </span>
                      <ArrowUpRight className="h-3.5 w-3.5 text-charcoal/25 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </a>
                  </li>
                  <li>
                    <a href={`mailto:${practice.email}`} className="group flex items-center gap-3">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-forest">
                        <Mail className="h-3.5 w-3.5" aria-hidden="true" />
                      </span>
                      <span className="break-all text-[13px] text-charcoal/75">
                        {practice.email}
                      </span>
                    </a>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-dashed border-charcoal/25 text-charcoal/40">
                      <MessageCircle className="h-3.5 w-3.5" aria-hidden="true" />
                    </span>
                    <span className="text-[12px] leading-snug text-charcoal/50">
                      WhatsApp — available once the practice confirms a
                      WhatsApp-enabled number.
                    </span>
                  </li>
                </ul>
              </div>

              <div className="mt-6 rounded-xl bg-white/70 p-3.5">
                <div className="flex items-start gap-2.5">
                  <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-forest/50" aria-hidden="true" />
                  <div>
                    <p className="text-[11.5px] leading-snug text-charcoal/55">
                      Consulting hours and medical aid arrangements are confirmed
                      directly by the practice.
                    </p>
                    <a
                      href={directionsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-flex items-center gap-1.5 text-[11.5px] font-medium text-forest"
                    >
                      <Navigation className="h-3 w-3" aria-hidden="true" />
                      Get directions
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Form */}
          <Reveal y={22} delay={0.08}>
            <EnquiryForm />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

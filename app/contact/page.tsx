import type { Metadata } from "next";
import Image from "next/image";
import { Mail, MapPin, MessageCircle, Navigation, Phone } from "lucide-react";
import { PageHero, SectionHead } from "@/components/page-hero";
import { EnquiryForm } from "@/components/enquiry-form";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/motion";
import { practice } from "@/lib/practice";

export const metadata: Metadata = {
  title: "Contact & Appointment Enquiries",
  description:
    "Contact Dr CM Ngwey-Sompo Inc. at Life Roseacres Hospital, Primrose, Germiston. Telephone 011 842 7651 or send a non-clinical appointment enquiry. Consultations in English and French.",
  alternates: { canonical: "/contact" },
};

const directionsUrl =
  "https://www.google.com/maps/dir/?api=1&destination=Life+Roseacres+Hospital%2C+St+Joseph+and+Castor+Road%2C+Primrose%2C+Germiston";

const mapsUrl =
  "https://www.google.com/maps/search/?api=1&query=Life+Roseacres+Hospital%2C+St+Joseph+and+Castor+Road%2C+Primrose%2C+Germiston";

export default function ContactPage() {
  return (
    <>
      <PageHero
        tag="Contact"
        title="Let's arrange"
        muted="your visit."
        intro="Appointment enquiries are handled directly by the practice — telephone first, email for written requests, WhatsApp once the number is confirmed."
        image="/images/hospital-exterior.jpg"
        alt="Life Roseacres Hospital entrance in Primrose, Germiston"
        aspect="aspect-[16/11] sm:aspect-[16/7] lg:aspect-[16/6]"
      />

      <section className="bg-white py-12 sm:py-16">
        <div className="shell">
          <div className="grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
            {/* Details */}
            <div>
              <Reveal>
                <div className="rounded-[1.25rem] bg-mint p-6 sm:p-7">
                  <SectionHead tag="Reach the practice" title="Details" />

                  <address className="mt-4 not-italic text-[13.5px] leading-[1.75] text-charcoal/70">
                    {practice.entity}
                    <br />
                    {practice.hospital}
                    <br />
                    {practice.addressLines[0]}
                    <br />
                    {practice.addressLines[1]}, {practice.city}
                  </address>

                  <RevealGroup className="mt-5 space-y-2.5" stagger={0.06}>
                    <RevealItem>
                      <a
                        href={practice.phoneHref}
                        className="group flex items-center gap-3 rounded-xl bg-white/70 p-3 transition-colors hover:bg-white"
                      >
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-forest text-white">
                          <Phone className="h-3.5 w-3.5" aria-hidden="true" />
                        </span>
                        <span>
                          <span className="block text-[9.5px] uppercase tracking-[0.14em] text-charcoal/40">
                            Telephone · primary
                          </span>
                          <span className="block text-[13.5px] font-medium text-charcoal">
                            {practice.phone}
                          </span>
                        </span>
                      </a>
                    </RevealItem>

                    <RevealItem>
                      <a
                        href={`mailto:${practice.email}`}
                        className="group flex items-center gap-3 rounded-xl bg-white/70 p-3 transition-colors hover:bg-white"
                      >
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-forest">
                          <Mail className="h-3.5 w-3.5" aria-hidden="true" />
                        </span>
                        <span className="min-w-0">
                          <span className="block text-[9.5px] uppercase tracking-[0.14em] text-charcoal/40">
                            Email
                          </span>
                          <span className="block break-all text-[12.5px] font-medium text-charcoal">
                            {practice.email}
                          </span>
                        </span>
                      </a>
                    </RevealItem>

                    <RevealItem>
                      <div className="flex items-start gap-3 rounded-xl border border-dashed border-charcoal/20 p-3">
                        <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-charcoal/15 text-charcoal/40">
                          <MessageCircle className="h-3.5 w-3.5" aria-hidden="true" />
                        </span>
                        <span>
                          <span className="block text-[9.5px] uppercase tracking-[0.14em] text-charcoal/40">
                            WhatsApp · awaiting confirmation
                          </span>
                          <span className="mt-0.5 block text-[11.5px] leading-snug text-charcoal/50">
                            A WhatsApp enquiry channel will appear here once the
                            practice confirms a WhatsApp-enabled number.
                          </span>
                        </span>
                      </div>
                    </RevealItem>
                  </RevealGroup>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <a
                      href={directionsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-[11px] font-medium text-forest"
                    >
                      <Navigation className="h-3 w-3" aria-hidden="true" />
                      Directions
                    </a>
                    <a
                      href={mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-[11px] font-medium text-forest"
                    >
                      <MapPin className="h-3 w-3" aria-hidden="true" />
                      Open in Maps
                    </a>
                  </div>

                  <p className="mt-4 rounded-lg bg-white/60 px-3 py-2 text-[10.5px] leading-relaxed text-charcoal/50">
                    Consulting hours, practice number and medical aid arrangements
                    are confirmed directly by the practice. Emergencies: contact{" "}
                    {practice.hospital} or your nearest emergency department.
                  </p>
                </div>
              </Reveal>

              <Reveal delay={0.1}>
                <div className="relative mt-4 aspect-[16/9] overflow-hidden rounded-[1.25rem] bg-sage">
                  <Image
                    src="/images/hospital-exterior.jpg"
                    alt="Life Roseacres Hospital entrance"
                    fill
                    sizes="(max-width: 1024px) 92vw, 42vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-forest-ink/60 via-transparent to-transparent" />
                  <div className="absolute inset-x-4 bottom-3">
                    <p className="text-[9.5px] uppercase tracking-[0.16em] text-white/60">
                      Consulting rooms
                    </p>
                    <p className="mt-0.5 text-[13px] font-medium text-white">
                      {practice.hospital}, Primrose
                    </p>
                  </div>
                </div>
              </Reveal>
            </div>

            {/* Form */}
            <Reveal y={24} delay={0.06}>
              <EnquiryForm />
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}

import { practiceToday, upcomingWeekdays } from "@/lib/appointment-dates";
import { enquiryDeliveryEnabled } from "@/lib/enquiry-config";
import { pageMetadata } from "@/lib/metadata";
import type { Metadata } from "next";
import { Mail, MapPin, MessageCircle, Navigation, Phone } from "lucide-react";
import { PageHero, SectionHead } from "@/components/page-hero";
import { Plate } from "@/components/ui/plate";
import { EnquiryForm } from "@/components/enquiry-form";
import { ParallaxImage, Reveal, RevealGroup, RevealItem } from "@/components/ui/motion";
import { practice } from "@/lib/practice";

export const metadata: Metadata = pageMetadata(
  "Contact & Appointment Enquiries",
  "Contact Dr CM Ngwey-Sompo Inc. at Life Roseacres Hospital, Primrose, Germiston. Telephone 011 842 7651 or send a non-clinical appointment enquiry. Consultations in English and French.",
  "/contact",
);

const directionsUrl =
  "https://www.google.com/maps/dir/?api=1&destination=Life+Roseacres+Hospital%2C+St+Joseph+and+Castor+Road%2C+Primrose%2C+Germiston";

const mapsUrl =
  "https://www.google.com/maps/search/?api=1&query=Life+Roseacres+Hospital%2C+St+Joseph+and+Castor+Road%2C+Primrose%2C+Germiston";

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ service?: string }>;
}) {
  const { service } = await searchParams;

  return (
    <>
      <PageHero
        tag="Contact"
        title="Let's arrange"
        muted="your visit."
        intro="Appointment enquiries are handled directly by the practice — telephone first, email for written requests, WhatsApp once the number is confirmed."
        image="/images/hospital-exterior.jpg"
        mobileImage="/images/corridor.jpg"
        alt="Life Roseacres Hospital entrance in Primrose, Germiston"
        aspect="aspect-[16/11] sm:aspect-[16/7] lg:aspect-[16/6]"
      />

      <section className="bg-white py-12 sm:py-16">
        <div className="shell">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-[0.95fr_1.05fr]">
            {/* Details */}
            <div className="min-w-0">
              <Reveal>
                <div className="rounded-[1.35rem] bg-mint p-6 ring-1 ring-forest/8 sm:p-7">
                  <SectionHead tag="Reach the practice" title="Details" />

                  <address className="mt-4 not-italic text-[13.5px] leading-[1.75] text-ink-soft">
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
                          <span className="block text-[9.5px] uppercase tracking-[0.14em] text-ink-soft">
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
                          <span className="block text-[9.5px] uppercase tracking-[0.14em] text-ink-soft">
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
                        <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-charcoal/15 text-ink-soft">
                          <MessageCircle className="h-3.5 w-3.5" aria-hidden="true" />
                        </span>
                        <span>
                          <span className="block text-[9.5px] uppercase tracking-[0.14em] text-ink-soft">
                            WhatsApp · awaiting confirmation
                          </span>
                          <span className="mt-0.5 block text-[11.5px] leading-snug text-ink-soft">
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

                  <p className="mt-4 rounded-lg bg-white/60 px-3 py-2 text-[10.5px] leading-relaxed text-ink-soft">
                    Consulting hours, practice number and medical aid arrangements
                    are confirmed directly by the practice. Emergencies: contact{" "}
                    {practice.hospital} or your nearest emergency department.
                  </p>
                </div>
              </Reveal>

              <Reveal delay={0.1}>
                <div className="group relative mt-4 aspect-[16/9] overflow-hidden rounded-[1.35rem] bg-sage">
                  <ParallaxImage
                    src="/images/hospital-exterior.jpg"
                    alt="Life Roseacres Hospital entrance"
                    strength={30}
                    sizes="(max-width: 1024px) 92vw, 42vw"
                    className="absolute inset-0"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-forest-ink/65 via-transparent to-transparent" />
                  <div className="absolute inset-x-4 bottom-3 flex items-end justify-between gap-3">
                    <div>
                      <p className="text-[9.5px] uppercase tracking-[0.16em] text-white/75">
                        Consulting rooms
                      </p>
                      <p className="mt-0.5 text-[13px] font-medium text-white">
                        {practice.hospital}, Primrose
                      </p>
                    </div>
                    <span className="rounded-full bg-white/95 px-3 py-1 text-[10.5px] font-medium text-charcoal backdrop-blur-md">
                      St Joseph &amp; Castor Rd
                    </span>
                  </div>
                </div>
              </Reveal>
            </div>

            {/* Form */}
            <div className="min-w-0">
              <Reveal y={24} delay={0.06}>
                <EnquiryForm defaultService={service ?? ""} days={upcomingWeekdays(practiceToday())} onlineEnabled={enquiryDeliveryEnabled()} />
              </Reveal>

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <Reveal y={18} delay={0.1}>
                  <Plate
                    image="/images/waiting-room.jpg"
                    alt="The practice waiting area"
                    index="01"
                    label="Before you arrive"
                    meta="Guide"
                    ratio="aspect-[4/3]"
                    body="Arrive a few minutes early — the rooms are quiet and unhurried."
                  />
                </Reveal>
                <Reveal y={18} delay={0.16}>
                  <Plate
                    image="/images/corridor.jpg"
                    alt="Corridor leading to the consulting rooms"
                    index="02"
                    label="Finding the rooms"
                    meta="Directions"
                    ratio="aspect-[4/3]"
                    body="Enter at the main hospital entrance and follow the signs to the consulting suites."
                  />
                </Reveal>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

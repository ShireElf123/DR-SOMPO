import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PageHero, SectionHead } from "@/components/page-hero";
import { PhotoCard } from "@/components/photo-card";
import { Reveal, RevealGroup, RevealItem, WordsIn } from "@/components/ui/motion";
import { serviceGroups } from "@/lib/practice";

export const metadata: Metadata = {
  title: "Services — Obstetrics, Gynaecology, Fertility & Surgery",
  description:
    "Antenatal care, delivery, gynaecological consultations, fertility assessment and minimally invasive surgery with Dr CM Ngwey-Sompo at Life Roseacres Hospital, Primrose, Germiston.",
  alternates: { canonical: "/services" },
};

const groupImages: Record<string, { image: string; alt: string }> = {
  obstetrics: {
    image: "/images/antenatal.jpg",
    alt: "Expectant mother resting in a sunlit consultation room",
  },
  gynaecology: {
    image: "/images/gynae.jpg",
    alt: "Calm still life of folded linens and eucalyptus in a consulting room",
  },
  fertility: {
    image: "/images/fertility.jpg",
    alt: "A couple's hands held together, representing fertility care",
  },
  surgery: {
    image: "/images/surgery.jpg",
    alt: "Laparoscopic equipment in a modern theatre suite",
  },
};

export default function ServicesPage() {
  return (
    <>
      <PageHero
        tag="Services"
        title="Obstetrics, gynaecology,"
        muted="fertility and surgery."
        intro="One practice, one standard of care — from a first consultation through pregnancy, surgery and long-term follow-up."
        image="/images/consultation.jpg"
        alt="Dr Somp in consultation with a patient"
      />

      {/* Quick index */}
      <section className="bg-white pt-10">
        <div className="shell">
          <div className="flex flex-wrap gap-2">
            {serviceGroups.map((group) => (
              <a
                key={group.id}
                href={`#${group.id}`}
                className="rounded-full border border-charcoal/12 px-3.5 py-1.5 text-[11.5px] font-medium text-charcoal/70 transition-colors hover:border-forest hover:text-forest"
              >
                {group.label}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Detail blocks */}
      <section className="bg-white py-12 sm:py-16">
        <div className="shell space-y-4">
          {serviceGroups.map((group, index) => {
            const meta = groupImages[group.id];
            const reversed = index % 2 === 1;

            return (
              <article
                key={group.id}
                id={group.id}
                className="scroll-mt-24 overflow-hidden rounded-[1.5rem] border border-charcoal/8 bg-white shadow-[0_24px_60px_-48px_rgba(0,0,0,0.35)]"
              >
                <div className="grid lg:grid-cols-[1.05fr_0.95fr]">
                  <div
                    className={`relative min-h-[15rem] lg:min-h-[22rem] ${
                      reversed ? "lg:order-2" : ""
                    }`}
                  >
                    <Image
                      src={meta.image}
                      alt={meta.alt}
                      fill
                      sizes="(max-width: 1024px) 92vw, 46vw"
                      className="object-cover"
                    />
                    <span className="absolute bottom-3 left-3 rounded-full bg-black/80 px-3.5 py-1 text-[10.5px] font-medium text-white backdrop-blur-sm">
                      {group.label}
                    </span>
                  </div>

                  <div className="p-6 sm:p-8 lg:p-10">
                    <h2 className="text-[clamp(1.4rem,2.6vw,1.95rem)] leading-[1.08]">
                      <WordsIn text={group.headline} stagger={0.03} />
                    </h2>
                    <p className="mt-3 max-w-md text-[13px] leading-relaxed text-charcoal/55">
                      {group.intro}
                    </p>

                    <RevealGroup className="mt-6 space-y-4" stagger={0.07}>
                      {group.services.map((service) => (
                        <RevealItem key={service.id}>
                          <div className="border-t border-charcoal/10 pt-3.5">
                            <p className="text-[13.5px] font-medium tracking-[-0.01em] text-forest">
                              {service.title}
                            </p>
                            <p className="mt-1 max-w-md text-[12px] leading-relaxed text-charcoal/50">
                              {service.summary}
                            </p>
                            <ul className="mt-2 flex flex-wrap gap-1.5">
                              {service.items.map((item) => (
                                <li
                                  key={item}
                                  className="rounded-full bg-ivory px-2.5 py-1 text-[10.5px] text-charcoal/60"
                                >
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </RevealItem>
                      ))}
                    </RevealGroup>

                    <Link href="/contact" className="btn mt-6">
                      Enquire about this
                      <i aria-hidden="true">
                        <ArrowUpRight className="h-3 w-3" />
                      </i>
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* What to expect */}
      <section className="sec sec-tint">
        <div className="shell">
          <SectionHead
            tag="What to expect"
            title="Prepared, explained,"
            muted="and on your terms."
            intro="Every consultation and procedure follows the same rhythm — you should always know what is happening and why."
          />

          <div className="mt-8 grid gap-3.5 sm:grid-cols-3">
            <PhotoCard
              image="/images/patient-quiet.jpg"
              alt="A patient sitting calmly in the clinic waiting area"
              label="Before"
              ratio="aspect-[4/3]"
              body="Bring your ID, medical aid card, a medication list and any prior results or referral letters."
            />
            <PhotoCard
              image="/images/consultation.jpg"
              alt="A consultation in progress"
              label="During"
              ratio="aspect-[4/3]"
              body="History, examination where needed, and a clear discussion of options — in English or French."
            />
            <PhotoCard
              image="/images/gynae.jpg"
              alt="Consulting room detail"
              label="After"
              ratio="aspect-[4/3]"
              body="A written plan, follow-up timing, and direct contact details if something changes."
            />
          </div>

          <Reveal delay={0.1}>
            <p className="mt-6 max-w-2xl text-[11px] leading-relaxed text-charcoal/40">
              All listed services and procedures are subject to confirmation
              against Dr Somp&apos;s current practice and hospital privileges.
              Nothing on this page is a guarantee of a clinical outcome, and
              fertility or surgical results are never promised.
            </p>
          </Reveal>
        </div>
      </section>
    </>
  );
}

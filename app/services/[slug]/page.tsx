import { BookingLink } from "@/components/booking-link";
import { siteUrl, faqJsonLd } from "@/lib/structured-data";
import { pageMetadata } from "@/lib/metadata";
import type { Metadata } from "next";
import Image from "@/components/ui/practice-image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, ChevronRight, Phone } from "lucide-react";
import { PageHero, SectionHead } from "@/components/page-hero";
import { Reveal, RevealGroup, RevealItem, WordsIn } from "@/components/ui/motion";
import {
  allServiceMap,
  allServices,
  practice,
  serviceDetailMap,
  serviceDetails,
} from "@/lib/practice";

type Params = { params: Promise<{ slug: string }> };

// Only published services exist; unknown and inherited object-property names are 404s.
export const dynamicParams = false;

export function generateStaticParams() {
  return serviceDetails.map((detail) => ({ slug: detail.serviceId }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const service = allServiceMap[slug];
  const detail = serviceDetailMap[slug];
  if (!service || !detail) return {};

  return pageMetadata(`${service.title} — ${detail.eyebrow} in Germiston`, detail.standfirst.slice(0, 158), `/services/${slug}`);
}

const phases = [
  { key: "beforeVisit", label: "Before your visit", tone: "mint" },
  { key: "atVisit", label: "At the appointment", tone: "sage" },
  { key: "afterVisit", label: "Afterwards", tone: "ivory" },
] as const;

export default async function ServiceDetailPage({ params }: Params) {
  const { slug } = await params;
  const service = allServiceMap[slug];
  const detail = serviceDetailMap[slug];

  if (!service || !detail) notFound();

  const parentGroup = service.groupId;
  const related = detail.related
    .map((id) => ({ service: allServiceMap[id], detail: serviceDetailMap[id] }))
    .filter((item) => item.service && item.detail);

  // Describe the page without inventing a clinical procedure classification.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${siteUrl}/services/${slug}#page`,
    url: `${siteUrl}/services/${slug}`,
    name: service.title,
    description: detail.standfirst,
    about: { "@type": "Thing", name: service.title },
    publisher: { "@id": `${siteUrl}/#practice` },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(detail.questions)) }} />

      <PageHero
        tag={detail.eyebrow}
        title={service.title}
        intro={detail.standfirst}
        image={detail.image}
        alt={detail.imageAlt}
        aspect="aspect-[16/11] sm:aspect-[16/8] lg:aspect-[16/6]"
      >
        <nav aria-label="Breadcrumb" className="mt-4">
          <ol className="flex flex-wrap items-center gap-1.5 text-[10.5px] text-white/75">
            <li>
              <Link href="/services" className="hover:text-white">
                Services
              </Link>
            </li>
            <ChevronRight className="h-2.5 w-2.5" aria-hidden="true" />
            <li>
              <Link href={`/services#${parentGroup}`} className="hover:text-white">
                {service.groupLabel}
              </Link>
            </li>
            <ChevronRight className="h-2.5 w-2.5" aria-hidden="true" />
            <li aria-current="page" className="text-white">
              {service.title}
            </li>
          </ol>
        </nav>
      </PageHero>

      {/* Agenda — a sticky contents rail beside the long-form copy. This is the
          structure Framer template service pages use, and it is what makes a
          page read as a reference document rather than marketing. */}
      <section className="bg-white py-12 sm:py-16">
        <div className="shell">
          <div className="grid gap-10 lg:grid-cols-[0.32fr_0.68fr] lg:gap-14">
            <aside className="lg:sticky lg:top-28 lg:self-start">
              <p className="text-[10px] uppercase tracking-[0.18em] text-ink-muted">
                On this page
              </p>
              <ul className="mt-3 space-y-2 border-l-hairline border-charcoal/12 pl-4">
                {detail.sections.map((section, i) => (
                  <li key={section.heading}>
                    <a
                      href={`#section-${i}`}
                      className="group flex items-start gap-2 text-[12.5px] leading-snug text-ink-soft transition-colors hover:text-forest"
                    >
                      <span className="mt-[3px] text-[9.5px] tabular-nums text-ink-muted">
                        0{i + 1}
                      </span>
                      <span>{section.heading}</span>
                    </a>
                  </li>
                ))}
              </ul>

              <div className="mt-6 rounded-[1.25rem] bg-mint p-4">
                <p className="text-[11px] font-medium text-forest">Ready to book?</p>
                <p className="mt-1 text-[11px] leading-relaxed text-ink-soft">
                  Appointments are arranged by telephone.
                </p>
                <a href={practice.phoneHref} className="btn btn-forest mt-3 w-full justify-between">
                  {practice.phone}
                  <i aria-hidden="true">
                    <Phone className="h-3 w-3" />
                  </i>
                </a>
                <BookingLink
                  service={service.id}
                  className="mt-2 flex items-center justify-between rounded-full border border-forest/20 px-3.5 py-2 text-[11px] font-medium text-forest transition-colors hover:border-forest hover:bg-white"
                >
                  Request this appointment
                  <ArrowUpRight className="h-3 w-3" />
                </BookingLink>
              </div>

              {detail.verifiedNotes && (
                <p className="mt-4 border-l-2 border-gold pl-3 text-[10.5px] leading-relaxed text-ink-muted">
                  <span className="font-medium text-charcoal">To confirm:</span>{" "}
                  {detail.verifiedNotes}
                </p>
              )}
            </aside>

            <div>
              {detail.sections.map((section, i) => (
                <article
                  key={section.heading}
                  id={`section-${i}`}
                  className="scroll-mt-28 border-t-hairline border-charcoal/10 py-7 first:border-0 first:pt-0"
                >
                  <div className="flex items-baseline gap-3">
                    <span className="text-[10px] tabular-nums text-ink-muted">0{i + 1}</span>
                    <h2 className="text-[clamp(1.3rem,2.4vw,1.75rem)] leading-[1.1]">
                      <WordsIn text={section.heading} />
                    </h2>
                  </div>
                  <div className="mt-3 space-y-3 pl-6">
                    {section.body.map((paragraph) => (
                      <p key={paragraph.slice(0, 24)} className="text-[13.5px] leading-[1.7] text-ink-soft">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </article>
              ))}

              {/* Three-phase checklist */}
              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                {phases.map((phase, i) => {
                  const items = detail[phase.key];
                  return (
                    <Reveal key={phase.key} delay={i * 0.07} y={18}>
                      <div
                        className={`h-full rounded-[1.25rem] p-4 ${
                          phase.tone === "mint"
                            ? "bg-mint"
                            : phase.tone === "sage"
                              ? "bg-sage"
                              : "bg-ivory border-hairline border-charcoal/8"
                        }`}
                      >
                        <p className="text-[9.5px] uppercase tracking-[0.16em] text-ink-muted">
                          {phase.label}
                        </p>
                        <ul className="mt-2.5 space-y-2">
                          {items.map((item) => (
                            <li
                              key={item.slice(0, 20)}
                              className="flex gap-2 text-[11.5px] leading-relaxed text-ink-soft"
                            >
                              <span
                                aria-hidden="true"
                                className="mt-[6px] h-1 w-1 shrink-0 rounded-full bg-forest/50"
                              />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </Reveal>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Questions */}
      <section className="sec sec-tint">
        <div className="shell">
          <div className="grid gap-8 lg:grid-cols-[0.35fr_0.65fr] lg:gap-14">
            <SectionHead
              tag="Questions"
              title="What patients"
              muted="ask about this."
              intro="Answered plainly. If your question is not here, ask it at the appointment — it is not an imposition."
            />
            <dl className="border-t-hairline border-charcoal/12">
              {detail.questions.map((item, i) => (
                <Reveal key={item.q} delay={i * 0.05} y={14} className="border-b-hairline border-charcoal/12 py-4">
                    <dt className="text-[14px] font-medium tracking-[-0.01em] text-charcoal">
                      {item.q}
                    </dt>
                    <dd className="mt-1.5 max-w-[38rem] text-[12.5px] leading-relaxed text-ink-soft">
                      {item.a}
                    </dd>
                </Reveal>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* Related services */}
      {related.length > 0 && (
        <section className="sec">
          <div className="shell">
            <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
              <SectionHead tag="Related" title="Often discussed" muted="together." />
              <Link href="/services" className="btn btn-ghost">
                All services
                <i aria-hidden="true">
                  <ArrowUpRight className="h-3 w-3" />
                </i>
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {related.map(({ service: relService, detail: relDetail }, i) => (
                <Reveal key={relService.id} delay={i * 0.07} y={20}>
                  <Link
                    href={`/services/${relService.id}`}
                    data-cursor="Open"
                    className="group flex h-full flex-col overflow-hidden rounded-[1.35rem] bg-white border-hairline border-charcoal/8 hover:shadow-lift"
                  >
                    <div className="relative aspect-[16/9] overflow-hidden bg-sage">
                      <Image
                        src={relDetail.image}
                        alt={relDetail.imageAlt}
                        fill
                        sizes="(max-width: 640px) 92vw, 46vw"
                        className="object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-forest-ink/55 via-transparent to-transparent" />
                      <span className="absolute left-3 top-3 rounded-full bg-white/92 px-2.5 py-1 text-[10px] font-medium text-forest backdrop-blur-md">
                        {relDetail.eyebrow}
                      </span>
                    </div>
                    <div className="flex flex-1 flex-col p-5">
                      <h3 className="text-[15px] font-medium leading-snug tracking-[-0.015em] text-charcoal">
                        {relService.title}
                      </h3>
                      <p className="mt-2 flex-1 text-[12px] leading-relaxed text-ink-soft">
                        {relDetail.standfirst.slice(0, 130)}…
                      </p>
                      <span className="mt-4 inline-flex items-center gap-1.5 text-[11px] font-medium text-forest">
                        Read more
                        <ArrowUpRight className="h-3 w-3 transition-transform duration-500 group-hover:rotate-45" />
                      </span>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Every other service, so no page is a dead end */}
      <section className="bg-white pb-16 pt-4">
        <div className="shell">
          <p className="text-[10px] uppercase tracking-[0.18em] text-ink-muted">
            All services
          </p>
          <RevealGroup className="mt-3 flex flex-wrap gap-1.5" stagger={0.04}>
            {allServices
              .filter((item) => item.id !== service.id)
              .map((item) => (
                <RevealItem key={item.id}>
                  <Link
                    href={`/services/${item.id}`}
                    className="inline-flex items-center gap-1.5 rounded-full border border-charcoal/12 px-3 py-1.5 text-[11px] text-ink-soft transition-colors hover:border-forest hover:text-forest"
                  >
                    {item.title}
                  </Link>
                </RevealItem>
              ))}
          </RevealGroup>
        </div>
      </section>
    </>
  );
}

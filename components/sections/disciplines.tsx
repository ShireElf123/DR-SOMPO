"use client";

import { ArrowUpRight } from "lucide-react";
import { Reveal, WordsIn } from "@/components/ui/motion";

const obstetrics = [
  "Antenatal care",
  "Pregnancy monitoring and assessment",
  "Vaginal delivery",
  "Caesarean delivery",
  "Maternal care throughout pregnancy",
];

const gynaecology = [
  "General gynaecological consultations",
  "Contraception",
  "Menstrual and reproductive health",
  "Female health screening",
  "Oncology assessment",
];

const surgery = [
  "Ovarian and other gynaecological cysts",
  "Fibroids",
  "Early-stage endometriosis",
  "Hysterectomy",
  "Total laparoscopic hysterectomy",
];

/**
 * Disciplines — asymmetric two-column cards that slide in from opposite sides.
 * The first card flips to forest on hover; the second carries a top-lit
 * gradient and a caption plate, the reference's two signature card states.
 */
export function Disciplines() {
  return (
    <section className="sec" aria-labelledby="disciplines-heading">
      <div className="shell">
        <div className="mb-10 max-w-2xl">
          <span className="tag">Services</span>
          <h2
            id="disciplines-heading"
            className="text-[clamp(1.85rem,3.8vw,2.75rem)] leading-[1.04]"
          >
            <WordsIn text="Specialist care, from first consultation" />{" "}
            <span className="text-charcoal/35">
              <WordsIn text="through surgery and follow-up." delay={0.25} />
            </span>
          </h2>
        </div>

        <div className="grid gap-3.5 lg:grid-cols-2">
          <Reveal x={-40} y={16}>
            <article className="group flex h-full flex-col justify-between rounded-[1.25rem] border border-charcoal/8 bg-mint p-6 transition-colors duration-500 hover:border-0 hover:bg-forest hover:text-white sm:p-8">
              <div>
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-charcoal/12 bg-white text-[15px] text-forest transition-colors duration-500 group-hover:border-white/20 group-hover:bg-white/10 group-hover:text-white">
                  ✚
                </span>
                <h3 className="mt-5 text-[1.25rem] font-normal tracking-[-0.02em]">
                  Obstetrics
                </h3>
                <p className="mt-2 max-w-sm text-[13px] leading-relaxed text-charcoal/55 transition-colors duration-500 group-hover:text-white/70">
                  Care through pregnancy, birth and the weeks that follow, planned
                  around your history and your preferences.
                </p>
              </div>
              <ul className="mt-6 space-y-1.5">
                {obstetrics.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2 text-[12.5px] leading-snug text-charcoal/60 transition-colors duration-500 group-hover:text-white/75"
                  >
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-forest/40 transition-colors group-hover:bg-lime" />
                    {item}
                  </li>
                ))}
              </ul>
              <a
                href="#contact"
                className="mt-7 inline-flex items-center gap-2 text-[12.5px] font-medium"
              >
                Enquire about obstetric care
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-forest text-white transition-transform duration-500 group-hover:rotate-45 group-hover:bg-white group-hover:text-forest">
                  <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
                </span>
              </a>
            </article>
          </Reveal>

          <Reveal x={40} y={16} delay={0.08}>
            <article className="relative flex h-full min-h-[19rem] flex-col justify-between overflow-hidden rounded-[1.25rem] bg-[linear-gradient(160deg,#d9a98c,#e9c8b6_45%,#a9bfa0)] p-6 text-white transition-colors duration-700 hover:bg-[#cfdcd2] hover:text-charcoal sm:p-8">
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_15%_17%_at_50%_37%,rgba(255,255,255,.5)_97%,transparent_100%),radial-gradient(ellipse_5%_8%_at_50%_53%,rgba(255,255,255,.45)_97%,transparent_100%),radial-gradient(ellipse_21%_25%_at_50%_38%,rgba(255,255,255,.2)_97%,transparent_100%),radial-gradient(ellipse_52%_32%_at_50%_104%,rgba(255,255,255,.45)_97%,transparent_100%)]"
              />
              <div className="relative">
                <h3 className="text-[1.25rem] font-normal tracking-[-0.02em]">Gynaecology</h3>
                <p className="mt-2 max-w-xs text-[13px] leading-relaxed opacity-90">
                  Consultations, contraception, screening and menstrual health —
                  handled with discretion and dignity.
                </p>
              </div>
              <ul className="relative mt-6 grid gap-1.5">
                {gynaecology.slice(0, 4).map((item) => (
                  <li key={item} className="flex items-start gap-2 text-[12.5px] leading-snug opacity-85">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-white/70" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="relative mt-6 rounded-lg bg-white p-3 text-[11.5px] leading-snug text-charcoal">
                From a first consultation to long-term follow-up — the same
                specialist, the same standard of care.
              </div>
            </article>
          </Reveal>
        </div>

        <div className="mt-3.5 grid gap-3.5 lg:grid-cols-2">
          <Reveal y={18}>
            <article className="flex h-full flex-col rounded-[1.25rem] border border-charcoal/8 bg-ivory p-6 sm:p-8">
              <div className="flex items-start justify-between gap-4">
                <h3 className="text-[1.25rem] font-normal tracking-[-0.02em]">
                  Minimally invasive &amp; open surgery
                </h3>
                <span className="mt-1 h-10 w-10 shrink-0 rounded-[0_80%_0_80%] bg-forest/8" aria-hidden="true" />
              </div>
              <p className="mt-2 max-w-sm text-[13px] leading-relaxed text-charcoal/55">
                Procedures discussed in full beforehand — what is involved, what
                recovery looks like, and what the alternatives are.
              </p>
              <ul className="mt-5 grid gap-1.5 sm:grid-cols-2">
                {surgery.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2 text-[12.5px] leading-snug text-charcoal/60"
                  >
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-forest/40" />
                    {item}
                  </li>
                ))}
              </ul>
            </article>
          </Reveal>

          <Reveal y={18} delay={0.08}>
            <article className="flex h-full flex-col justify-between rounded-[1.25rem] border border-charcoal/8 bg-white p-6 sm:p-8">
              <div>
                <h3 className="text-[1.25rem] font-normal tracking-[-0.02em]">
                  From consult to care
                </h3>
                <p className="mt-2 max-w-sm text-[13px] leading-relaxed text-charcoal/55">
                  Every plan starts with listening, then a clear assessment,
                  honest expectations and follow-up that fits your life.
                </p>
              </div>
              <div className="mt-6 flex items-center gap-3">
                <div className="flex -space-x-2">
                  {["/images/patient-quiet.jpg", "/images/consultation.jpg", "/images/antenatal.jpg"].map(
                    (src) => (
                      <span
                        key={src}
                        className="relative h-8 w-8 overflow-hidden rounded-full ring-2 ring-white"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={src} alt="" className="h-full w-full object-cover" />
                      </span>
                    ),
                  )}
                </div>
                <p className="text-[11.5px] leading-snug text-charcoal/50">
                  Consultations in English and French
                </p>
              </div>
            </article>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

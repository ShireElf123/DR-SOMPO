"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight, HeartPulse, Phone, ShieldCheck } from "lucide-react";
import Image from "next/image";
import { useRef } from "react";
import { brand, practice } from "@/lib/practice";
import { FadeUp, WordsIn } from "@/components/ui/motion";
import { cn } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;

export function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "9%"]);
  const floatY = useTransform(scrollYProgress, [0, 1], [0, -48]);
  const glowY = useTransform(scrollYProgress, [0, 1], [0, 60]);

  return (
    <section
      id="top"
      ref={ref}
      className="relative overflow-hidden bg-ivory pt-10 pb-6 sm:pt-14"
      aria-labelledby="hero-heading"
    >
      {/* Soft botanical wash behind the composition */}
      <motion.div
        aria-hidden="true"
        style={reduce ? undefined : { y: glowY }}
        className="pointer-events-none absolute -left-40 -top-32 h-[34rem] w-[34rem] rounded-full bg-[radial-gradient(circle_at_center,rgba(220,235,225,0.95),rgba(234,244,238,0)_68%)] blur-2xl"
      />
      <motion.div
        aria-hidden="true"
        style={reduce ? undefined : { y: glowY }}
        className="pointer-events-none absolute -right-32 top-24 h-[30rem] w-[30rem] rounded-full bg-[radial-gradient(circle_at_center,rgba(214,198,162,0.4),rgba(248,247,242,0)_70%)] blur-2xl"
      />

      <div className="shell relative">
        <div className="grid items-end gap-10 lg:grid-cols-[1.06fr_0.94fr] lg:gap-6">
          {/* ---------------------------------------------------------------- */}
          {/* Copy column                                                      */}
          {/* ---------------------------------------------------------------- */}
          <div className="relative z-10 pb-2 lg:pb-16">
            <FadeUp delay={0.05}>
              <span className="eyebrow">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-forest/40 motion-reduce:hidden" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-forest" />
                </span>
                Specialist Obstetrician &amp; Gynaecologist
              </span>
            </FadeUp>

            <h1
              id="hero-heading"
              className="display mt-6 text-[clamp(2.6rem,6.4vw,4.6rem)] text-forest"
            >
              <WordsIn text="Women's Health." delay={0.15} />
              <br />
              <span className="text-forest/95">
                <WordsIn text="Every Stage." delay={0.3} />{" "}
              </span>
              <span className="serif-accent text-forest">
                <WordsIn text="Every Journey." delay={0.42} />
              </span>
            </h1>

            <FadeUp delay={0.55}>
              <p className="mt-6 max-w-[34rem] text-[0.975rem] leading-relaxed text-charcoal/72 sm:text-base">
                {brand.heroCopy}
              </p>
            </FadeUp>

            <FadeUp delay={0.68}>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <a className="btn btn-primary group" href="#contact">
                  Book an Appointment
                  <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
                <a className="btn btn-ghost group" href="#about">
                  Meet Dr Somp
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-forest/10 transition-colors duration-300 group-hover:bg-forest/15">
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </span>
                </a>
              </div>
            </FadeUp>

            {/* Trust row — facts only, no invented statistics */}
            <FadeUp delay={0.8}>
              <dl className="mt-10 grid max-w-lg grid-cols-3 gap-4 border-t border-forest/10 pt-6">
                <div>
                  <dt className="text-[0.625rem] font-medium uppercase tracking-[0.14em] text-forest/60">
                    Practising at
                  </dt>
                  <dd className="mt-1.5 text-[0.8125rem] font-medium leading-snug text-forest">
                    Life Roseacres Hospital
                  </dd>
                </div>
                <div>
                  <dt className="text-[0.625rem] font-medium uppercase tracking-[0.14em] text-forest/60">
                    Consultations
                  </dt>
                  <dd className="mt-1.5 text-[0.8125rem] font-medium leading-snug text-forest">
                    English &amp; French
                  </dd>
                </div>
                <div>
                  <dt className="text-[0.625rem] font-medium uppercase tracking-[0.14em] text-forest/60">
                    Focus areas
                  </dt>
                  <dd className="mt-1.5 text-[0.8125rem] font-medium leading-snug text-forest">
                    Fertility &amp; cervical health
                  </dd>
                </div>
              </dl>
            </FadeUp>
          </div>

          {/* ---------------------------------------------------------------- */}
          {/* Portrait composition                                             */}
          {/* ---------------------------------------------------------------- */}
          <div className="relative pb-4 lg:pb-0">
            <motion.div
              initial={reduce ? undefined : { opacity: 0, scale: 0.97, y: 26 }}
              animate={reduce ? undefined : { opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 1.25, ease: EASE, delay: 0.1 }}
              className="relative ml-auto aspect-[4/5] w-full max-w-[34rem] overflow-hidden rounded-[2rem] bg-sage shadow-[0_40px_90px_-50px_rgba(23,77,60,0.6)] sm:rounded-[2.5rem] lg:aspect-[4/4.7]"
            >
              <motion.div
                style={reduce ? undefined : { y: imageY }}
                className="absolute inset-[-6%_0]"
              >
                <Image
                  src="/images/hero-doctor.jpg"
                  alt="Dr CM Ngwey-Sompo, specialist obstetrician and gynaecologist, photographed in her consulting rooms"
                  fill
                  priority
                  sizes="(max-width: 1024px) 92vw, 44vw"
                  className="object-cover object-[center_22%]"
                />
              </motion.div>
              <div className="absolute inset-0 bg-gradient-to-t from-forest-ink/35 via-transparent to-transparent" />

              {/* Overlay chip: qualifications */}
              <div className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-3 sm:inset-x-5 sm:bottom-5">
                <div className="rounded-2xl border border-white/25 bg-white/12 px-4 py-3 backdrop-blur-md">
                  <p className="text-[0.625rem] font-medium uppercase tracking-[0.16em] text-ivory/70">
                    Qualifications
                  </p>
                  <p className="mt-1 text-[0.8125rem] font-medium text-ivory">
                    MBChB · FCOG (SA) · MMed (O&amp;G)
                  </p>
                </div>
                <div className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/25 bg-white/12 backdrop-blur-md sm:flex">
                  <ShieldCheck className="h-5 w-5 text-ivory" aria-hidden="true" />
                </div>
              </div>
            </motion.div>

            {/* Floating information cards — the signature Framer detail */}
            <motion.div
              style={reduce ? undefined : { y: floatY }}
              className="absolute left-2 top-6 z-20 sm:left-3 lg:-top-4 lg:left-6"
            >
              <motion.div
                initial={reduce ? undefined : { opacity: 0, x: -18 }}
                animate={reduce ? undefined : { opacity: 1, x: 0 }}
                transition={{ duration: 0.9, delay: 0.7, ease: EASE }}
                className="flex items-center gap-3 rounded-2xl border border-white/70 bg-white/85 p-2.5 pr-4 shadow-[0_18px_40px_-22px_rgba(23,77,60,0.55)] backdrop-blur-xl"
              >
                <Image
                  src="/images/consultation.jpg"
                  alt=""
                  width={88}
                  height={88}
                  className="h-11 w-11 rounded-xl object-cover"
                />
                <div>
                  <p className="flex items-center gap-1 text-[0.6875rem] font-semibold text-forest">
                    <HeartPulse className="h-3 w-3 text-forest/70" aria-hidden="true" />
                    Patient-centred care
                  </p>
                  <p className="mt-0.5 max-w-[8.5rem] text-[0.625rem] leading-snug text-charcoal/66">
                    Unhurried consultations, in English or French
                  </p>
                </div>
              </motion.div>
            </motion.div>

            <motion.div
              initial={reduce ? undefined : { opacity: 0, y: 18 }}
              animate={reduce ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.9, ease: EASE }}
              className="absolute -bottom-5 right-3 z-20 sm:right-5 lg:-bottom-6 lg:right-6"
            >
              <a
                href={practice.phoneHref}
                className={cn(
                  "group flex items-center gap-3 rounded-2xl bg-forest px-4 py-3",
                  "shadow-[0_22px_50px_-24px_rgba(23,77,60,0.9)] transition-transform duration-500 hover:-translate-y-1",
                )}
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-ivory/12">
                  <Phone className="h-4 w-4 text-ivory" aria-hidden="true" />
                </span>
                <span>
                  <span className="block text-[0.5625rem] font-medium uppercase tracking-[0.18em] text-sage/68">
                    Appointments
                  </span>
                  <span className="block text-[0.875rem] font-medium tracking-tight text-ivory">
                    {practice.phone}
                  </span>
                </span>
              </a>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

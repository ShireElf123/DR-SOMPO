"use client";

import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight, Phone } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { practice } from "@/lib/practice";
import { WordsIn } from "@/components/ui/motion";

const EASE = [0.16, 1, 0.3, 1] as const;

const rotating = [
  "Specialist OBGYN",
  "Fertility & cervical health",
  "Obstetrics · Gynaecology",
  "English & French",
];

/**
 * Full-bleed gradient hero: layered botanical wash, a light-weight headline
 * that reveals word by word, a photo panel that grows out of the page on load,
 * floating glass pills and a contact chip. This is the composition the
 * reference opens with.
 */
export function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const [pill, setPill] = useState(0);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const copyY = useTransform(scrollYProgress, [0, 1], [0, -90]);
  const chipY = useTransform(scrollYProgress, [0, 1], [0, 40]);
  const imageY = useTransform(scrollYProgress, [0, 1], [0, 60]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.06]);

  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => setPill((p) => (p + 1) % rotating.length), 3200);
    return () => clearInterval(id);
  }, [reduce]);

  return (
    <section id="top" ref={ref} className="relative px-3 pt-3 sm:px-4 sm:pt-4">
      <div className="relative mx-auto w-full max-w-[1180px]">
        <motion.div
          initial={reduce ? undefined : { opacity: 0, scale: 0.965, y: 28 }}
          animate={reduce ? undefined : { opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1.4, ease: EASE, delay: 0.15 }}
          className="fig-gradient relative overflow-hidden rounded-[1.4rem] sm:rounded-[1.75rem]"
        >
          {/* Botanical light shapes */}
          <span
            aria-hidden="true"
            className="absolute right-[42%] top-[6%] h-32 w-32 rounded-[0_85%_0_85%] bg-white/15 motion-safe:animate-[sway_9s_ease-in-out_infinite_alternate]"
          />
          <span
            aria-hidden="true"
            className="absolute right-[6%] top-[20%] h-20 w-20 rounded-[0_85%_0_85%] bg-white/15 motion-safe:animate-[sway_9s_ease-in-out_infinite_alternate_-4s]"
          />
          <div
            aria-hidden="true"
            className="noise-soft pointer-events-none absolute inset-0 opacity-40"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_70%_35%,rgba(255,255,255,0.3),transparent_45%)]"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-forest/35 to-transparent"
          />

          {/* Portrait — full-bleed behind the copy on phones, a clipped panel from
              sm up. Photography is always visible, never a hover reveal. */}
          <div className="pointer-events-none absolute inset-0 sm:hidden">
            <Image
              src="/images/hero-doctor.jpg"
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover object-[62%_18%]"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,42,32,0.62)_0%,rgba(10,42,32,0.35)_45%,rgba(10,42,32,0.78)_100%)]" />
          </div>

          <div className="pointer-events-none absolute bottom-0 right-0 hidden h-[88%] w-[52%] sm:block lg:w-[46%]">
            <motion.div
              style={reduce ? undefined : { y: imageY, scale: imageScale }}
              className="relative h-full w-full"
            >
              <div className="relative h-full w-full overflow-hidden rounded-tl-[9rem]">
                <Image
                  src="/images/hero-doctor.jpg"
                  alt="Dr CM Ngwey-Sompo, specialist obstetrician and gynaecologist"
                  fill
                  priority
                  sizes="(max-width: 1024px) 54vw, 46vw"
                  className="object-cover object-[center_16%]"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-mist/40 via-transparent to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-forest/45 via-transparent to-transparent" />
              </div>
            </motion.div>
          </div>

          {/* Copy */}
          <motion.div
            style={reduce ? undefined : { y: copyY }}
            className="relative z-10 max-w-[42rem] px-6 pb-14 pt-16 text-white sm:px-10 sm:pb-20 sm:pt-20 lg:px-14 lg:pb-24 lg:pt-24"
          >
            <motion.span
              initial={reduce ? undefined : { opacity: 0, y: 12 }}
              animate={reduce ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6, ease: EASE }}
              className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/35 bg-white/15 px-4 py-1.5 text-[11px] font-medium tracking-wide backdrop-blur-md"
            >
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-lime/70 motion-reduce:hidden" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-lime" />
              </span>
              Consulting at Life Roseacres Hospital
            </motion.span>

            <h1 className="text-[clamp(2.6rem,7.4vw,5.9rem)] font-light leading-[0.98] tracking-[-0.035em]">
              <WordsIn text="Women's Health." delay={0.5} stagger={0.07} />
              <br />
              <WordsIn text="Every Stage." delay={0.72} stagger={0.07} gray />
              <br />
              <WordsIn text="Every Journey." delay={0.94} stagger={0.07} />
            </h1>

            <motion.p
              initial={reduce ? undefined : { opacity: 0, y: 14 }}
              animate={reduce ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 1.3, ease: EASE }}
              className="mt-6 max-w-[26rem] text-[0.875rem] leading-relaxed text-white/90 sm:text-[0.9375rem]"
            >
              Your health deserves specialist attention and compassionate care,
              from adolescence through pregnancy, childbirth, menopause and beyond.
            </motion.p>

            <motion.div
              initial={reduce ? undefined : { opacity: 0 }}
              animate={reduce ? undefined : { opacity: 1 }}
              transition={{ duration: 1.1, delay: 1.5 }}
              className="mt-7 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[10px] uppercase tracking-[0.16em] text-white/85"
            >
              {["MBChB", "FCOG (SA)", "MMed (O&G) Wits"].map((item, i) => (
                <span key={item} className="flex items-center gap-3">
                  {i > 0 && <span className="h-3 w-px bg-white/35" aria-hidden="true" />}
                  {item}
                </span>
              ))}
            </motion.div>

            <motion.div
              initial={reduce ? undefined : { opacity: 0, y: 14 }}
              animate={reduce ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 1.6, ease: EASE }}
              className="mt-6 flex flex-wrap items-center gap-2.5"
            >
              <a href="/contact" className="btn btn-light" data-cursor="Book">
                Book an appointment
                <i aria-hidden="true">
                  <ArrowUpRight className="h-3 w-3" />
                </i>
              </a>
              <a href="/about" className="btn btn-glass">
                Meet Dr Somp
                <i aria-hidden="true">
                  <ArrowUpRight className="h-3 w-3" />
                </i>
              </a>
            </motion.div>
          </motion.div>

          {/* Scroll cue */}
          <motion.span
            aria-hidden="true"
            initial={reduce ? undefined : { opacity: 0 }}
            animate={reduce ? undefined : { opacity: 1 }}
            transition={{ duration: 1, delay: 2.1 }}
            className="absolute bottom-6 left-6 z-20 hidden items-center gap-2 text-[9.5px] uppercase tracking-[0.18em] text-white/80 lg:flex"
          >
            <span className="relative block h-8 w-px overflow-hidden bg-white/25">
              <motion.span
                className="absolute inset-x-0 top-0 block h-3 bg-white"
                animate={reduce ? undefined : { y: ["-100%", "260%"] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
              />
            </span>
            Scroll
          </motion.span>

          {/* Rotating glass pill */}
          <span className="pointer-events-none absolute right-[27%] top-8 z-20 hidden rounded-full bg-white/70 px-4 py-2 text-[11px] font-medium text-charcoal backdrop-blur-md lg:block">
            <AnimatePresence mode="wait">
              <motion.span
                key={pill}
                initial={reduce ? undefined : { opacity: 0, y: 8 }}
                animate={reduce ? undefined : { opacity: 1, y: 0 }}
                exit={reduce ? undefined : { opacity: 0, y: -8 }}
                transition={{ duration: 0.45 }}
                className="block"
              >
                {rotating[pill]}
              </motion.span>
            </AnimatePresence>
          </span>

          {/* Contact chip */}
          <motion.a
            href={practice.phoneHref}
            style={reduce ? undefined : { y: chipY }}
            initial={reduce ? undefined : { opacity: 0, y: 18 }}
            animate={reduce ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 1.9, ease: EASE }}
            className="group absolute bottom-4 right-4 z-20 flex items-center gap-2.5 rounded-2xl bg-white/92 p-2 pr-4 text-charcoal shadow-[0_18px_40px_-22px_rgba(0,0,0,0.45)] backdrop-blur-md transition-transform duration-500 hover:-translate-y-1 sm:bottom-6 sm:right-6"
          >
            <span className="relative h-11 w-11 overflow-hidden rounded-xl bg-mist">
              <Image
                src="/images/consultation.jpg"
                alt=""
                fill
                sizes="44px"
                className="object-cover"
              />
            </span>
            <span className="text-[11px] leading-tight">
              <span className="block font-medium">Specialist OBGYN</span>
              <span className="mt-0.5 block text-[#8b918e]">{practice.phone}</span>
            </span>
            <Phone className="h-3.5 w-3.5 text-forest/60" aria-hidden="true" />
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}

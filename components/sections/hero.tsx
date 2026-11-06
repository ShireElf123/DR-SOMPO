"use client";

import { m, useInView, useMotionValue, useMotionValueEvent, useScroll, type MotionValue } from "framer-motion";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { ArrowUpRight, Phone } from "lucide-react";
import Image from "@/components/ui/practice-image";
import { useEffect, useRef, useState, type RefObject } from "react";
import { brand, practice } from "@/lib/practice";
import { useDesktopMotion } from "@/lib/use-desktop-motion";

const rotating = [
  "Women's health advocate",
  "Fertility & cervical health",
  "Adolescence to menopause",
  "English & French",
];

/** The frame never moves on entry. CSS owns the 1.4s arrival, including the
 * pre-hydration/reduced-motion states; controls are always painted and usable. */
export function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const [pill, setPill] = useState(0);

  const inView = useInView(ref, { initial: true });
  const desktopMotion = useDesktopMotion();
  const active = inView && !reduce;
  const parallax = active && desktopMotion;
  const copyY = useMotionValue(0);
  const chipY = useMotionValue(0);
  const imageY = useMotionValue(0);
  const imageScale = useMotionValue(1);

  useEffect(() => {
    if (!active || !desktopMotion) return;
    const id = setInterval(() => setPill((p) => (p + 1) % rotating.length), 3200);
    return () => clearInterval(id);
  }, [active, desktopMotion]);

  return (
    <section
      id="top"
      ref={ref}
      data-hero-active={active}
      className="relative px-3 pt-3 sm:px-4 sm:pt-4"
    >
      {parallax && (
        <HeroParallax target={ref} copyY={copyY} chipY={chipY} imageY={imageY} imageScale={imageScale} />
      )}
      <div className="relative mx-auto w-full max-w-[1180px]">
        <div className="sun-gradient relative overflow-hidden rounded-[1.4rem] sm:rounded-[1.75rem]">
          {/* Botanical light shapes */}
          <span
            aria-hidden="true"
            className="absolute right-[42%] top-[6%] hidden h-32 w-32 rounded-[0_85%_0_85%] bg-cream/45 sm:block motion-safe:animate-[sway_9s_ease-in-out_infinite_alternate]"
          />
          <span
            aria-hidden="true"
            className="absolute right-[6%] top-[20%] hidden h-20 w-20 rounded-[0_85%_0_85%] bg-cream/40 sm:block motion-safe:animate-[sway_9s_ease-in-out_infinite_alternate_-4s]"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 hidden h-28 bg-gradient-to-t from-ember/14 to-transparent sm:block"
          />

          {/* One image request. On phones the motion layer is static; the desktop
              crop retains its independent scroll parallax without scaling the hero. */}
          <div className="pointer-events-none relative h-[clamp(13rem,52vw,24rem)] w-full lg:absolute lg:inset-auto lg:bottom-0 lg:right-0 lg:h-[88%] lg:w-[46%]">
            <m.div
              data-hero-image-layer
              style={desktopMotion ? { y: imageY, scale: imageScale } : undefined}
              className="home-portrait-motion relative h-full w-full"
            >
              <div data-hero-arrival="photo"
                className="hero-photo-arrival relative h-full w-full overflow-hidden lg:rounded-tl-[9rem]">
                <Image
                  src="/images/hero-doctor.jpg"
                  alt="Illustration of a healthcare professional"
                  fill
                  priority
                  sizes="(max-width: 1023px) 100vw, (max-width: 1279px) 46vw, 544px"
                  className="object-cover object-[62%_18%] sm:object-[center_24%] lg:object-[center_16%]"
                />
                <div className="absolute inset-0 hidden bg-gradient-to-r from-apricot/6 via-transparent to-transparent lg:block" />
                <div className="absolute inset-0 hidden bg-gradient-to-t from-ember/10 via-transparent to-transparent lg:block" />
                <div className="absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-cream to-transparent lg:hidden" />
              </div>
            </m.div>
            {/* Contact chip */}
            <m.a
              href={practice.phoneHref}
              data-hero-call
              style={desktopMotion ? { y: chipY } : undefined}
              className="glass group pointer-events-auto absolute bottom-3 right-3 z-20 flex items-center gap-2.5 rounded-2xl p-2 pr-4 text-ink transition-transform duration-500 hover:-translate-y-1 sm:bottom-6 sm:right-6"
            >
              <span className="relative hidden h-11 w-11 overflow-hidden rounded-xl bg-peach sm:block">
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
                <span className="mt-0.5 block text-ink-muted">{practice.phone}</span>
              </span>
              <Phone className="h-3.5 w-3.5 text-ink/60" aria-hidden="true" />
            </m.a>
          </div>

          {/* Copy */}
          <m.div
            style={desktopMotion ? { y: copyY } : undefined}
            className="hero-copy-plate relative z-10 w-full max-w-none px-4 pb-20 pt-8 text-ink lg:max-w-[42rem] sm:px-10 sm:pb-16 sm:pt-12 lg:px-14 lg:pb-24 lg:pt-24"
          >
            <span
              data-hero-arrival="label"
              className="hero-copy-arrival hero-label mb-6 flex items-center gap-3 text-[10px] uppercase tracking-[0.16em] text-ink-muted"
            >
              <span className="h-px w-8 bg-ember" aria-hidden="true" />
              Consulting at Life Roseacres Hospital
            </span>

            <h1 data-hero-arrival="headline" className="hero-copy-arrival hero-headline text-[clamp(2.4rem,6.4vw,4.9rem)] font-light leading-[0.98] tracking-[-0.035em]">
              <span className="block">{"Women's Health."}</span>
              <span className="block font-display text-[1.12em] italic leading-[0.9] tracking-[-0.015em]">
                Every Stage.
              </span>
              <span className="block">Every Journey.</span>
            </h1>

            <p
              data-hero-arrival="support"
              className="hero-copy-arrival hero-support mt-5 max-w-[26rem] sm:mt-6 text-[0.875rem] leading-relaxed text-ink sm:text-[15px]"
            >
              {brand.heroCopy}
            </p>

            <div
              data-hero-arrival="credentials"
              className="hero-copy-arrival hero-credentials mt-5 flex flex-wrap sm:mt-7 items-center gap-x-3 gap-y-1.5 text-[10px] uppercase tracking-[0.16em] text-ink"
            >
              {["MBChB", "FCOG (SA)", "MMed (O&G) Wits"].map((item, i) => (
                <span key={item} className="flex items-center gap-3">
                  {i > 0 && <span className="h-3 w-px bg-charcoal/25" aria-hidden="true" />}
                  {item}
                </span>
              ))}
            </div>

            <div
              data-hero-arrival="actions"
              className="hero-actions mt-5 flex flex-wrap items-center gap-2 sm:mt-6 sm:gap-2.5"
            >
              <a href="/contact#appointment-request" className="btn" data-cursor="Book">
                Book an appointment
                <i aria-hidden="true">
                  <ArrowUpRight className="h-3 w-3" />
                </i>
              </a>
              <a href="/about" className="btn btn-glass">
                Meet Dr Sompo
                <i aria-hidden="true">
                  <ArrowUpRight className="h-3 w-3" />
                </i>
              </a>
            </div>
          </m.div>

          {/* Existing cue: CSS is paused offscreen and absent under reduced motion. */}
          <span
            aria-hidden="true"
            className="absolute bottom-6 left-6 z-20 hidden items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-ink/70 lg:flex"
          >
            <span className="relative block h-8 w-px overflow-hidden bg-charcoal/20">
              <span className="hero-scroll-cue absolute inset-x-0 top-0 block h-3 bg-charcoal" />
            </span>
            Scroll
          </span>

          {/* Rotating glass pill */}
          <span className="glass pointer-events-none absolute right-[27%] top-8 z-20 hidden rounded-full px-4 py-2 text-[11px] font-medium text-ink lg:block">
            <span key={pill} className={pill === 0 ? "block" : "hero-pill-label block"}>
              {rotating[pill]}
            </span>
          </span>

        </div>
      </div>
    </section>
  );
}

/** Subscribe only while the hero is visible on a motion-capable desktop.
 * The stable values live in Hero, so leaving the viewport does not snap the
 * portrait back or keep four scroll transforms ticking farther down the page. */
function HeroParallax({ target, copyY, chipY, imageY, imageScale }: {
  target: RefObject<HTMLDivElement | null>;
  copyY: MotionValue<number>;
  chipY: MotionValue<number>;
  imageY: MotionValue<number>;
  imageScale: MotionValue<number>;
}) {
  const { scrollYProgress } = useScroll({ target, offset: ["start start", "end start"] });
  useMotionValueEvent(scrollYProgress, "change", (value) => {
    const progress = Math.max(0, Math.min(1, value));
    copyY.set(progress * -90);
    chipY.set(progress * 40);
    imageY.set(progress * 60);
    imageScale.set(1 + progress * 0.06);
  });
  return null;
}

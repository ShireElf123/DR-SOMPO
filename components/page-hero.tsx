"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { WordsIn } from "@/components/ui/motion";

/**
 * Interior page hero. Photography is always visible — full frame, no hover
 * reveal — with a slow parallax drift as the page scrolls.
 */
export function PageHero({
  tag,
  title,
  muted,
  intro,
  image,
  alt,
  children,
  mobileImage,
  aspect = "aspect-[16/10] sm:aspect-[16/8] lg:aspect-[16/7]",
}: {
  tag: string;
  title: string;
  muted?: string;
  intro?: string;
  image: string;
  alt: string;
  /** Alternative crop/photo used below `sm`, where the wide crop would lose the subject. */
  mobileImage?: string;
  children?: ReactNode;
  aspect?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "12%"]);

  return (
    <section className="px-3 pt-3 sm:px-4 sm:pt-4">
      <div className="mx-auto w-full max-w-[1180px]">
        <div
          ref={ref}
          className={cn(
            "relative overflow-hidden rounded-[1.4rem] bg-sage sm:rounded-[1.75rem]",
            aspect,
          )}
        >
          <motion.div style={reduce ? undefined : { y }} className="absolute inset-[-6%_0]">
            {/* Phones get their own crop: a wide landscape crop of a portrait
                subject invariably cuts the head off on a narrow frame. */}
            {mobileImage ? (
              <>
                <Image
                  src={mobileImage}
                  alt={alt}
                  fill
                  priority
                  sizes="100vw"
                  className="object-cover sm:hidden"
                />
                <Image
                  src={image}
                  alt=""
                  fill
                  priority
                  sizes="(max-width: 1180px) 96vw, 1180px"
                  className="hidden object-cover sm:block"
                />
              </>
            ) : (
              <Image
                src={image}
                alt={alt}
                fill
                priority
                sizes="(max-width: 1180px) 96vw, 1180px"
                className="object-cover"
              />
            )}
          </motion.div>

          <div className="absolute inset-0 bg-gradient-to-t from-forest-ink/75 via-forest-ink/25 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-forest-ink/45 to-transparent" />

          <div className="absolute inset-x-0 bottom-0 p-5 text-white sm:p-8 lg:p-10">
            <span className="tag tag-light">{tag}</span>
            <h1 className="max-w-[46rem] text-[clamp(2rem,5.2vw,3.9rem)] leading-[1.02]">
              <WordsIn text={title} delay={0.15} stagger={0.03} />
              {muted && (
                <>
                  {" "}
                  <span className="text-white/80">
                    <WordsIn text={muted} delay={0.3} stagger={0.03} />
                  </span>
                </>
              )}
            </h1>
            {intro && (
              <p className="mt-3 max-w-[34rem] text-[12.5px] leading-relaxed text-white/80 sm:text-[13.5px]">
                {intro}
              </p>
            )}
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}

/** Section heading used across the interior pages. */
export function SectionHead({
  tag,
  title,
  muted,
  intro,
  className,
}: {
  tag?: string;
  title: string;
  muted?: string;
  intro?: string;
  className?: string;
}) {
  return (
    <div className={cn("max-w-2xl", className)}>
      {tag && <span className="tag">{tag}</span>}
      <h2 className="text-[clamp(1.6rem,3.4vw,2.35rem)] leading-[1.06]">
        <WordsIn text={title} />
        {muted && (
          <>
            {" "}
            <span className="text-ink-soft">
              <WordsIn text={muted} delay={0.15} />
            </span>
          </>
        )}
      </h2>
      {intro && (
        <p className="mt-3 max-w-lg text-[13px] leading-relaxed text-ink-soft">{intro}</p>
      )}
    </div>
  );
}


/**
 * Portrait-led hero for pages where the subject is a person rather than a
 * place. A cinematic 16:7 strip crops a standing portrait through the face, so
 * this variant gives the photograph its own column at a natural 4:5 ratio —
 * the whole person is visible on a phone and on a desktop — with the copy
 * sitting on a tinted panel beside it.
 */
export function SplitHero({
  tag,
  title,
  muted,
  intro,
  image,
  alt,
  chips = [],
  footer,
}: {
  tag: string;
  title: string;
  muted?: string;
  intro?: string;
  image: string;
  alt: string;
  chips?: string[];
  footer?: ReactNode;
}) {
  return (
    <section className="px-3 pt-3 sm:px-4 sm:pt-4">
      <div className="mx-auto w-full max-w-[1180px]">
        <div className="grid gap-2.5 rounded-[1.4rem] bg-mint p-2.5 sm:rounded-[1.75rem] sm:p-3 lg:grid-cols-[1.05fr_0.95fr] lg:items-stretch">
          <div className="order-2 flex flex-col justify-center px-3 pb-6 pt-4 sm:px-6 sm:pb-8 lg:order-1 lg:px-8 lg:py-10">
            <span className="tag">{tag}</span>
            <h1 className="text-[clamp(2rem,5vw,3.6rem)] leading-[1.02]">
              <WordsIn text={title} delay={0.1} stagger={0.04} />
              {muted && (
                <>
                  {" "}
                  <span className="text-ink-soft">
                    <WordsIn text={muted} delay={0.2} stagger={0.04} />
                  </span>
                </>
              )}
            </h1>
            {intro && (
              <p className="mt-4 max-w-[30rem] text-[13px] leading-relaxed text-ink-soft sm:text-[14px]">
                {intro}
              </p>
            )}
            {chips.length > 0 && (
              <div className="mt-5 flex flex-wrap gap-1.5">
                {chips.map((chip) => (
                  <span
                    key={chip}
                    className="rounded-full bg-white px-2.5 py-1 text-[10.5px] font-medium text-forest ring-1 ring-charcoal/8"
                  >
                    {chip}
                  </span>
                ))}
              </div>
            )}
            {footer && <div className="mt-6">{footer}</div>}
          </div>

          <div className="relative order-1 overflow-hidden rounded-[1.1rem] bg-sage lg:order-2 lg:rounded-[1.35rem]">
            <div className="relative aspect-[4/5] w-full">
              <Image
                src={image}
                alt={alt}
                fill
                priority
                sizes="(max-width: 1024px) 96vw, 560px"
                className="object-cover object-[center_18%]"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-forest-ink/45 via-transparent to-transparent" />
              <p className="absolute inset-x-4 bottom-4 text-[10px] uppercase tracking-[0.16em] text-white/85">
                Life Roseacres Hospital · Primrose
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

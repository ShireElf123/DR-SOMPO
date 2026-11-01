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

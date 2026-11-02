"use client";

import {
  m,
  useInView,
  useScroll,
  useTransform,
  type MotionValue,
  type Variants,
} from "framer-motion";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import Image from "@/components/ui/practice-image";
import { useRef, useState, type ElementType, type ReactNode } from "react";
import { useHydrated } from "@/lib/use-hydrated";
import { cn } from "@/lib/utils";

/* One spring voice for entrance motion. Damping stays high so the settle reads
   as weight rather than bounce; the masked word rise keeps its own spring so
   the two never fight. Reduced motion bypasses both (see Reveal/WordsIn). */
const SPRING = { type: "spring", stiffness: 120, damping: 24 } as const;
const WORD_SPRING = { type: "spring", stiffness: 170, damping: 26, mass: 0.7 } as const;

/* -------------------------------------------------------------------------- */
/* Entrance                                                                    */
/* -------------------------------------------------------------------------- */

export function Reveal({
  children,
  delay = 0,
  y = 24,
  x = 0,
  once = true,
  className,
  as = "div",
  amount = 0.3,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  x?: number;
  once?: boolean;
  className?: string;
  as?: ElementType;
  amount?: number;
}) {
  const reduce = useReducedMotion();
  const Tag = m[as as keyof typeof m] as typeof m.div;

  const StaticTag = as;
  if (reduce) return <StaticTag className={className}>{children}</StaticTag>;

  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y, x }}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={{ once, amount }}
      transition={{ ...SPRING, delay }}
    >
      {children}
    </Tag>
  );
}

export function RevealGroup({
  children,
  className,
  stagger = 0.09,
  delay = 0,
  amount = 0.15,
}: {
  children: ReactNode;
  className?: string;
  stagger?: number;
  delay?: number;
  amount?: number;
}) {
  const reduce = useReducedMotion();

  if (reduce) return <div className={className}>{children}</div>;

  const variants: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: stagger, delayChildren: delay } },
  };

  return (
    <m.div
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount }}
    >
      {children}
    </m.div>
  );
}

export function RevealItem({
  children,
  className,
  y = 26,
  x = 0,
  scale = 1,
}: {
  children: ReactNode;
  className?: string;
  y?: number;
  x?: number;
  scale?: number;
}) {
  const reduce = useReducedMotion();

  if (reduce) return <div className={className}>{children}</div>;

  const variants: Variants = {
    hidden: { opacity: 0, y, x, scale },
    show: {
      opacity: 1,
      y: 0,
      x: 0,
      scale: 1,
      transition: { ...SPRING },
    },
  };

  return (
    <m.div className={className} variants={variants}>
      {children}
    </m.div>
  );
}

/* -------------------------------------------------------------------------- */
/* Headlines                                                                   */
/* -------------------------------------------------------------------------- */

/**
 * Masked word-by-word headline rise — each word travels up out of its own
 * baseline. This is the reference's hero treatment and it is used on every
 * major heading so the page has one consistent voice.
 */
export function WordsIn({
  text,
  className,
  delay = 0,
  stagger = 0.06,
  once = true,
  amount = 0.4,
}: {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
  once?: boolean;
  amount?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduce = useReducedMotion();
  const words = text.split(" ");
  const lineClass = cn("inline", className);
  /* A heading is on screen for a moment, not a page length. Promotion is cheap
     to add on approach and expensive to hold, so it is tied to visibility
     instead of sitting on the element for the life of the document. */
  const near = useInView(ref, { margin: "10% 0px 10% 0px" });

  if (reduce) return <span className={lineClass}>{text}</span>;

  return (
    <span ref={ref} className={lineClass}>
      {words.map((word, i) => (
        <span
          key={`${word}-${i}`}
          className="inline-block overflow-hidden align-bottom pb-[0.14em] -mb-[0.14em]"
        >
          <m.span
            className={cn(
              "inline-block [backface-visibility:hidden]",
              near && "motion-safe:will-change-transform",
            )}
            initial={{ y: "115%" }}
            whileInView={{ y: "0%" }}
            viewport={{ once, amount }}
            transition={{ ...WORD_SPRING, delay: delay + i * stagger }}
          >
            {word}
            {i < words.length - 1 ? "\u00A0" : ""}
          </m.span>
        </span>
      ))}
    </span>
  );
}

/**
 * A permanently readable base with a paint-only, scroll-lit copy. The resting
 * tint clears 4.5:1 on white, cream and blush; the lit words are charcoal. On
 * the deepest orange a dimmed word would fall under AA, so the effect runs on
 * the light apricot surface instead of buying contrast with opacity.
 */
export function ScrollWords({
  text,
  className,
  tint = "light",
}: {
  text: string;
  className?: string;
  /** Panel tone this paragraph sits on. */
  tint?: "light" | "dark";
}) {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduce = useReducedMotion();
  const words = text.split(" ");

  // Motion updates the paint layer without a React render per scroll frame.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.92", "end 0.42"],
  });

  // Mount per-word MotionValues only near the viewport. The plain reading
  // layer stays mounted, including on the server and with JavaScript disabled.
  const onScreen = useInView(ref, { margin: "15% 0px 15% 0px" });

  // Both ramps are measured against the surface they sit on: charcoal on the
  // light panels, cream on the deep ones, with the un-lit copy at 0.72 alpha
  // (6.4:1 on the lightest deep stop).
  const lit = tint === "dark" ? "var(--color-cream)" : "var(--color-charcoal)";
  const dim = tint === "dark" ? "rgba(253, 248, 242, 0.72)" : "#6f6255";

  return (
    <p ref={ref} className={className} data-scroll-words={tint}>
      {words.map((word, i) => (
        <span key={`${word}-${i}`}>
          <span className="relative inline-block">
            <span style={{ color: reduce ? lit : dim }}>{word}</span>
            {!reduce && onScreen && (
              <ScrollWordOverlay
                index={i}
                total={words.length}
                progress={scrollYProgress}
                lit={lit}
              >
                {word}
              </ScrollWordOverlay>
            )}
          </span>{" "}
        </span>
      ))}
    </p>
  );
}

/** Mounted only while its paragraph is near the viewport. */
function ScrollWordOverlay({
  index,
  total,
  progress,
  lit,
  children,
}: {
  index: number;
  total: number;
  progress: MotionValue<number>;
  lit: string;
  children: ReactNode;
}) {
  const start = index / total;
  const end = Math.min(1, start + 0.16);
  const opacity = useTransform(progress, [start, end], [0, 1]);

  return (
    <m.span
      aria-hidden="true"
      className="absolute inset-0"
      style={{ opacity, color: lit }}
    >
      {children}
    </m.span>
  );
}

/* -------------------------------------------------------------------------- */
/* Marquee                                                                     */
/* -------------------------------------------------------------------------- */

/** Two equal, non-shrinking cycles, each at least as wide as its own viewport.
 * The -50% endpoint is exactly one cycle, even on ultra-wide displays. */
export function Marquee({
  children,
  className,
  trackClassName,
  slow = false,
  label = "Practice information",
}: {
  children: ReactNode;
  className?: string;
  trackClassName?: string;
  slow?: boolean;
  label?: string;
}) {
  const hydrated = useHydrated();
  const [paused, setPaused] = useState(false);
  return (
    <div
      className={cn("marquee-group relative", className)}
      role="region"
      aria-label={label}
      tabIndex={0}
      data-ready={hydrated}
      data-paused={paused}
    >
      <div
        className={cn("marquee-track", slow && "marquee-slow", trackClassName)}
      >
        <div className="marquee-copy">{children}</div>
        <div className="marquee-copy" aria-hidden="true" inert>
          {children}
        </div>
      </div>
      <button
        type="button"
        onClick={() => setPaused((value) => !value)}
        aria-label={`${paused ? "Resume" : "Pause"} ${label.toLowerCase()}`}
        aria-pressed={paused}
        className="marquee-toggle absolute right-1.5 top-1/2 z-10 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full border border-ember/20 bg-cream text-ink shadow-soft"
      >
        <span
          aria-hidden="true"
          className={
            paused
              ? "ml-0.5 h-0 w-0 border-y-[5px] border-l-[8px] border-y-transparent border-l-current"
              : "h-3 w-2 border-x-2 border-current"
          }
        />
      </button>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Parallax                                                                   */
/* -------------------------------------------------------------------------- */

/**
 * Scroll-linked parallax for a photograph.
 *
 * Performance notes, because this component is the one most likely to make a
 * page feel like it is stuttering:
 *
 *  - The frames are padded well beyond the drift distance. The drift below is
 *    `strength` pixels each way, so the frame has to carry at least that much
 *    overflow on both edges or the clip will reveal bare background at the
 *    extremes, which reads as a jolt.
 *  - The moving layer is promoted once, and the drift is a pure `translate3d`
 *    on a compositor layer. Nothing here animates layout.
 *  - The photograph itself carries its own hover scale. That scale lives on the
 *    <img>, not on the parallax layer, so the two transforms do not compound
 *    into a pixel grid that has to be re-rasterised on every frame.
 */
export function ParallaxImage({
  src,
  alt,
  className,
  imageClassName,
  strength = 60,
  sizes = "(max-width: 1024px) 100vw, 1180px",
  priority = false,
  children,
  offset = ["start end", "end start"] as const,
}: {
  src: string;
  alt: string;
  className?: string;
  imageClassName?: string;
  strength?: number;
  sizes?: string;
  priority?: boolean;
  /** Overlay content rendered above the image, inside the clipped frame. */
  children?: ReactNode;
  offset?: readonly [string, string];
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: offset as never,
  });
  const y = useTransform(scrollYProgress, [0, 1], [strength, -strength]);

  return (
    <div ref={ref} className={cn("relative overflow-hidden", className)}>
      <m.div
        style={reduce ? undefined : { y }}
        /* Padded to comfortably exceed `strength`, and promoted up front so the
           compositor is not asked to create a layer mid-scroll. */
        className="absolute inset-x-0 -inset-y-[22%] [backface-visibility:hidden] motion-safe:will-change-transform"
      >
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes={sizes}
          className={cn("object-cover", imageClassName)}
        />
      </m.div>
      {children}
    </div>
  );
}

"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
  type Variants,
} from "framer-motion";
import Image from "next/image";
import { useRef, type ElementType, type ReactNode } from "react";
import { cn } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;

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
  const Tag = motion[as as keyof typeof motion] as typeof motion.div;

  if (reduce) return <div className={className}>{children}</div>;

  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y, x }}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={{ once, amount }}
      transition={{ duration: 1, delay, ease: EASE }}
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
    <motion.div
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount }}
    >
      {children}
    </motion.div>
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
    show: { opacity: 1, y: 0, x: 0, scale: 1, transition: { duration: 1, ease: EASE } },
  };

  return (
    <motion.div className={className} variants={variants}>
      {children}
    </motion.div>
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
  gray = false,
}: {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
  once?: boolean;
  amount?: number;
  /** Render this line in the softer tint used for the middle hero line. */
  gray?: boolean;
}) {
  const reduce = useReducedMotion();
  const words = text.split(" ");
  const lineClass = cn("inline", gray && "text-white/80", className);

  if (reduce) return <span className={lineClass}>{text}</span>;

  return (
    <span className={lineClass}>
      {words.map((word, i) => (
        /* The travel is 112% of the word's own height but the clip only has
           0.14em of padding underneath, so the incoming word is still being
           painted while it clears the mask — and a browser re-rasterises text
           that is mid-transform inside a clip. Translating the mask's contents
           with `translateZ(0)` and easing the travel out sooner keeps it on
           the compositor. */
        <span
          key={`${word}-${i}`}
          className="inline-block overflow-hidden align-bottom pb-[0.14em] -mb-[0.14em]"
        >
          <motion.span
            className="inline-block [backface-visibility:hidden] motion-safe:will-change-transform"
            initial={{ y: "115%" }}
            whileInView={{ y: "0%" }}
            viewport={{ once, amount }}
            transition={{ duration: 1, delay: delay + i * stagger, ease: EASE }}
          >
            {word}
            {i < words.length - 1 ? "\u00A0" : ""}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

/**
 * Scroll-lit sentence: muted words warm to full ink as the block scrolls
 * through the viewport. The reference's most distinctive reading moment.
 */
export function ScrollWords({
  text,
  className,
  avatars = [],
  tint = "light",
}: {
  text: string;
  className?: string;
  /** Word indices that should render a soft avatar dot before them. */
  avatars?: number[];
  /** `light` for white panels, `dark` for forest panels. */
  tint?: "light" | "forest";
}) {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduce = useReducedMotion();
  const words = text.split(" ");

  // Scroll position → per-word progress, handled by Motion's own scroll
  // tracker so it can ride the compositor instead of firing a React render on
  // every wheel event.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.92", "end 0.42"],
  });

  const lit = tint === "light" ? "var(--color-charcoal)" : "#ffffff";
  const dim = tint === "light" ? "#c3c8c4" : "rgba(255,255,255,0.34)";

  return (
    <p ref={ref} className={className}>
      {words.map((word, i) => (
        <span key={`${word}-${i}`}>
          {avatars.includes(i) && (
            <span
              aria-hidden="true"
              className="mr-1 inline-block h-[1.05em] w-[1.05em] translate-y-[0.12em] overflow-hidden rounded-full bg-gradient-to-br from-clay to-mint align-baseline ring-2 ring-white/70"
            >
              <Image
                src={avatarImages[i % avatarImages.length]}
                alt=""
                width={40}
                height={40}
                className="h-full w-full object-cover"
              />
            </span>
          )}
          <ScrollWord index={i} total={words.length} progress={scrollYProgress} lit={lit} dim={dim} reduce={!!reduce}>
            {word}
          </ScrollWord>{" "}
        </span>
      ))}
    </p>
  );
}

const avatarImages = [
  "/images/patient-quiet.jpg",
  "/images/consultation.jpg",
  "/images/fertility.jpg",
];

function ScrollWord({
  index,
  total,
  progress,
  lit,
  dim,
  reduce,
  children,
}: {
  index: number;
  total: number;
  progress: MotionValue<number>;
  lit: string;
  dim: string;
  reduce: boolean;
  children: ReactNode;
}) {
  const start = index / total;
  const end = Math.min(1, start + 0.16);
  const opacity = useTransform(progress, [start, end], [0, 1]);

  return (
    <span className="relative inline-block">
      <span style={{ color: dim }} aria-hidden={false}>
        {children}
      </span>
      <motion.span
        aria-hidden="true"
        style={{ opacity: reduce ? 1 : opacity, color: lit }}
        className="absolute inset-0"
      >
        {children}
      </motion.span>
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/* Marquee                                                                     */
/* -------------------------------------------------------------------------- */

export function Marquee({
  children,
  className,
  trackClassName,
  slow = false,
}: {
  children: ReactNode;
  className?: string;
  trackClassName?: string;
  slow?: boolean;
}) {
  return (
    <div className={cn("marquee-group overflow-hidden", className)}>
      <div
        className={cn(
          "marquee-track whitespace-nowrap",
          slow && "marquee-slow",
          trackClassName,
        )}
      >
        {children}
        {children}
      </div>
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
  const { scrollYProgress } = useScroll({ target: ref, offset: offset as never });
  const y = useTransform(scrollYProgress, [0, 1], [strength, -strength]);

  return (
    <div ref={ref} className={cn("relative overflow-hidden", className)}>
      <motion.div
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
      </motion.div>
      {children}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Card lift                                                                  */
/* -------------------------------------------------------------------------- */

/**
 * Wraps a card in a magnetic hover: a small lift, a touch of scale and a soft
 * shadow that blooms underneath. Used sparingly, on the panels that are
 * actually clickable, so the effect keeps its meaning.
 */
export function HoverLift({
  children,
  className,
  lift = 6,
}: {
  children: ReactNode;
  className?: string;
  lift?: number;
}) {
  const reduce = useReducedMotion();

  if (reduce) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      whileHover={{ y: -lift }}
      transition={{ duration: 0.5, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */
/* Wordmark wipe                                                              */
/* -------------------------------------------------------------------------- */

/**
 * The oversized footer wordmark, revealed by a clip-path wipe as it enters
 * view. Pure transform — no layout cost.
 */
export function WipeText({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={reduce ? undefined : { clipPath: "inset(0 100% 0 0)" }}
      whileInView={reduce ? undefined : { clipPath: "inset(0 0% 0 0)" }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 1.5, delay, ease: [0.6, 0, 0.2, 1] }}
    >
      {children}
    </motion.div>
  );
}

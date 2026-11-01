"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { useEffect, useRef, useState, type ElementType, type ReactNode } from "react";
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
  const lineClass = cn("inline", gray && "text-white/70", className);

  if (reduce) return <span className={lineClass}>{text}</span>;

  return (
    <span className={lineClass}>
      {words.map((word, i) => (
        <span
          key={`${word}-${i}`}
          className="inline-block overflow-hidden align-bottom pb-[0.14em] -mb-[0.14em]"
        >
          <motion.span
            className="inline-block will-change-transform"
            initial={{ y: "112%" }}
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
}: {
  text: string;
  className?: string;
  /** Word indices that should render a soft avatar dot before them. */
  avatars?: number[];
}) {
  const ref = useRef<HTMLParagraphElement>(null);
  const [progress, setProgress] = useState(0);
  const reduce = useReducedMotion();
  const words = text.split(" ");

  useEffect(() => {
    if (reduce) {
      setProgress(1);
      return;
    }

    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const el = ref.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const start = window.innerHeight * 0.92;
        const span = window.innerHeight * 0.5;
        const raw = (start - rect.top) / span;
        setProgress(Math.min(Math.max(raw, 0), 1));
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [reduce]);

  return (
    <p ref={ref} className={className}>
      {words.map((word, i) => {
        const on = i / words.length < progress;
        return (
          <span key={`${word}-${i}`}>
            {avatars.includes(i) && (
              <span
                aria-hidden="true"
                className="mr-1 inline-block h-[1.05em] w-[1.05em] translate-y-[0.12em] rounded-full bg-gradient-to-br from-clay to-mint align-baseline ring-2 ring-white/70"
              />
            )}
            <span
              className={cn(
                "transition-colors duration-300",
                on ? "text-charcoal" : "text-[#b9bdbb]",
              )}
            >
              {word}
            </span>{" "}
          </span>
        );
      })}
    </p>
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

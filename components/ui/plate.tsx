"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Magazine plate: photography is never hidden, never cropped out of the story.
 *  - a numbered plate with a museum-style caption
 *  - the image scales up 1.03 on hover only
 *  - the caption carries a `meta` line so every plate reads as archival
 */
export function Plate({
  image,
  alt,
  index,
  label,
  meta,
  body,
  className,
  ratio = "aspect-[4/5]",
  sizes = "(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 30vw",
  priority = false,
}: {
  image: string;
  alt: string;
  index?: string;
  label: string;
  meta?: string;
  body?: string;
  className?: string;
  ratio?: string;
  sizes?: string;
  priority?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <figure ref={ref} className={cn("group", className)}>
      <div className={cn("relative overflow-hidden rounded-[1.1rem] bg-sage", ratio)}>
        <Image
          src={image}
          alt={alt}
          fill
          priority={priority}
          sizes={sizes}
          className="object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.035]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-forest-ink/50 via-transparent to-transparent" />

        {index && (
          <span className="absolute left-3 top-3 rounded-full bg-white/92 px-2.5 py-1 text-[10px] font-medium tracking-[0.06em] text-forest backdrop-blur-md">
            {index}
          </span>
        )}

        <figcaption className="absolute inset-x-3 bottom-3 flex items-end justify-between gap-3">
          <span className="rounded-full bg-white/95 px-3 py-1 text-[10.5px] font-medium text-charcoal backdrop-blur-md">
            {label}
          </span>
          <span
            aria-hidden="true"
            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white text-black transition-transform duration-500 group-hover:rotate-45"
          >
            <ArrowUpRight className="h-3 w-3" />
          </span>
        </figcaption>
      </div>

      {(meta || body) && (
        <div className="mt-2 flex items-baseline justify-between gap-4 border-t border-charcoal/10 pt-2">
          {body && (
            <p className="max-w-[22rem] text-[12px] leading-relaxed text-ink-soft">{body}</p>
          )}
          {meta && (
            <p className="shrink-0 text-[9.5px] uppercase tracking-[0.14em] text-ink-muted">
              {meta}
            </p>
          )}
        </div>
      )}
    </figure>
  );
}

/**
 * Panel: the rounded slab the whole site is built from. `tone` picks the
 * surface, `image` turns it into a split panel with the photo taking the right
 * column on desktop. Nothing is gated behind hover.
 */
export function Panel({
  tone = "mint",
  className,
  children,
}: {
  tone?: "mint" | "ivory" | "forest" | "sage" | "outline";
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[1.5rem] sm:rounded-[1.75rem]",
        tone === "mint" && "bg-mint",
        tone === "sage" && "bg-sage",
        tone === "ivory" && "bg-ivory",
        tone === "forest" && "forest-gradient text-white",
        tone === "outline" && "border border-charcoal/12 bg-white",
        className,
      )}
    >
      {children}
    </div>
  );
}

/** Small icon disc used at the top of panels. */
export function IconDisc({
  children,
  tone = "light",
}: {
  children: ReactNode;
  tone?: "light" | "forest";
}) {
  return (
    <span
      className={cn(
        "grid h-9 w-9 place-items-center rounded-full border",
        tone === "light"
          ? "border-charcoal/12 bg-white text-forest"
          : "border-white/25 bg-white/10 text-white",
      )}
    >
      {children}
    </span>
  );
}

/** Animated vertical bars — a quiet "data" motif for the research panels. */
export function SignalBars({
  values = [22, 38, 30, 54, 46, 68, 58],
  className,
}: {
  values?: number[];
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <div className={cn("flex items-end gap-1", className)} aria-hidden="true">
      {values.map((v, i) => (
        <motion.span
          key={i}
          className="w-2 rounded-[2px] bg-current opacity-70"
          initial={reduce ? undefined : { height: 4 }}
          whileInView={reduce ? undefined : { height: `${v}%` }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.9, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] }}
          style={reduce ? { height: `${v}%` } : undefined}
        />
      ))}
    </div>
  );
}

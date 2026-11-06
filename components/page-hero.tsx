"use client";

import { m, useScroll, useTransform } from "framer-motion";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { useDesktopMotion } from "@/lib/use-desktop-motion";
import Image from "@/components/ui/practice-image";
import { ResponsivePhoto } from "@/components/ui/responsive-photo";
import { useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { WordsIn } from "@/components/ui/motion";

/**
 * Interior page hero. Photography is always visible — full frame, no hover
 * reveal — with a slow parallax drift as the page scrolls.
 *
 * On phones the photograph is a band above the copy rather than a backdrop
 * behind it: at 390px the copy plate grows taller than any usable crop, so the
 * overlay layout buried the image under a translucent card. The plate also had
 * to be legible, not just present, so the copy moves onto cream and the photo
 * keeps its whole frame. From sm up the panel is wide enough for the plate to
 * sit on a fraction of the frame and the overlay returns.
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
  const desktopMotion = useDesktopMotion();
  const parallax = !reduce && desktopMotion;
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "8%"]);

  return (
    <section className="px-3 pt-3 sm:px-4 sm:pt-4">
      <div className="mx-auto w-full max-w-[1180px]">
        <div
          ref={ref}
          className="relative overflow-hidden rounded-[1.4rem] bg-peach sm:grid sm:rounded-[1.75rem]"
        >
          {/* The aspect spacer and copy share a grid cell. The row grows to the
              larger of the image ratio or the complete text, including zoom. */}
          <div
            aria-hidden="true"
            className={cn(
              "pointer-events-none col-start-1 row-start-1 hidden w-full self-start sm:block",
              aspect,
            )}
          />
          {/* On phones this is the framed photograph above the copy; from sm up
              the same element becomes the full-panel parallax layer. The layer
              slides 12% of its own height, so it needs at least that much
              overflow on both edges; -8% left a visible sliver at the top
              whenever the image drifted furthest. */}
          <div
            className={cn(
              "relative col-start-1 row-start-1 w-full overflow-hidden sm:absolute sm:inset-0 sm:aspect-auto",
              aspect,
            )}
          >
            <m.div
              style={parallax ? { y } : undefined}
              className="h-full w-full [backface-visibility:hidden] motion-safe:will-change-transform sm:absolute sm:inset-x-0 sm:-top-[10%] sm:h-[112%]"
            >
              <ResponsivePhoto
                image={image}
                mobileImage={mobileImage}
                alt={alt}
              />
            </m.div>
          </div>

          <div className="pointer-events-none absolute inset-0 hidden bg-gradient-to-t from-ember/18 to-transparent sm:block" />
          <div className="pointer-events-none absolute inset-0 hidden bg-gradient-to-r from-ember/12 to-transparent sm:block" />

          {/* From sm up the copy sits on a warm glass plate rather than on the
              photograph itself: contrast is measured against a known cream
              surface at every frame of the parallax, and the glass keeps the
              image legible underneath instead of flattening it with a black
              scrim. On phones the plate would cover the whole photograph, so the
              copy falls below it on plain cream. */}
          <div
            className="relative col-start-1 row-start-1 min-w-0 self-end rounded-none px-5 py-6 text-ink [overflow-wrap:anywhere] glass max-sm:border-0 max-sm:bg-cream max-sm:shadow-none sm:m-5 sm:max-w-[40rem] sm:justify-self-start sm:rounded-[1.15rem] sm:p-7 lg:m-7 lg:p-9"
            data-hero-copy
          >
            <span className="tag self-start">{tag}</span>
            <h1 className="max-w-[46rem] text-[clamp(2rem,5.2vw,3.9rem)] leading-[1.02]">
              <WordsIn text={title} delay={0.15} stagger={0.03} />
              {muted && (
                <>
                  {" "}
                  <span className="text-ink/65">
                    <WordsIn text={muted} delay={0.3} stagger={0.03} />
                  </span>
                </>
              )}
            </h1>
            {intro && (
              <p className="mt-3 max-w-[34rem] text-[12px] leading-relaxed text-ink-soft sm:text-[13px]">
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
  id,
  tag,
  title,
  muted,
  intro,
  className,
}: {
  id?: string;
  tag?: string;
  title: string;
  muted?: string;
  intro?: string;
  className?: string;
}) {
  return (
    <div className={cn("max-w-2xl", className)}>
      {tag && <span className="tag self-start">{tag}</span>}
      <h2 id={id} className="text-[clamp(1.6rem,3.4vw,2.35rem)] leading-[1.06]">
        <WordsIn text={title} />
        {muted && (
          <>
            {" "}
            <span className="font-display text-[1.06em] italic tracking-[-0.015em] text-ink/85">
              <WordsIn text={muted} delay={0.15} />
            </span>
          </>
        )}
      </h2>
      {intro && (
        <p className="mt-3 max-w-lg text-[13px] leading-relaxed text-ink-soft">
          {intro}
        </p>
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
        <div className="grid gap-2.5 rounded-[1.4rem] bg-blush p-2.5 shadow-soft sm:rounded-[1.75rem] sm:p-3 lg:grid-cols-[1.05fr_0.95fr] lg:items-stretch">
          <div className="order-2 flex flex-col justify-center px-3 pb-6 pt-4 sm:px-6 sm:pb-8 lg:order-1 lg:px-8 lg:py-10">
            <span className="tag self-start">{tag}</span>
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
                    className="rounded-full bg-cream px-2.5 py-1 text-[10px] font-medium text-ink border-hairline border-charcoal/8"
                  >
                    {chip}
                  </span>
                ))}
              </div>
            )}
            {footer && <div className="mt-6">{footer}</div>}
          </div>

          <div className="photo-depth relative order-1 overflow-hidden rounded-[1.1rem] bg-peach lg:order-2 lg:rounded-[1.35rem]">
            <div className="relative aspect-[4/5] w-full">
              <Image
                src={image}
                alt={alt}
                fill
                priority
                sizes="(max-width: 1024px) 96vw, 560px"
                className="object-cover object-[center_18%]"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ember/18 to-transparent" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

import Image from "@/components/ui/practice-image";
import { ArrowUpRight } from "lucide-react";
import type { ReactNode } from "react";

export { SignalBars } from "./signal-bars";
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
  return (
    <figure className={cn("group", className)}>
      <div className={cn("photo-depth relative overflow-hidden rounded-[1.1rem] bg-peach", ratio)}>
        <Image
          src={image}
          alt={alt}
          fill
          priority={priority}
          sizes={sizes}
          className="object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.035]"
        />

        {index && (
          <span className="glass absolute left-3 top-3 z-[2] rounded-full px-2.5 py-1 text-[10px] font-medium tracking-[0.06em] text-ink">
            {index}
          </span>
        )}

        <figcaption className="absolute inset-x-3 bottom-3 z-[2] flex items-end justify-between gap-3">
          <span className="glass rounded-full px-3 py-1 text-[10px] font-medium text-ink">
            {label}
          </span>
          <span
            aria-hidden="true"
            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-cream/90 text-ember shadow-soft ring-1 ring-ember/20 transition-all duration-500 group-hover:rotate-45 group-hover:bg-ember group-hover:text-cream"
          >
            <ArrowUpRight className="h-3 w-3" />
          </span>
        </figcaption>
      </div>

      {(meta || body) && (
        <div className="mt-2 flex items-baseline justify-between gap-4 border-t-hairline border-charcoal/10 pt-2">
          {body && (
            <p className="max-w-[22rem] text-[12px] leading-relaxed text-ink-soft">{body}</p>
          )}
          {meta && (
            <p className="shrink-0 text-[10px] uppercase tracking-[0.14em] text-ink-muted">
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
  tone = "blush",
  className,
  children,
}: {
  tone?: "blush" | "cream" | "ember" | "peach" | "outline";
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[1.5rem] sm:rounded-[1.75rem]",
        tone === "blush" && "bg-blush",
        tone === "peach" && "bg-peach",
        tone === "cream" && "bg-cream",
        tone === "ember" && "ember-gradient text-ink",
        tone === "outline" && "border-hairline border-charcoal/12 bg-cream",
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
  tone?: "light" | "warm";
}) {
  return (
    <span
      className={cn(
        "grid h-9 w-9 place-items-center rounded-full border",
        tone === "light"
          ? "border-charcoal/12 bg-cream text-ink"
          : "border-charcoal/15 bg-cream/70 text-ink",
      )}
    >
      {children}
    </span>
  );
}

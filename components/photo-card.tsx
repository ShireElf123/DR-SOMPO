import Image from "@/components/ui/practice-image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * The workhorse image card: photography always visible, caption plate pinned to
 * the bottom, arrow disc. Hover nudges the image in slightly and rotates the
 * arrow — the restrained motion Framer sites tend to use — but nothing is
 * hidden behind the hover.
 */
export function PhotoCard({
  href,
  image,
  alt,
  label,
  meta,
  body,
  className,
  imageClassName,
  ratio = "aspect-[4/5]",
}: {
  href?: string;
  image: string;
  alt: string;
  label: string;
  meta?: string;
  body?: string;
  className?: string;
  imageClassName?: string;
  ratio?: string;
}) {
  const content = (
    <>
      <div className={cn("photo-depth relative overflow-hidden rounded-[1.25rem] bg-peach", ratio)}>
        <Image
          src={image}
          alt={alt}
          fill
          sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 30vw"
          className={cn(
            "object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.04]",
            imageClassName,
          )}
        />

        <span className="glass absolute bottom-3 left-3 z-[2] rounded-full px-3.5 py-1 text-[10px] font-medium text-ink">
          {label}
        </span>
        {meta && (
          <span className="glass absolute bottom-3 right-12 z-[2] rounded-full px-2.5 py-1 text-[10px] uppercase tracking-[0.12em] text-ink">
            {meta}
          </span>
        )}
        <span
          aria-hidden="true"
          className="absolute bottom-3 right-3 z-[2] flex h-6 w-6 items-center justify-center rounded-full bg-charcoal text-cream transition-transform duration-500 group-hover:rotate-45"
        >
          <ArrowUpRight className="h-3 w-3" />
        </span>
      </div>

      {body && (
        <p className="mt-2.5 max-w-[20rem] text-[12px] leading-relaxed text-ink-soft">
          {body}
        </p>
      )}
    </>
  );

  if (!href) {
    return <div className={cn("group block", className)}>{content}</div>;
  }

  return (
    <Link href={href} className={cn("group block", className)}>
      {content}
    </Link>
  );
}

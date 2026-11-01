"use client";

import Image from "next/image";
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
      <div className={cn("relative overflow-hidden rounded-[1.25rem] bg-sage", ratio)}>
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
        <div className="absolute inset-0 bg-gradient-to-t from-forest-ink/55 via-transparent to-transparent" />

        <span className="absolute bottom-3 left-3 rounded-full bg-black/80 px-3.5 py-1 text-[10.5px] font-medium text-white backdrop-blur-sm">
          {label}
        </span>
        {meta && (
          <span className="absolute bottom-3 right-12 text-[10px] uppercase tracking-[0.12em] text-white/75">
            {meta}
          </span>
        )}
        <span
          aria-hidden="true"
          className="absolute bottom-3 right-3 flex h-6 w-6 items-center justify-center rounded-full bg-white text-black transition-transform duration-500 group-hover:rotate-45"
        >
          <ArrowUpRight className="h-3 w-3" />
        </span>
      </div>

      {body && (
        <p className="mt-2.5 max-w-[20rem] text-[12px] leading-relaxed text-charcoal/55">
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

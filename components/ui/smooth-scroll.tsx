"use client";

import Lenis from "lenis";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Momentum scrolling — the single biggest "feel" difference between a native
 * scrolling page and a Framer site. Lenis interpolates the scroll position so
 * every scroll-linked effect (parallax, the scroll-lit sentences) glides rather
 * than steps.
 *
 * Disabled entirely under `prefers-reduced-motion`, and it never hijacks
 * keyboard scrolling, focus rings or anchor links.
 */
let instance: Lenis | null = null;

export function SmoothScroll() {
  const pathname = usePathname();

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) return;

    const lenis = new Lenis({
      duration: 1.05,
      easing: (t) => 1 - Math.pow(1 - t, 3.2),
      wheelMultiplier: 1,
      touchMultiplier: 1.6,
      // Native touch scrolling is better on mobile; keep the momentum there
      // but never trap the page in a custom scroll container.
      syncTouch: false,
      // In-page anchor links (e.g. /services#obstetrics) glide instead of jump.
      anchors: { offset: -88 },
    });
    instance = lenis;

    let frame = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);

    const onChange = () => {
      if (mq.matches) {
        lenis.destroy();
        cancelAnimationFrame(frame);
      }
    };
    mq.addEventListener("change", onChange);

    return () => {
      mq.removeEventListener("change", onChange);
      cancelAnimationFrame(frame);
      lenis.destroy();
      instance = null;
    };
  }, []);

  // New route → start at the top, instantly, before the transition plays.
  // A hash target (e.g. /services#obstetrics) keeps its own scroll position.
  useEffect(() => {
    if (window.location.hash) return;
    if (instance) instance.scrollTo(0, { immediate: true });
    else window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [pathname]);

  return null;
}

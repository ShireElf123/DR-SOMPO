"use client";

import type Lenis from "lenis";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

let instance: Lenis | null = null;
let scrollLocked = false;
let previousOverflow = "";

/** Pause native scrolling too, even if the optional Lenis chunk has not loaded. */
export function lockScroll() {
  if (scrollLocked) return;
  scrollLocked = true;
  previousOverflow = document.body.style.overflow;
  instance?.stop();
  document.documentElement.classList.add("lenis-stopped");
  document.body.style.overflow = "hidden";
}

export function unlockScroll() {
  if (!scrollLocked) return;
  scrollLocked = false;
  instance?.start();
  document.documentElement.classList.remove("lenis-stopped");
  document.body.style.overflow = previousOverflow;
}

/**
 * Optional desktop-wheel enhancement. Phones and reduced-motion users keep
 * native scrolling and never download Lenis. Desktop loading waits for idle;
 * native scrolling remains usable if that download is slow or fails.
 */
export function SmoothScroll() {
  const pathname = usePathname();

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const pointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    let generation = 0;
    let frame = 0;
    let idle: number | undefined;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const stop = () => {
      // An in-flight import must not mount after cleanup or a preference change.
      generation += 1;
      cancelAnimationFrame(frame);
      if (idle !== undefined) window.cancelIdleCallback(idle);
      clearTimeout(timer);
      idle = undefined;
      timer = undefined;
      instance?.destroy();
      instance = null;
      if (scrollLocked) document.documentElement.classList.add("lenis-stopped");
    };

    const update = () => {
      stop();
      if (motion.matches || !pointer.matches) return;
      const current = generation;

      const start = () => {
        idle = undefined;
        timer = undefined;
        void import("lenis").then(({ default: Lenis }) => {
          if (current !== generation) return;
          const lenis = new Lenis({
            duration: 1.05,
            easing: (t) => 1 - Math.pow(1 - t, 3.2),
            wheelMultiplier: 1,
            syncTouch: false,
            anchors: { offset: -88 },
          });
          instance = lenis;
          if (scrollLocked) lenis.stop();

          const raf = (time: number) => {
            lenis.raf(time);
            frame = requestAnimationFrame(raf);
          };
          frame = requestAnimationFrame(raf);
        }).catch(() => {
          // Progressive enhancement only; never block native navigation/scroll.
        });
      };

      if ("requestIdleCallback" in window) {
        idle = window.requestIdleCallback(start, { timeout: 1500 });
      } else {
        timer = setTimeout(start, 0);
      }
    };

    update();
    motion.addEventListener("change", update);
    pointer.addEventListener("change", update);
    return () => {
      motion.removeEventListener("change", update);
      pointer.removeEventListener("change", update);
      stop();
    };
  }, []);

  // Keep deep links in control of their own position.
  useEffect(() => {
    if (window.location.hash) return;
    if (instance) instance.scrollTo(0, { immediate: true });
    else window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);

  return null;
}

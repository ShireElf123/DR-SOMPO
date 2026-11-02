"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Lightweight cursor companion. An outer ring trails the pointer with a spring
 * and an inner dot sits exactly on it; the ring swells and labels itself when
 * it crosses anything `[data-cursor="…"]`. Only mounted for fine pointers, so
 * touch and reduced-motion users never see it.
 */
export default function CursorCompanion() {
  const ring = useRef<HTMLDivElement>(null);
  const dot = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);
  const [active, setActive] = useState(false);

  // Pointer state is held in refs, not React state. Reporting it through
  // setState meant a render pass on every single pointermove, which is felt
  // most while scrolling and is the sort of thing that makes a page feel
  // heavier than its frame budget suggests. The two booleans are only pushed
  // into state when they actually change.
  const labelRef = useRef<string | null>(null);
  const visibleRef = useRef(false);
  const activeRef = useRef(false);

  useEffect(() => {
    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let ringX = targetX;
    let ringY = targetY;
    let frame = 0;

    const onMove = (event: PointerEvent) => {
      targetX = event.clientX;
      targetY = event.clientY;

      const el = (event.target as HTMLElement | null)?.closest<HTMLElement>(
        "[data-cursor]",
      );
      const nextLabel = el?.dataset.cursor || null;
      const nextActive = Boolean(
        el ||
          (event.target as HTMLElement | null)?.closest(
            "a, button, input, textarea, select, summary",
          ),
      );

      if (!visibleRef.current) {
        visibleRef.current = true;
        setVisible(true);
      }
      if (nextLabel !== labelRef.current) {
        labelRef.current = nextLabel;
        setLabel(nextLabel);
      }
      if (nextActive !== activeRef.current) {
        activeRef.current = nextActive;
        setActive(nextActive);
      }
    };

    const onLeave = () => {
      visibleRef.current = false;
      setVisible(false);
    };

    const tick = () => {
      ringX += (targetX - ringX) * 0.16;
      ringY += (targetY - ringY) * 0.16;
      if (ring.current) {
        ring.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
      }
      if (dot.current) {
        dot.current.style.transform = `translate3d(${targetX}px, ${targetY}px, 0) translate(-50%, -50%)`;
      }
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      data-cursor-companion
      className="pointer-events-none fixed inset-0 z-[95] hidden lg:block motion-reduce:!hidden"
    >
      <div
        ref={ring}
        className={cn(
          "absolute left-0 top-0 flex items-center justify-center rounded-full border text-[9px] font-medium uppercase tracking-[0.16em] transition-[width,height,background-color,border-color,opacity] duration-300 ease-out",
          visible ? "opacity-100" : "opacity-0",
          label
            ? "h-16 w-16 border-transparent bg-forest text-white"
            : active
              ? "h-10 w-10 border-forest/45 bg-forest/8 backdrop-blur-[2px]"
              : "h-7 w-7 border-forest/30 bg-transparent",
        )}
      >
        {label && (
          <span className="px-1 text-center leading-tight">{label}</span>
        )}
      </div>
      <div
        ref={dot}
        className={cn(
          "absolute left-0 top-0 h-1 w-1 rounded-full bg-forest transition-opacity duration-300",
          visible && !label ? "opacity-70" : "opacity-0",
        )}
      />
    </div>
  );
}

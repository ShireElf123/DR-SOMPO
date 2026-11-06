"use client";

import { m } from "framer-motion";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { cn } from "@/lib/utils";

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
        <m.span
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

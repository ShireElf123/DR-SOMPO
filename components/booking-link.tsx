"use client";

import { usePathname } from "next/navigation";
import type { ComponentProps } from "react";
import { scrollToElement } from "@/components/ui/smooth-scroll";

type Props = Omit<ComponentProps<"a">, "href"> & { service?: string };

/** Booking is a destination within Contact, not a repeat visit to its hero.
 * Keep the current draft/query on same-page clicks; native links still work
 * before hydration, and modified clicks retain normal browser behaviour. */
export function BookingLink({ service, onClick, ...props }: Props) {
  const inPage = usePathname() === "/contact" && !service;
  const href = inPage
    ? "#appointment-request"
    : `/contact${service ? `?service=${encodeURIComponent(service)}` : ""}#appointment-request`;

  return (
    <a
      {...props}
      href={href}
      onClick={(event) => {
        // Do not let Lenis follow a hash in the old tab on a modified click.
        event.stopPropagation();
        onClick?.(event);
        if (event.defaultPrevented || !inPage || event.button !== 0 ||
          event.metaKey || event.ctrlKey || event.shiftKey || event.altKey ||
          (event.currentTarget.target && event.currentTarget.target !== "_self")) return;
        event.preventDefault();
        // Let a mobile menu close/unlock and restore its trigger focus first.
        requestAnimationFrame(() => {
          const target = document.getElementById("appointment-request");
          if (target) scrollToElement(target);
        });
      }}
    />
  );
}

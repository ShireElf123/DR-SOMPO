"use client";

import { Marquee } from "@/components/ui/motion";

const items = [
  "Obstetrics & Gynaecology",
  "Adolescence to menopause",
  "English & French",
  "Fertility & cervical health",
  "HPV prevention & patient education",
  "011 842 7651",
  "Primrose, Germiston",
];

/**
 * The slim gradient announcement bar. Pale lime to fern, dark green type,
 * floaty rounded bar rather than a full-bleed strip — exactly the reference's
 * opening gesture.
 */
export function Ticker() {
  return (
    <div className="bg-white px-3 pt-[calc(0.35rem+env(safe-area-inset-top))] pb-1.5 sm:px-4 sm:pb-2">
      <div className="mx-auto w-full max-w-[1180px] overflow-hidden rounded-md bg-[linear-gradient(90deg,#d8f2a8,#cfe3a6_28%,#3f9a78)]">
        <Marquee trackClassName="py-1.5 text-[11px] font-medium text-[#10382b]">
          {items.map((item) => (
            <span key={item} className="mx-6 inline-block">
              {item}
              <span aria-hidden="true" className="ml-6 opacity-50">
                •
              </span>
            </span>
          ))}
        </Marquee>
      </div>
    </div>
  );
}

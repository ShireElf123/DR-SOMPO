"use client";

import { Marquee } from "@/components/ui/motion";

const items = [
  "Obstetrics & Gynaecology",
  "English & French",
  "Life Roseacres Hospital",
  "Fertility & cervical health",
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
    <div className="px-3 pt-3 sm:px-4">
      <div className="mx-auto w-full max-w-[1180px] overflow-hidden rounded-lg bg-[linear-gradient(90deg,#d8f2a8,#cfe3a6_28%,#3f9a78)]">
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

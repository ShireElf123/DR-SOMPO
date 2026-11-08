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
 * The slim announcement ribbon. Soft rosewater-to-champagne silk with crisp
 * plum-charcoal type and delicate blossom marks — airy from the very first pixel.
 */
export function Ticker() {
  return (
    <div className="bg-cream px-3 pt-[calc(0.35rem+env(safe-area-inset-top))] pb-1.5 sm:px-4 sm:pb-2">
      <div className="mx-auto w-full max-w-[1180px] overflow-hidden rounded-2xl border-hairline border-ember/15 ticker-gradient">
        <Marquee label="Practice announcements" trackClassName="py-1.5 text-[11px] font-medium tracking-[0.01em] text-ink">
          {items.map((item) => (
            <span key={item} className="mx-6 inline-block">
              {item}
              <span aria-hidden="true" className="ml-6 text-[9px] text-ember/75">
                ✦
              </span>
            </span>
          ))}
        </Marquee>
      </div>
    </div>
  );
}

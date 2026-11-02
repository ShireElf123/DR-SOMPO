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
 * The slim gradient announcement bar. Blush to apricot to ember, charcoal type,
 * floaty rounded bar rather than a full-bleed strip — the reference's opening
 * gesture, re-skinned so the darkest stop still clears AA with charcoal.
 */
export function Ticker() {
  return (
    <div className="bg-cream px-3 pt-[calc(0.35rem+env(safe-area-inset-top))] pb-1.5 sm:px-4 sm:pb-2">
      <div className="mx-auto w-full max-w-[1180px] overflow-hidden rounded-md ticker-gradient">
        <Marquee label="Practice announcements" trackClassName="py-1.5 text-[11px] font-semibold text-ink">
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

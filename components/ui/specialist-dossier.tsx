import { Stethoscope } from "lucide-react";
import { practice } from "@/lib/practice";

const rows = [
  ["Fellowship", "FCOG (SA) · College of O&G"],
  ["Academic", "MMed (O&G) · MBChB · Wits"],
  ["Chambers", `${practice.hospital} · Room 5`],
  ["Languages", "English & Français"],
] as const;

/**
 * Engraved Soft Blossom & Pearl specialist chambers plaque.
 * Pure Server Component (0 B client JS) with verified academic lineage,
 * hospital sessional chambers and a physician stethoscope seal.
 */
export function SpecialistChambersCard({
  className = "",
}: {
  className?: string;
}) {
  return (
    <div
      data-specialist-dossier
      className={`arch-frame bg-blush/85 p-2 ring-1 ring-ember/15 ${className}`}
    >
      <div className="arch-frame chambers-plaque relative flex flex-col items-center justify-between overflow-hidden px-5 pb-6 pt-10 text-center ring-1 ring-ember/15 sm:px-8 sm:pb-7 sm:pt-12">
        <div className="flex flex-col items-center">
          <span
            aria-hidden="true"
            className="flex h-13 w-13 items-center justify-center rounded-full bg-cream text-ember-deep shadow-soft ring-1 ring-ember/25"
          >
            <Stethoscope className="h-6 w-6 stroke-[1.4]" />
          </span>

          <p className="mt-3.5 text-[10px] font-medium uppercase tracking-[0.18em] text-ember-deep">
            Specialist Practice Register
          </p>

          <p className="mt-2 font-display text-[clamp(1.65rem,2.8vw,2.15rem)] leading-[1.04] tracking-[-0.02em] text-ink">
            {practice.doctorName}
          </p>
          <p className="mt-1 font-display text-[1.05rem] italic leading-snug text-ember-deep">
            {practice.title}
          </p>
          <p className="mt-1 text-[10px] uppercase tracking-[0.16em] text-ink-muted">
            {practice.entity}
          </p>
        </div>

        <dl className="mt-5 w-full divide-y divide-ember/15 border-y border-ember/15 text-left">
          {rows.map(([label, value]) => (
            <div
              key={label}
              className="flex items-baseline justify-between gap-3 py-2.5"
            >
              <dt className="text-[10px] uppercase tracking-[0.15em] text-ink-muted">
                {label}
              </dt>
              <dd className="text-right text-[11.5px] font-medium text-ink">
                {value}
              </dd>
            </div>
          ))}
        </dl>

        <p className="mt-4 text-[9.5px] uppercase tracking-[0.15em] text-ink-soft">
          Obstetrics · Gynaecology · Fertility · Laparoscopy
        </p>
      </div>
    </div>
  );
}

import { brand } from "@/lib/practice";

/**
 * The life-stage band. Three stages the practice names in its own copy, set as
 * an editorial list rather than a card row: a serif index, a hairline that an
 * ember rail draws over as you scroll, and a sticky statement on desktop.
 */
const stages = [
  {
    index: "01",
    title: "A first teenage consultation",
    body: "The same specialist, in the same rooms, from the very first visit.",
  },
  {
    index: "02",
    title: "Pregnancy and childbirth",
    body: "Antenatal care and delivery at Life Roseacres Hospital, Primrose.",
  },
  {
    index: "03",
    title: "Menopause and beyond",
    body: "The same standard of care, in English or French, for as long as it is needed.",
  },
];

export function Stages() {
  return (
    <section aria-labelledby="stages-heading" className="stages-band mt-16 sm:mt-20">
      <div className="shell grid gap-10 py-16 sm:py-20 lg:grid-cols-[0.82fr_1.18fr] lg:gap-20 lg:py-24">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <p className="flex items-center gap-2.5 text-[10px] uppercase tracking-[0.2em] text-ink-muted">
            <span className="h-1.5 w-1.5 rotate-45 rounded-[1px] bg-ember" aria-hidden="true" />
            Care across a lifetime
          </p>
          <h2
            id="stages-heading"
            className="mt-5 font-display text-[clamp(2.5rem,5vw,4.2rem)] leading-[0.94] tracking-[-0.02em]"
          >
            Every stage,
            <br />
            <span className="italic text-ember">every journey.</span>
          </h2>
          <p className="mt-5 max-w-[23rem] text-[13px] leading-[1.7] text-ink-soft">
            {brand.scope} One specialist, from a first teenage consultation to
            menopause, with the same standard of care throughout.
          </p>
        </div>

        <ol className="stages-list">
          {stages.map((stage) => (
            <li key={stage.index} className="stage-row">
              <span
                className="font-display text-[clamp(1.5rem,2.2vw,2rem)] italic leading-none text-ember tabular-nums"
                aria-hidden="true"
              >
                {stage.index}
              </span>
              <div>
                <h3 className="text-[18px] font-medium tracking-[-0.01em] text-ink">
                  {stage.title}
                </h3>
                <p className="mt-1.5 max-w-[30rem] text-[13px] leading-[1.7] text-ink-soft">
                  {stage.body}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

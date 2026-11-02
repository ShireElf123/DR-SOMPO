import Image from "@/components/ui/practice-image";
import { journey } from "@/lib/practice";
import type { CSSProperties } from "react";

/** Ordered reading steps, not fake buttons or unapproved booking actions.
 * Native scroll timelines progressively enhance the static server markup. */
export function Journey() {
  return (
    <section id="journey" className="sec" aria-labelledby="journey-heading">
      <div className="shell">
        <p className="mx-auto mb-10 max-w-[38rem] text-center text-[clamp(1.15rem,2.2vw,1.4rem)] leading-[1.35] tracking-[-0.02em] text-ink">
          Your path to care{" "}
          <span aria-hidden="true" className="mr-1 inline-block h-[1.05em] w-[1.05em] translate-y-[0.12em] overflow-hidden rounded-full bg-peach align-baseline ring-2 ring-cream/80">
            <Image src="/images/consultation.jpg" alt="" width={40} height={40} className="h-full w-full object-cover" />
          </span>
          — three simple steps, from the first phone call to follow-up.
        </p>

        <h2 id="journey-heading" className="sr-only">How it works</h2>

        <ol className="journey-list mx-auto max-w-4xl" role="list">
          {journey.map((step, index) => (
            <li key={step.step} className="journey-step" style={{ "--step": index } as CSSProperties}>
              {index < journey.length - 1 && <span aria-hidden="true" className="journey-connector" />}
              <span aria-hidden="true" className="journey-number flex h-7 w-7 items-center justify-center rounded-full border border-ember/20 bg-white text-[10.5px] font-medium text-ink">
                {step.step}
              </span>
              <div className="journey-step-reveal h-full">
                <article
                  tabIndex={0}
                  aria-labelledby={`journey-title-${step.step}`}
                  aria-describedby={`journey-body-${step.step} journey-meta-${step.step}`}
                  className="journey-card flex h-full flex-col overflow-hidden rounded-[1.25rem] border-hairline border-charcoal/10 bg-white"
                >
                  <div className="photo-depth relative aspect-[4/3] overflow-hidden bg-peach">
                    <Image
                      src={
                        step.step === "01"
                          ? "/images/consultation.jpg"
                          : step.step === "02"
                            ? "/images/portrait-somp-card.jpg"
                            : "/images/patient-quiet.jpg"
                      }
                      alt={step.title}
                      fill
                      sizes="(max-width: 639px) 85vw, (max-width: 1023px) 30vw, 288px"
                      className="journey-photo object-cover object-[center_20%]"
                    />
                  </div>

                  <div className="flex flex-1 flex-col p-4">
                    <h3 id={`journey-title-${step.step}`} className="text-[13.5px] font-medium tracking-[-0.01em] text-ink">
                      {step.title}
                    </h3>
                    <p id={`journey-body-${step.step}`} className="mt-1.5 flex-1 text-[12px] leading-relaxed text-ink-soft">
                      {step.body}
                    </p>
                    <p id={`journey-meta-${step.step}`} className="mt-3 text-[9.5px] uppercase tracking-[0.14em] text-ink-soft">
                      {step.meta}
                    </p>
                  </div>
                </article>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

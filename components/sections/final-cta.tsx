import { BookingLink } from "@/components/booking-link";
import { ArrowUpRight, Phone } from "lucide-react";
import { ParallaxImage, Reveal, WordsIn } from "@/components/ui/motion";
import { BotanicalSprig } from "@/components/ui/botanical";
import { practice } from "@/lib/practice";

/**
 * Closing invitation. Built as a full-width photographic panel with the call to
 * action sitting on the image — the last thing a visitor sees should have a
 * human face or place on it, not another white gap.
 */
export function FinalCta() {
  return (
    <section className="bg-cream pb-16 pt-8 sm:pb-20" aria-labelledby="cta-heading">
      <div className="shell">
        <Reveal y={22}>
          <div className="relative overflow-hidden rounded-[1.5rem] bg-cream sm:rounded-[1.75rem]">
            {/* On phones the photograph is a band above the invitation instead
                of a backdrop behind it: a request this large needs a glass card
                the width of the screen, and that card covered 74% of the
                corridor. From sm up the copy sits over the frame again. */}
            <div className="relative h-[12rem] w-full overflow-hidden sm:absolute sm:inset-0 sm:h-auto">
              <ParallaxImage
                src="/images/corridor.jpg"
                alt="The corridor leading to the consulting rooms"
                strength={28}
                sizes="(max-width: 1180px) 96vw, 1180px"
                className="h-full w-full sm:absolute sm:inset-0"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-cream to-transparent sm:hidden" />
            </div>

            <div className="relative px-4 pb-9 pt-5 text-center sm:px-8 sm:py-16">
              <div className="glass mx-auto max-w-[40rem] rounded-[1.5rem] px-5 py-8 text-ink max-sm:border-0 max-sm:bg-transparent max-sm:px-1 max-sm:shadow-none sm:px-10 sm:py-14">
                <BotanicalSprig className="mx-auto mb-3" />
                <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-ember">
                  New patients welcome
                </p>
                <h2
                  id="cta-heading"
                  className="mx-auto mt-3.5 max-w-[32rem] text-[clamp(2rem,4.5vw,3.25rem)] leading-[1.0]"
                >
                  <WordsIn text="Your health deserves" />{" "}
                  <span className="italic text-ember">
                    <WordsIn text="specialist attention." delay={0.2} />
                  </span>
                </h2>

                <div className="mt-8 flex flex-wrap items-center justify-center gap-2.5">
                  <BookingLink className="btn" data-cursor="Book">
                    Book an appointment
                    <i aria-hidden="true">
                      <ArrowUpRight className="h-3 w-3" />
                    </i>
                  </BookingLink>
                  <a href={practice.phoneHref} className="btn btn-light" data-cursor="Call">
                    Call {practice.phone}
                    <i aria-hidden="true">
                      <Phone className="h-3 w-3" />
                    </i>
                  </a>
                </div>

                <p className="mt-5 text-[11px] text-ink-soft">
                  Enquiries are not confirmed appointments · Not for emergencies
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

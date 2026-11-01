import type { Metadata } from "next";
import { Hero } from "@/components/sections/hero";
import { Services } from "@/components/sections/services";
import { Journey } from "@/components/sections/journey";
import { BentoBand } from "@/components/sections/bento";
import { AboutTeaser, ResearchTeaser, FaqTeaser, ContactBand } from "@/components/sections/teasers";
import { FinalCta } from "@/components/sections/final-cta";
import { Marquee } from "@/components/ui/motion";

export const metadata: Metadata = {
  title: "Specialist Obstetrician & Gynaecologist in Primrose, Germiston",
  description:
    "Women's health, every stage, every journey. Obstetric, gynaecological, fertility and surgical care with Dr CM Ngwey-Sompo at Life Roseacres Hospital, Primrose, Germiston.",
};

export default function HomePage() {
  return (
    <>
      <Hero />
      {/* Credential band — the "press bar" beat Framer sites use to break up
          the hero and the first card section. */}
      <section aria-label="Professional affiliations" className="bg-white py-6 sm:py-8">
        <div className="shell">
          <div className="flex items-center gap-6 overflow-hidden border-y border-charcoal/10 py-3">
            <span className="hidden shrink-0 text-[9.5px] uppercase tracking-[0.18em] text-ink-muted sm:block">
              Registered &amp; affiliated
            </span>
            <div className="min-w-0 flex-1 opacity-70">
              <Marquee trackClassName="text-[13px] font-medium tracking-[0.06em] text-charcoal">
                {["HPCSA", "SASOG", "CMSA", "SAMA", "FIGO 2025", "Wits", "Life Roseacres"].map(
                  (item) => (
                    <span key={item} className="mx-7 inline-block whitespace-nowrap">
                      {item}
                    </span>
                  ),
                )}
              </Marquee>
            </div>
          </div>
        </div>
      </section>
      <Services />
      <BentoBand />
      <Journey />
      <AboutTeaser />
      <ResearchTeaser />
      <FaqTeaser />
      <ContactBand />
      <FinalCta />
    </>
  );
}

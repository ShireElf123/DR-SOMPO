import type { Metadata } from "next";
import { Hero } from "@/components/sections/hero";
import { Services } from "@/components/sections/services";
import { Journey } from "@/components/sections/journey";
import { AboutTeaser, ResearchTeaser, FaqTeaser, ContactBand } from "@/components/sections/teasers";
import { FinalCta } from "@/components/sections/final-cta";

export const metadata: Metadata = {
  title: "Specialist Obstetrician & Gynaecologist in Primrose, Germiston",
  description:
    "Women's health, every stage, every journey. Obstetric, gynaecological, fertility and surgical care with Dr CM Ngwey-Sompo at Life Roseacres Hospital, Primrose, Germiston.",
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <Services />
      <Journey />
      <AboutTeaser />
      <ResearchTeaser />
      <FaqTeaser />
      <ContactBand />
      <FinalCta />
    </>
  );
}

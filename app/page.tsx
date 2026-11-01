import type { Metadata } from "next";
import { Hero } from "@/components/sections/hero";
import { Services } from "@/components/sections/services";
import { Approach } from "@/components/sections/approach";
import { Journey } from "@/components/sections/journey";
import { Fertility } from "@/components/sections/fertility";
import { About } from "@/components/sections/about";
import { Care } from "@/components/sections/care";
import { Research } from "@/components/sections/research";
import { Faqs } from "@/components/sections/faqs";
import { Contact } from "@/components/sections/contact";
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
      <Approach />
      <Journey />
      <Fertility />
      <About />
      <Care />
      <Research />
      <Faqs />
      <Contact />
      <FinalCta />
    </>
  );
}

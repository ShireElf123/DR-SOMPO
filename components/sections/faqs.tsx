import Image from "@/components/ui/practice-image";
import { Reveal, WordsIn } from "@/components/ui/motion";
import { faqs, practice } from "@/lib/practice";
import { FaqList } from "@/components/ui/faq-list";

export function Faqs() {
  return (
    <section id="faqs" className="sec sec-tint" aria-labelledby="faqs-heading">
      <div className="shell">
        <div className="mb-9 grid items-center gap-6 sm:grid-cols-[1fr_auto] sm:gap-10">
          <div className="text-center sm:text-left">
            <span className="tag">Patient information</span>
            <h2 id="faqs-heading" className="text-[clamp(1.7rem,3.4vw,2.4rem)]">
              <WordsIn text="Questions, answered." />
            </h2>
            <p className="mx-auto mt-3 max-w-md text-[13px] leading-relaxed text-ink-soft sm:mx-0">
              If something is not covered here, the practice would rather you
              asked than wondered.
            </p>
          </div>
          <Reveal y={18} className="mx-auto w-full max-w-[16rem] sm:mx-0">
            <div className="relative aspect-[16/11] overflow-hidden rounded-[1.15rem] bg-sage">
              <Image
                src="/images/waiting-room.jpg"
                alt="The practice waiting area"
                fill
                sizes="(max-width: 640px) 80vw, 16rem"
                className="object-cover"
              />
            </div>
          </Reveal>
        </div>

        <div className="mx-auto max-w-[46rem]">
          <FaqList items={faqs} prefix="patient-faq" openFirst />

          <p className="mt-6 text-center text-[12px] text-ink-soft">
            Still unsure? Call{" "}
            <a
              href={practice.phoneHref}
              className="font-medium text-forest underline decoration-forest/25 underline-offset-4"
            >
              {practice.phone}
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}

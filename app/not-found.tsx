import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { practice } from "@/lib/practice";

export const metadata = {
  title: "Page not found",
};

export default function NotFound() {
  return (
    <section className="shell flex min-h-[70vh] flex-col items-center justify-center py-24 text-center">
      <span className="eyebrow">404</span>
      <h1 className="display mt-6 max-w-lg text-[clamp(2rem,5vw,3rem)] text-forest">
        We couldn&apos;t find that page.
      </h1>
      <p className="mt-4 max-w-md text-[0.9375rem] leading-relaxed text-charcoal/68">
        The link may be out of date. You can return to the homepage, or contact
        the practice directly to enquire about an appointment.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link href="/" className="btn btn-primary group">
          Back to homepage
          <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:rotate-45" />
        </Link>
        <a href={practice.phoneHref} className="btn btn-ghost">
          Call {practice.phone}
        </a>
      </div>
    </section>
  );
}

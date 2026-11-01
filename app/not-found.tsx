import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { practice } from "@/lib/practice";

export const metadata = {
  title: "Page not found",
};

export default function NotFound() {
  return (
    <section className="shell flex min-h-[70vh] flex-col items-center justify-center py-24 text-center">
      <span className="tag">404</span>
      <h1 className="mt-5 max-w-lg text-[clamp(2rem,5vw,3rem)] leading-[1.05] text-charcoal">
        We couldn&apos;t find that page.
      </h1>
      <p className="mt-4 max-w-md text-[13.5px] leading-relaxed text-charcoal/60">
        The link may be out of date. You can return to the homepage, or contact
        the practice directly to enquire about an appointment.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-2.5">
        <Link href="/" className="btn">
          Back to homepage
          <i aria-hidden="true">
            <ArrowUpRight className="h-3 w-3" />
          </i>
        </Link>
        <a
          href={practice.phoneHref}
          className="btn btn-light border border-charcoal/12 shadow-none"
        >
          Call {practice.phone}
          <i aria-hidden="true">
            <ArrowUpRight className="h-3 w-3" />
          </i>
        </a>
      </div>
    </section>
  );
}

import { Plus } from "lucide-react";

/** Native disclosure works with touch, keyboard, screen readers and without JS. */
export function FaqList({
  items,
  prefix,
  openFirst = false,
}: {
  items: { q: string; a: string }[];
  prefix: string;
  openFirst?: boolean;
}) {
  return (
    <ul className="border-t border-charcoal/12" data-faq-list>
      {items.map((faq, index) => (
        <li key={faq.q} className="border-b border-charcoal/12">
          <details className="group" open={openFirst && index === 0}>
            <summary
              id={`${prefix}-${index}`}
              className="flex cursor-pointer list-none items-center justify-between gap-5 rounded-lg py-4 text-left [&::-webkit-details-marker]:hidden"
            >
              <span className="text-[14.5px] font-medium tracking-[-0.01em] text-charcoal">
                {faq.q}
              </span>
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-charcoal/20 text-forest transition-transform duration-300 group-open:rotate-45 group-open:border-forest group-open:bg-forest group-open:text-white">
                <Plus className="h-3.5 w-3.5" aria-hidden="true" />
              </span>
            </summary>
            <p className="max-w-[38rem] pb-5 text-[13px] leading-relaxed text-ink-soft">
              {faq.a}
            </p>
          </details>
        </li>
      ))}
    </ul>
  );
}

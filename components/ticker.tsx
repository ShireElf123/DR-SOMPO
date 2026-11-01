import { ticker } from "@/lib/practice";

/**
 * Announcement marquee — the slim, always-moving strip at the very top of the
 * page. Duplicated content plus a 50% translate keeps the loop seamless; the
 * animation pauses on hover and is disabled entirely under reduced motion.
 */
export function Ticker() {
  const items = [...ticker, ...ticker];

  return (
    <div className="relative overflow-hidden border-b border-forest/10 bg-forest text-ivory">
      <div className="marquee-group relative flex overflow-hidden">
        <div className="marquee-track flex shrink-0 items-center gap-10 whitespace-nowrap py-2.5 pr-10 motion-reduce:animate-none">
          {items.map((item, i) => (
            <span
              key={i}
              className="flex items-center gap-10 text-[0.6875rem] font-medium uppercase tracking-[0.16em] text-sage/85"
            >
              {item}
              <span aria-hidden="true" className="text-gold/70">
                &#10022;
              </span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

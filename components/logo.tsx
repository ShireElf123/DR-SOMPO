import { cn } from "@/lib/utils";

/**
 * Practice mark: a four-petal bloom built from the brand's obstetric motif —
 * a soft, non-cliché symbol that works equally well as a favicon.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
      className={cn("h-8 w-8", className)}
    >
      <circle cx="16" cy="16" r="15" stroke="currentColor" strokeOpacity="0.18" />
      <path
        d="M16 6.5c2.6 2.1 4.1 4.6 4.1 7.2 0 1.3-.4 2.3-1.1 3.1"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <path
        d="M25.5 16c-2.1 2.6-4.6 4.1-7.2 4.1-1.3 0-2.3-.4-3.1-1.1"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <path
        d="M16 25.5c-2.6-2.1-4.1-4.6-4.1-7.2 0-1.3.4-2.3 1.1-3.1"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <path
        d="M6.5 16c2.1-2.6 4.6-4.1 7.2-4.1 1.3 0 2.3.4 3.1 1.1"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <circle cx="16" cy="16" r="2.1" fill="currentColor" />
    </svg>
  );
}

export function Logo({
  className,
  tone = "dark",
  showSub = true,
}: {
  className?: string;
  tone?: "dark" | "light";
  showSub?: boolean;
}) {
  return (
    <a
      href="#top"
      className={cn(
        "group inline-flex items-center gap-2.5",
        tone === "light" ? "text-ivory" : "text-forest",
        className,
      )}
      aria-label="Dr CM Ngwey-Sompo Inc. — home"
    >
      <LogoMark className="h-8 w-8 transition-transform duration-500 group-hover:rotate-45" />
      <span className="flex flex-col leading-none">
        <span className="text-[1.0625rem] font-medium tracking-[-0.03em]">
          Dr Ngwey-Sompo
        </span>
        {showSub && (
          <span
            className={cn(
              "mt-1 text-[0.5625rem] font-medium uppercase tracking-[0.18em]",
              tone === "light" ? "text-sage/75" : "text-forest/62",
            )}
          >
            Obstetrics &amp; Gynaecology
          </span>
        )}
      </span>
    </a>
  );
}

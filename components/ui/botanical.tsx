import { cn } from "@/lib/utils";

/**
 * Fine-line botanical stationery marks. Pure Server Components — zero client
 * JavaScript — used sparingly to soften editorial breaks and silk feature cards.
 */
export function BotanicalSprig({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 88 22"
      fill="none"
      className={cn("h-5 w-16 text-ember/75", className)}
    >
      <path
        d="M8 15C20 15 28 11 44 11C60 11 68 15 80 15"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
      />
      <path
        d="M44 11C41.5 6.5 41.8 3 44 1.5C46.2 3 46.5 6.5 44 11Z"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinejoin="round"
      />
      <path
        d="M32 12.2C27.5 9.2 25.5 6 26.8 3.8C29.5 4.4 31.8 7.5 32 12.2Z"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinejoin="round"
      />
      <path
        d="M56 12.2C60.5 9.2 62.5 6 61.2 3.8C58.5 4.4 56.2 7.5 56 12.2Z"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinejoin="round"
      />
      <circle cx="18" cy="14.2" r="1.2" fill="currentColor" />
      <circle cx="70" cy="14.2" r="1.2" fill="currentColor" />
    </svg>
  );
}

export function BotanicalBloom({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 180 180"
      fill="none"
      className={cn("pointer-events-none select-none text-ember/18", className)}
    >
      <path
        d="M148 168C136 126 112 94 74 66"
        stroke="currentColor"
        strokeWidth="1.15"
        strokeLinecap="round"
      />
      <path
        d="M74 66C52 56 38 36 42 16C62 18 78 36 74 66Z"
        stroke="currentColor"
        strokeWidth="1.15"
        strokeLinejoin="round"
      />
      <path
        d="M74 66C66 42 74 22 92 14C102 32 94 52 74 66Z"
        stroke="currentColor"
        strokeWidth="1.15"
        strokeLinejoin="round"
      />
      <path
        d="M74 66C96 50 118 52 132 68C116 82 94 80 74 66Z"
        stroke="currentColor"
        strokeWidth="1.15"
        strokeLinejoin="round"
      />
      <path
        d="M106 100C84 102 68 92 62 76C80 72 96 82 106 100Z"
        stroke="currentColor"
        strokeWidth="1.15"
        strokeLinejoin="round"
      />
      <path
        d="M124 126C136 108 154 98 170 102C164 118 146 128 124 126Z"
        stroke="currentColor"
        strokeWidth="1.15"
        strokeLinejoin="round"
      />
    </svg>
  );
}

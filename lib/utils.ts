import { extendTailwindMerge } from "tailwind-merge";

/**
 * Tailwind class conflict resolution.
 *
 * The design system registers custom colour tokens (ink, ink-soft, ink-muted,
 * cream, peach, apricot, ember …). Without teaching tailwind-merge about them it treats
 * `text-ink-soft` as an arbitrary unknown class and would not let a later
 * `text-white` win — so the theme is declared here explicitly.
 */
const merge = extendTailwindMerge({
  extend: {
    // Custom width utilities must not be mistaken for colours and discarded
    // when a surface also supplies border-charcoal/8 (or a filtered colour).
    classGroups: {
      "border-w": ["border-hairline"],
      "border-w-t": ["border-t-hairline"],
      "border-w-b": ["border-b-hairline"],
      "border-w-l": ["border-l-hairline"],
      "border-w-y": ["border-y-hairline"],
      "divide-y": ["divide-y-hairline"],
    },
    theme: {
      color: [
        "cream",
        "blush",
        "peach",
        "apricot",
        "tangerine",
        "ember",
        "charcoal",
        "ink",
        "ink-soft",
        "ink-muted",
      ],
      radius: ["xl2", "xl3"],
    },
  },
});

/**
 * Merge conditional class names, with the **last one winning** when two
 * utilities touch the same property. This matters: components compose a default
 * `className` with a passed-in override (`relative overflow-hidden` +
 * `absolute inset-0`), and a naive join silently produces both — which is how a
 * photo ends up with zero height and reads as a blank plate.
 */
export function cn(...classes: (string | false | null | undefined)[]) {
  return merge(classes.filter(Boolean).join(" "));
}

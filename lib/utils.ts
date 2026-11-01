import { extendTailwindMerge } from "tailwind-merge";

/**
 * Tailwind class conflict resolution.
 *
 * The design system registers custom colour tokens (ink, ink-soft, ink-muted,
 * forest, sage …). Without teaching tailwind-merge about them it treats
 * `text-ink-soft` as an arbitrary unknown class and would not let a later
 * `text-white` win — so the theme is declared here explicitly.
 */
const merge = extendTailwindMerge({
  extend: {
    theme: {
      color: [
        "forest",
        "forest-deep",
        "forest-ink",
        "sage",
        "mint",
        "ivory",
        "charcoal",
        "gold",
        "lime",
        "fern",
        "clay",
        "sand",
        "mist",
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

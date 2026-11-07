# Rosewater: the pink-and-white palette

A first pass at the direction the client asked for: "more feminine, pink and
white", while keeping the peach and orange she also loves somewhere in the
system. This is the palette currently running on the pink build; it is a token
swap over the warm release, not a rewrite, so every layout, every measured
contrast pairing and every interaction still holds.

## The decision

Pink and white carry the page. Peach stays — but as a **flat accent and as the
frame colour behind photographs**, never as a field that gradients into pink.

That last part is the one thing worth knowing before anyone rebuilds this:
pink blended toward peach passes through a salmon midpoint that reads like
skin, and at full-bleed width it looks like a bruise rather than a brand. On
the first pass the research/footer wash ran `#f6aac0 → #fac5d2 → #f7cabd`; the
peach endpoint turned the whole band fleshy. The ramp is now rose to the end
(`#f6a6c0 → #f9c4d3 → #fbdae5`) and peach appears only as adjacent flat
surfaces — a peach photograph frame against a rose field — where the eye reads
two intentions instead of a muddy third.

## Tokens

| token | hex | role | contrast |
|---|---|---|---|
| `cream` | `#FFFBFC` | porcelain page + card wash | 15.4:1 with ink |
| `blush` | `#FCEAF1` | pale rose callout bands | 13.9:1 with ink |
| `petal` | `#F9D5E1` | the pink step between blush and rose | 11.9:1 |
| `peach` | `#FAD8C6` | **pale peach** — photograph frames, chips | 11.9:1 |
| `rose` | `#F3B3C6` | dusty rose feature wash | 9.4:1 |
| `apricot` | `#F7B49F` | peach feature surface, used sparingly | 9.1:1 |
| `tangerine` | `#F17FA2` | hover / mid stop | 6.3:1 |
| `ember` | `#E8678C` | the action stop (buttons) | 5.1:1 with charcoal |
| `ember-deep` | `#6E2138` | wine depth stop | 10.6:1 with cream |
| `espresso` | `#2B161F` | plum near-black for the two deep bands | 16.5:1 with cream |
| `ink` | `#2B1F24` | body type | 15.8:1 on white |
| `ink-soft` | `#5C4A52` | secondary type | 7.4:1 on blush |
| `ink-muted` | `#6B5860` | captions, labels | 5.9:1 on blush |

The ramp keeps the *lightness structure* of the warm release within about two
L\* per step, which is why the measured type and action contrast survive the
hue change: charcoal on the action stop was 4.75:1 in orange, it is 5.1:1 in
rose; cream on the depth stop was 8.9:1, it is 10.6:1.

## What the reference palettes said

- **Cherry Blossom Minimal** — `#F6C2D0`, `#FFE7EF`, `#FFFFFF`, `#F2F2F2`,
  `#4A4A4A` — the "clean, light, contemporary" blush scheme this borrows its
  white-page-plus-pink-steps structure from.
- **Modern Monochrome Pink** — `#F7CAD3`, `#F3A8B6`, `#E07A95`, `#B14D6C`,
  `#5A1F35` — the source of the deeper action and depth stops.
- **Peach Blush Sunrise / Beautiful Blush** — `#F7B7A3`, `#F9C7B6`, `#FFD7C8`,
  `#F2A7A1`, `#FFF1EA` — the reference for keeping peach adjacent to blush
  rather than blended through it.
- The general guidance across cosmetic and wellness palette round-ups is that
  blush tones want a white or near-white page with deeper berries reserved for
  type and one action colour; the mistake to avoid is a mid-pink field, which
  reads as candy at full-bleed width.

## Still to decide

- **The photographs.** They were white-balanced for a warm page. Against pink
  the terracotta and honey-wood rooms are the loudest thing on screen —
  `corridor`, `hospital-exterior`, `research-desk`, `antenatal`,
  `screening-room`, `surgery`, `cervical-research` and `patient-quiet` all sit
  in the orange band for 46–67% of their pixels. Either those walls are
  repainted in the files (blush/cream, same composition, same people) or the
  page stays warm. Grading them pink is the one answer that is wrong: it is
  exactly the filter the client asked to have removed.
- The palette-gate tests (`warm-theme.spec.ts`, `photography-palette.spec.ts`)
  still assert the orange tokens and need rewriting against these numbers.

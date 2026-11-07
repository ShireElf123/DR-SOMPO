# Rosewater: the pink-and-white palette

The brief: the client wants the site more feminine, and named pink and white —
while still liking peach and orange. This is the palette that came out of doing
the research properly rather than picking swatches that photograph well.

## What the research actually says

1. **Pink is a differentiator in healthcare, not a default.** 99designs analysed
   the palettes of over 900 healthcare logos: blue appears in roughly 85% of
   industry-leading providers, while pink sits at the bottom with brown, purple
   and yellow. For a women's practice that is an advantage — but it only works
   if the rest of the system carries the credibility pink does not.
2. **Healthcare brands are read as subdued, serious, mature.** The same study
   maps brand personality to colour, and the traits providers say they want
   land on restrained, low-chroma palettes. Loud pink reads as retail.
3. **Pink suits gynaecology specifically.** Specialty colour guidance for
   gynaecology and maternity converges on pink and mauve for nurturing and
   empathy; light pink is described as successful in medical branding while
   dark pink as a large field is not.
4. **Depth, not saturation, is what makes pink read expensive.** Practitioner
   branding write-ups for private practices describe the winning move as a
   *deep, muted* pink anchored by neutrals — "sophisticated and emotionally
   rich" rather than "overly feminine".

Put together: keep every large surface white or barely blush, and put the pink
in **one deep, desaturated place** where it does structural work.

## The palette

| token | hex | role | contrast |
|---|---|---|---|
| `cream` | `#FFFCFC` | porcelain page and card wash | 15.5:1 with ink |
| `blush` | `#F9E2EA` | banded sections, callouts | 13.0:1 with ink |
| `petal` | `#F6D3DE` | the pink step between blush and rose | 11.6:1 |
| `peach` | `#F5D2C1` | **pale peach** — photograph frames, chips (the client's colour, kept) | 11.0:1 |
| `rose` | `#F2C3D0` | dusty rose feature wash | 9.9:1 |
| `apricot` | `#EEB9A4` | the one peach feature surface, used sparingly | 8.6:1 |
| `tangerine` | `#C4708A` | mid rose for small marks | — |
| `ember` | `#AC5068` | **the action stop** — buttons | 5.0:1 with cream type |
| `ember-deep` | `#6B2337` | wine depth stop | 10.6:1 with cream |
| `espresso` | `#2A1920` | plum near-black for the two deep bands | 16.5:1 with cream |
| `ink` | `#2A2024` | body type | 15.5:1 |
| `ink-soft` | `#55484E` | secondary type | 7.5:1 on blush |
| `ink-muted` | `#635257` | captions, labels | 5.9:1 on blush |

`#AC5068` is hue 344°, saturation 37% — deep and greyed enough to read as a
wine rose rather than candy. It is the only place cream type sits on colour in
the whole build; every light surface keeps charcoal type, which is where the
15:1 ratios live.

## Three things the first attempts got wrong

1. **Bright pink at scale reads as candy.** The first pass used `#E8678C`
   everywhere; at button size it was fine, but the instant it appeared on a band
   it looked like a sweet shop and undercut the clinical credibility. Now the
   saturated stop appears only on the action, never as a field.
2. **Pink blended into peach turns fleshy.** A rose-to-peach gradient passes
   through a salmon midpoint that reads like skin at full-bleed width. The large
   washes are now rose-only, and peach meets pink only as adjacent flat
   surfaces — a peach frame against a rose field — where the eye reads two
   intentions instead of a muddy third.
3. **Cream type on the glass button disappeared.** Once the action went deep,
   `.btn` had to carry cream type — but `.btn-glass` inherits `.btn` and sits on
   a light surface, so it needs its charcoal type back. Caught on screenshot, not
   by a test.

## What this means for the photographs

They were white-balanced for a warm page, and that job is done — every frame is
within ±5% of neutral in its highlights. What is left in them is real room
colour. Against pink, eight frames sit in the orange band for 46–67% of their
pixels: `corridor`, `hospital-exterior`, `research-desk`, `antenatal`,
`screening-room`, `surgery`, `cervical-research`, `patient-quiet`.

The honest fix is to repaint those rooms in the files (blush or cream walls,
same rooms, same people, same composition), not to grade them: a pink wash over
a photograph is exactly the filter the client asked to have removed.

## Status

Tokens, shadows, glass, the hero wash, the deep bands, the OG card, the theme
colour and the cursor companion all follow the new palette. `warm-theme` and
`photography-palette` specs updated to these tokens and the full suite passes
(172/172) against the pink build.

A pilot repaint of `antenatal.jpg` (walls terracotta to blush, everything else
untouched) is proof the room repaint works at website scale; it is not committed
yet, because replacing one frame and not the other seven would look worse than
replacing none.

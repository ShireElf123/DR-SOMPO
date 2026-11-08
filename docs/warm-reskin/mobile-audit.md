# Phone audit — ratios, sizes and what was covering the photographs

Prompt: *"Audit fully. Ratios, sizes, everything I see on phone. Some pics are covered — I don't know if that's intentional."*

Measured at 390 × 844 with a mobile user agent across all twelve routes (`/`, `/services`,
six service pages, `/about`, `/research`, `/patient-info`, `/contact`). Every image was
checked against its clipping window — the part of the frame the eye can actually see —
not against its laid-out box, because the parallax layers are 44 % taller than the
window they sit in and report a crop that isn't real.

## The short answer on "pictures are covered"

**Two of them were a bug, not a treatment.** Interior page heroes and the closing call
to action put their text on a translucent glass card. That card is 96 % of the screen
width on a phone and grows taller than the photograph, so it covered 74–95 % of the
image: you were looking at a photo through a card, not at a photo. It only works from
`sm` up, where the panel is 1180 px wide and the plate is a fraction of the frame.

Everything else that covers a photograph is intentional and stays: the caption plates
on the service and condition cards (24–44 % of the frame, always at the bottom, always
on a near-opaque cream fill so the type clears AA), the gradient scrims, and the two
cards where the plate carries credentials or a location.

**Fixed:** on phones the photograph is now a band above the copy, and the copy sits on
cream below it. Same component, same DOM, one layout switch at 640 px. The hero on
`/services` used to be a consulting room behind a wash; it is now a consulting room.

## Ratios

The rule now: on a phone, landscape photographs get a landscape frame; only portraits
(or portrait-cropped people) get a portrait frame. Before this pass, four components
forced a 2.18:1 panorama into a 0.81 frame, which is a 63 % crop of the picture.

| Where | Frame before | Frame now | % of the photo visible |
| --- | --- | --- | --- |
| Home — service cards | 169 × 208 (0.81) | 350 × 224 (1.56) | 45 % → **86 %** |
| Home — service cards, hospital panorama | 169 × 208 (0.81) | 350 × 224 (1.56) | 37 % → **72 %** |
| Home — credentials portrait | 350 × 304 (1.15) | 350 × 352 (0.99) | 70 % → **81 %** |
| Home — hospital strip | 350 × 120 (2.92) | 350 × 144 (2.43) | 75 % → **90 %** |
| Home — hero portrait | 366 × 253 (1.45) | unchanged | 52 %, **intentional** (face-anchored, `object-position 62% 18%`) |
| Home — journey cards | 310 × 233 (1.33) | unchanged | 60 %, **intentional** (portrait cropped to landscape, face-anchored) |
| Home — closing CTA | photo under a 74 % glass card | 12 rem photo band, **0 % covered** | — |
| Interior page heroes (7 routes) | photo under a 74–95 % glass card | 16/10 photo band, **0 % covered** | — |
| `/services` — condition cards | 350 × 197 (1.78) | 350 × 263 (1.33) | 75 % → **99 %** |
| `/about`, `/research` — portrait plates | 4/5 (0.80) | 4/3 (1.33) | 60 % → **99 %** |
| `/contact` — directions card | 350 × 197 (1.78) | unchanged | 81 % |

Service cards are now one per row on phones. Two 169 px columns could not hold a
photograph, and the section is the main visual argument on the page; the page grew by
11 % (10,186 px → 11,283 px) and every card gained a legible caption.

## Sizes

Every piece of text on a phone was 10 or 11 px — including the body copy of half the
cards. On a 1440 px canvas that reads as a caption; on a 390 px phone it is the primary
reading size, and it is too small.

| Class | Was | Now | Carries |
| --- | --- | --- | --- |
| `text-[10px]` | 10 px | **11 px** | micro-labels, chips, legal notes |
| `text-[11px]` | 11 px | **12 px** | card blurbs, captions, stage notes |
| `text-[12px]` | 12 px | **13 px** | intros, list items |
| `.tag` eyebrows | 11 px | 11 px | uppercase, 0.17 em tracking — legible as a label |
| Body copy | 14–16 px | unchanged | already at reading size |

The smallest text anywhere on a phone is now 11 px. Implemented as one media query in
`app/globals.css` rather than ~200 component edits, so the phone scale lives in one
place; it is an override of the utility classes, and it is documented there.

## Touch targets

| Control | Was | Now |
| --- | --- | --- |
| Header call and menu buttons | 36 × 36 | **44 × 44** |
| Primary actions (`.btn`) | 37.6 px tall | **44 px** on phones |
| Footer phone and email links | 15 px tall | **24 px** |

Still below 44 px and staying: the two marquee pause buttons (32 × 32, above the 24 px
WCAG 2.5.8 floor and deliberately unobtrusive), and inline links inside sentences,
which are exempt. Nothing on any route is under 24 px.

## What the numbers say across all twelve routes

- No horizontal scrolling anywhere: `scrollWidth` equals 390 on every route. The
  elements that overflow their container are the marquee tracks and two decorative
  off-canvas shapes, both clipped.
- Every image is inside a rounded frame with `overflow: hidden`; no image overflows its
  card on any route.
- Section rhythm on phones is now: photo band → cream copy → content. The same order as
  the home hero, which is why the interior pages no longer feel like a different site.

## Not changed, on purpose

- **Home hero crop.** 52 % of the portrait survives, deliberately: the frame is anchored
  to her face and the photograph is a portrait, so any wider frame would become a
  letterbox of her midriff.
- **Portrait-to-landscape crops** on journey cards and `/patient-info` (60 %). These are
  pictures of people, anchored at 18–20 % of the frame height so the face stays centred.
- **Caption plates** over photography. They are part of the language of the site and they
  are what keeps the type at AA contrast on a photograph.

---

# Second pass — the photographs still covered, and the missing tonal depth

The first pass fixed the two structural bugs (hero plates and the closing call to action
that swallowed the photograph). It did not catch everything, and the palette had a
second problem that only showed up once the deep bands were measured: **the whole page
sat in a narrow light band.** Everything from the ticker to the footer was apricot,
cream or glass — no value anywhere below L 40 — so the warmth read as flatness rather
than as depth. Both were fixed in the same pass.

## A correction to how I measured the first time

`plates.mjs` reports the caption plate's area as a share of **the card that contains
it**, not of the photograph. On interior heroes the card also holds the copy block, so
`/research` came back as "53 % of the picture covered" when the photograph above the
copy is in fact uncovered. Those hero numbers (43–53 %) are measurement artefacts and
are withdrawn. The numbers below are plate-area against **photograph frame**, read off
screenshots, not off bounding boxes.

## Fixed this pass

| Where | Was | Now | What changed |
| --- | --- | --- | --- |
| Home, credentials portrait in the bento | 50 % plate over the frame | plate clears her face and coat; ~34 % of the frame | card floor raised to `min-h-[24rem]` so the portrait has room above the plate |
| Home, hospital strip | 33 % visible (plate + a second line of address) | ~62 % visible | strip floor `min-h-[10.5rem]`, third address line hidden below `sm` |
| `/contact`, directions photograph | 36 % visible | 64 % visible, plate now 27 % of the card | frame changed from `aspect-[16/9]` to `aspect-[4/3]` on phones |
| `/contact`, card in the closing teaser | plate taller than the photo | photo holds | card floor `min-h-[19rem]` |

The `/about` qualifications plate stayed at 21 % of the card: the portrait above it shows
her face, shoulders and coat, and the plate carries the four credentials. That one is
the design, not a defect.

## Tonal depth — measured, not asserted

The frames are now espresso. `.ticker-gradient` runs `#2a1813 → #4a2010 → #7a2e00` and
`.ember-deep-gradient` runs `#2a1813 → #3f1a0d → #7a2e00` at 145°, both with an OKLab
`radial` companion. The ticker, the footer frame and one statement tile in the home bento
use them; all three sets cream type, and the `ScrollWords` inside the tile switched to a
dark tint (cream lit, `rgba(253,248,242,0.72)` dim) so the scrim doesn't grey it out.

Pixel histogram of the home page at 1280, area-weighted, sampled every fourth pixel:

| | Before (light bands) | After (deep bands) |
| --- | --- | --- |
| share of page below L 40 | 7.7 % | **14.8 %** |
| share between L 10–20 | 0 % | 7.0 % |
| share between L 0–10 | 0 % | 0.7 % |
| mean L | 84.5 | 79.9 |
| share above L 80 | 72.5 % | 72.4 % |

That is a genuine dark anchor — the page now has a bottom and a top — while the light
middle is untouched: the same 72 % of the page is still cream and apricot, so the
feminine read survives. Contrast is not traded away for it: cream on `#7a2e00` is 8.9:1,
cream at 0.72 opacity on the lightest deep stop is 6.4:1, and the footer's own ink
luminance is above 0.8.

## What the tests now hold

`tests/e2e/warm-theme.spec.ts` was rewritten rather than satisfied, because its old rules
("no surface below L 0.35 anywhere", "footer ink is charcoal `rgb(38,34,31)`") describe
the flat page this pass deliberately replaced:

- exactly **one** section-level surface per page may sit below L 0.35 — the depth reads
  as an ending, not as a theme;
- every painted surface stays warm (`r ≥ b`), so no cool grey creeps in with the dark;
- no `rgb(255,255,255)` type anywhere; footer ink luminance must exceed 0.8;
- the ticker and footer are screenshotted and checked as **painted pixels** against their
  own computed ink (≥ 4.5:1), with light fills inside the band — the cream booking pill —
  excluded, since those carry their own dark ink.

166/166 Playwright checks pass; `tsc`, `eslint --max-warnings=0` and `next build` are
clean; gzip budgets hold at JS 204,625 / CSS 16,210 / HTML 27,330 against 204,800 /
16,384 / 30,720.

---

# Third pass — the reading scale on a desktop

Prompt: *"Optimize for PC too, some text look small on PC."*

**It was not a few labels.** Measured across seven routes at 1440, counting every
character a reader actually sees:

| Rendered size | Share of all characters |
| --- | --- |
| 10px | 15.4 % |
| 11px | 18.9 % |
| 12px | 24.8 % |
| 13px | 32.5 % |
| 15px | 2.2 % |
| 17px+ | 2.3 % |

Three quarters of the site was set at 10–12 px, and it included whole paragraphs,
the 38-item condition list, the service card descriptions, the form labels and the
safety disclaimers ("General information only — not medical advice"). The sizes were
chosen on a 1440 canvas as captions, then reused for copy. The phone-only floor added
in the first pass was quietly doing a better job than the desktop.

## What changed

The five arbitrary sizes that carry all the copy are remapped, once, in `globals.css`:
214 utility classes across 26 components keep their markup and their rhythm, and the
whole scale moves up.

| Utility | Phones (< 640) | 640 px and up |
| --- | --- | --- |
| `text-[10px]` | 11.5 | 12 — micro-labels, chips, credentials |
| `text-[11px]` | 12.5 | 13.5 — card meta lines |
| `text-[12px]` | 13.5 | 15 — secondary copy |
| `text-[13px]` | 14.5 | 16 — body |
| `text-[14px]` | 15 | 17 — leads |

At 1440 the character mix goes from "59 % under 12 px" to **80 % at 15–17 px**, with
nothing above 10 px carrying a sentence. Long runs of copy below 13 px: zero.

## Also fixed while measuring

- **Hero copy at 640–1023.** The copy column sat straight on the photograph; sampled
  behind each line, the darkest tenth of it measured 2.0–4.5:1 — fine on the bright
  wall, not on her coat. The hero now stacks under 1024 (photo band, copy on cream,
  the same shape as the phone) and keeps an opaque-to-feathered cream wash behind the
  copy from 1024 up. Measured worst line: **14.7:1** at 768, 1024 and 1440.
- **The copy column was 42rem wide inside a 736 px card** at tablet widths, leaving a
  strip of the peach background beside it; it is full width below `lg` now.
- **Navigation** grew with the scale and wrapped "Patient info" onto two lines. The
  nav keeps its own 14 px size and no longer wraps.
- **Preferred day** chips overflowed the form column; they wrap on `lg` and up.
- **Small print** that was still 12 px after the remap — the emergency line, the
  footer disclaimer, the research abstract note, the POPIA line on `/contact`, the
  membership note on `/about` — moved up a tier to 13.5–15 px.
- **Large monitors** were getting a 1200 px column in a 1920 px window; the shell
  widens to 1360 px at 1600 and up, so the page stops floating in its margins.

## Held by tests

`tests/e2e/reading-scale.spec.ts` (new, 5 checks):

- at 1280, 1440 and 1920, on all seven content routes: no run of 60 characters or
  more renders below 13 px, the character-weighted mean stays above 13.8 px, and the
  page never scrolls sideways;
- the shell is 1300 px or wider at 1920 and no wider than 1210 at 1280;
- the hero support copy is sampled as **painted pixels** at 768, 1024 and 1440 and
  must clear 4.5:1 behind every line.

171/171 Playwright checks pass; `tsc`, `eslint --max-warnings=0` and `next build` are
clean. Budgets: JS 199.8 KiB / 204,800, CSS **15.9 KiB / 16,384** (61 bytes of
headroom — the next CSS addition will need something removed), HTML 26.7 KiB / 30,720.

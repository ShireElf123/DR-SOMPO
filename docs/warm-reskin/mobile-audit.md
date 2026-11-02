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
